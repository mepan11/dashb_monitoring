import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: classId } = await params;

    // Get class info
    const [classRows]: any = await db.query(
      "SELECT id, class_name AS className, academic_year AS academicYear FROM classes WHERE id = ?",
      [classId]
    );
    if (classRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get subjects inside this class
    const [subjects]: any = await db.query(
      `SELECT cs.subject_id AS subjectId, cs.teacher_id AS teacherId,
              s.name AS subjectName, s.code AS subjectCode,
              t.name AS teacherName,
              cs.schedule_day AS scheduleDay, cs.start_time AS startTime, cs.end_time AS endTime
       FROM class_subjects cs
       JOIN subjects s ON cs.subject_id = s.id
       LEFT JOIN teachers t ON cs.teacher_id = t.id
       WHERE cs.class_id = ?`,
      [classId]
    );

    // Formulate clean output
    const formattedSubjects = subjects.map((subj: any) => {
      const nameParts = (subj.teacherName || "Guru Pengajar").trim().split(" ");
      const initials = nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0] || "G"}`.toUpperCase();

      let days = [];
      try {
        if (subj.scheduleDay) {
          const parsed = JSON.parse(subj.scheduleDay);
          if (Array.isArray(parsed)) {
            days = parsed;
          }
        }
      } catch (e) {
        console.error("Failed to parse scheduleDay JSON:", e);
      }

      const scheduleText = days.length > 0 
        ? `${days.join(", ")} (${subj.startTime || ""} - ${subj.endTime || ""})` 
        : "Jadwal belum ditentukan";

      return {
        id: String(subj.subjectId),
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

    return NextResponse.json({
      success: true,
      className: classRows[0].className,
      academicYear: classRows[0].academicYear,
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
    const { subjectId, teacherId, scheduleDays, startTime, endTime } = await request.json();

    if (!subjectId || !teacherId) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran dan Guru pengajar wajib dipilih" },
        { status: 400 }
      );
    }

    // Insert or update rel
    await db.query(
      `INSERT INTO class_subjects (class_id, subject_id, teacher_id, schedule_day, start_time, end_time)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE teacher_id = ?, schedule_day = ?, start_time = ?, end_time = ?`,
      [
        classId, subjectId, teacherId, JSON.stringify(scheduleDays || []), startTime || "", endTime || "",
        teacherId, JSON.stringify(scheduleDays || []), startTime || "", endTime || ""
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

    if (!subjectId) {
      return NextResponse.json(
        { success: false, message: "Subject ID wajib disertakan" },
        { status: 400 }
      );
    }

    await db.query(
      "DELETE FROM class_subjects WHERE class_id = ? AND subject_id = ?",
      [classId, subjectId]
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
