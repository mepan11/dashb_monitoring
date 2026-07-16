import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: classId } = await params;
    const url = new URL(request.url);
    const periodId = url.searchParams.get("period_id");

    // Resolusi period_id aktif
    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // Ambil info kelas
    const [classRows]: any = await db.query(
      "SELECT id, class_name AS className FROM classes WHERE id = ?",
      [classId]
    );
    if (classRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    // Dapatkan class_period_id
    const [classPeriodRows]: any = await db.query(
      "SELECT id FROM class_periods WHERE class_id = ? AND period_id = ?",
      [classId, activePeriodId]
    );
    const classPeriodId = classPeriodRows[0]?.id;
    if (!classPeriodId) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Ambil mata pelajaran di kelas ini pada periode aktif
    const [subjects]: any = await db.query(
      `SELECT cs.id AS classSubjectId, sp.subject_id AS subjectId, tp.teacher_id AS teacherId,
              s.name AS subjectName, s.code AS subjectCode,
              t.name AS teacherName,
              cs.schedule_day AS scheduleDay, cs.start_time AS startTime, cs.end_time AS endTime
       FROM class_subjects cs
       JOIN subject_periods sp ON cs.subject_period_id = sp.id
       JOIN subjects s ON sp.subject_id = s.id
       LEFT JOIN teacher_periods tp ON cs.teacher_period_id = tp.id
       LEFT JOIN teachers t ON tp.teacher_id = t.id
       WHERE cs.class_period_id = ?`,
      [classPeriodId]
    );

    // Formulasi output bersih
    const formattedSubjects = subjects.map((subj: any) => {
      const nameParts = (subj.teacherName || "Guru Pengajar").trim().split(" ");
      const initials = nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0] || "G"}`.toUpperCase();

      let scheduleText = "Jadwal belum ditentukan";
      let days: any[] = [];
      if (subj.scheduleDay) {
        try {
          const parsed = JSON.parse(subj.scheduleDay);
          if (Array.isArray(parsed)) {
            days = parsed;
            if (days.length > 0) {
              if (typeof days[0] === "object" && days[0] !== null) {
                scheduleText = days.map((d: any) => `${d.day} (${d.startTime || ""} - ${d.endTime || ""})`).join(", ");
              } else {
                scheduleText = `${days.join(", ")} (${subj.startTime || ""} - ${subj.endTime || ""})`;
              }
            }
          }
        } catch (e) {
          console.error("Failed to parse scheduleDay JSON:", e);
        }
      }

      return {
        id: String(subj.subjectId),
        classSubjectId: String(subj.classSubjectId),
        name: subj.subjectName,
        code: subj.subjectCode,
        category: subj.subjectCode?.includes("BING") || subj.subjectCode?.includes("MAT") || subj.subjectCode?.includes("IPA") ? "AKADEMIK" : "NON-AKADEMIK",
        teacherId: subj.teacherId,
        teacher: subj.teacherName || "Belum ditugaskan",
        teacherInitials: initials,
        schedule: scheduleText,
        scheduleDays: days,
        startTime: subj.startTime || "",
        endTime: subj.endTime || "",
        progress: 75,
      };
    });

    const [periodRows]: any = await db.query(
      "SELECT academic_year, semester FROM academic_periods WHERE id = ?",
      [activePeriodId]
    );

    return NextResponse.json({
      success: true,
      className: classRows[0].className,
      academicYear: periodRows[0]?.academic_year || "—",
      data: formattedSubjects,
    });
  } catch (error: any) {
    console.error("Class Subjects GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: classId } = await params;
    const { subjectId, teacherId, scheduleDays, startTime, endTime, periodId } = await request.json();

    if (!subjectId || !teacherId) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran dan Guru pengajar wajib dipilih" },
        { status: 400 }
      );
    }

    // Resolusi period_id aktif
    let activePeriodId = periodId;
    if (!activePeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // Resolve class_period_id
    const [classPeriodRow]: any = await db.query(
      "SELECT id FROM class_periods WHERE class_id = ? AND period_id = ?",
      [classId, activePeriodId]
    );
    const classPeriodId = classPeriodRow[0]?.id;

    // Resolve subject_period_id
    const [subjectPeriodRow]: any = await db.query(
      "SELECT id FROM subject_periods WHERE subject_id = ? AND period_id = ?",
      [subjectId, activePeriodId]
    );
    const subjectPeriodId = subjectPeriodRow[0]?.id;

    // Resolve teacher_period_id
    const [teacherPeriodRow]: any = await db.query(
      "SELECT id FROM teacher_periods WHERE teacher_id = ? AND period_id = ?",
      [teacherId, activePeriodId]
    );
    const teacherPeriodId = teacherPeriodRow[0]?.id;

    if (!classPeriodId || !subjectPeriodId || !teacherPeriodId) {
      return NextResponse.json(
        { success: false, message: "Relasi periode untuk kelas, mata pelajaran, atau guru tidak ditemukan" },
        { status: 404 }
      );
    }

    // Bersihkan mata pelajaran yang sama terlebih dahulu untuk menghindari konflik primary key
    await db.query(
      "DELETE FROM class_subjects WHERE class_period_id = ? AND subject_period_id = ?",
      [classPeriodId, subjectPeriodId]
    );

    // Hitung startTime dan endTime legacy untuk fallback kolum
    const firstSched = scheduleDays && scheduleDays[0];
    const computedStartTime = firstSched && typeof firstSched === "object" ? firstSched.startTime : (startTime || "");
    const computedEndTime = firstSched && typeof firstSched === "object" ? firstSched.endTime : (endTime || "");

    // Insert relasi baru
    await db.query(
      `INSERT INTO class_subjects (class_period_id, subject_period_id, teacher_period_id, schedule_day, start_time, end_time)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        classPeriodId,
        subjectPeriodId,
        teacherPeriodId,
        JSON.stringify(scheduleDays || []),
        computedStartTime,
        computedEndTime
      ]
    );

    return NextResponse.json({ success: true, message: "Mata pelajaran berhasil ditambahkan ke kelas" });
  } catch (error: any) {
    console.error("Class Subjects POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: classId } = await params;
    const url = new URL(request.url);
    const subjectId = url.searchParams.get("subjectId");
    const periodId = url.searchParams.get("period_id");

    if (!subjectId) {
      return NextResponse.json(
        { success: false, message: "Subject ID wajib disertakan" },
        { status: 400 }
      );
    }

    // Resolusi period_id aktif
    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // Resolve class_period_id
    const [classPeriodRow]: any = await db.query(
      "SELECT id FROM class_periods WHERE class_id = ? AND period_id = ?",
      [classId, activePeriodId]
    );
    const classPeriodId = classPeriodRow[0]?.id;

    // Resolve subject_period_id
    const [subjectPeriodRow]: any = await db.query(
      "SELECT id FROM subject_periods WHERE subject_id = ? AND period_id = ?",
      [subjectId, activePeriodId]
    );
    const subjectPeriodId = subjectPeriodRow[0]?.id;

    if (!classPeriodId || !subjectPeriodId) {
      return NextResponse.json(
        { success: false, message: "Relasi periode tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.query(
      "DELETE FROM class_subjects WHERE class_period_id = ? AND subject_period_id = ?",
      [classPeriodId, subjectPeriodId]
    );

    return NextResponse.json({ success: true, message: "Mata pelajaran berhasil dihapus dari kelas" });
  } catch (error: any) {
    console.error("Class Subjects DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
