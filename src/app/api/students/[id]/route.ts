import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const periodIdParam = url.searchParams.get("period_id");

    let activePeriodId = periodIdParam;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    const [rows]: any = await db.query(
      "SELECT id, name, gender_text, gender_code, nisn, status FROM students WHERE id = ?",
      [id]
    );

    const student = rows[0];
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    // Find student_period
    const [spRows]: any = await db.query(
      `SELECT sp.id, cl.class_name AS class_label 
       FROM student_periods sp 
       LEFT JOIN class_periods clp ON sp.class_period_id = clp.id
       LEFT JOIN classes cl ON clp.class_id = cl.id
       WHERE sp.student_id = ? AND sp.period_id = ?`,
      [id, activePeriodId]
    );
    const studentPeriod = spRows[0] || null;
    const studentPeriodId = studentPeriod?.id;

    const nameParts = student.name.trim().split(" ");
    const initials =
      nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0] || "S"}`.toUpperCase();

    let attendanceRate = null;
    let grades: any[] = [];
    let homeroomTeacher = null;
    let academicYear = "2025/2026";

    if (studentPeriodId) {
      // Attendance rate filtered by student_period_id
      const [attRows]: any = await db.query(
        `SELECT COUNT(*) AS total,
                SUM(CASE WHEN status = 'Hadir' THEN 1 ELSE 0 END) AS hadir
         FROM student_attendance WHERE student_period_id = ?`,
        [studentPeriodId]
      );
      const attTotal = Number(attRows[0]?.total) || 0;
      const attHadir = Number(attRows[0]?.hadir) || 0;
      attendanceRate = attTotal > 0 ? Math.round((attHadir / attTotal) * 100) : null;

      // Grades from this student
      const [gradeRows]: any = await db.query(
        `SELECT g.daily_assignment, g.uts, g.uas, g.average,
                subj.name AS subject_name
         FROM grades g
         JOIN class_subjects cs ON g.class_subject_id = cs.id
         JOIN subject_periods sp ON cs.subject_period_id = sp.id
         JOIN subjects subj ON sp.subject_id = subj.id
         WHERE g.student_period_id = ?
         LIMIT 10`,
        [studentPeriodId]
      );
      grades = gradeRows;

      // Homeroom teacher
      if (studentPeriod?.class_label) {
        const [hrtRows]: any = await db.query(
          `SELECT t.name AS teacher_name, c.class_name, ap.academic_year
           FROM class_periods clp
           JOIN classes c ON clp.class_id = c.id
           JOIN academic_periods ap ON clp.period_id = ap.id
           LEFT JOIN teacher_periods tp ON clp.homeroom_teacher_id = tp.id
           LEFT JOIN teachers t ON tp.teacher_id = t.id
           WHERE c.class_name = ? AND clp.period_id = ?
           LIMIT 1`,
          [studentPeriod.class_label, activePeriodId]
        );
        const hrt = hrtRows[0];
        if (hrt) {
          homeroomTeacher = hrt.teacher_name;
          academicYear = hrt.academic_year;
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: String(student.id),
        name: student.name,
        genderText: student.gender_text,
        genderCode: student.gender_code,
        nisn: student.nisn,
        classLabel: studentPeriod?.class_label || "",
        status: student.status,
        periodId: activePeriodId,
        initials,
        attendanceRate,
        grades,
        homeroomTeacher,
        academicYear,
      },
    });
  } catch (error: any) {
    console.error("Student Detail API GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, genderCode, nisn, classLabel, status, periodId } = await request.json();

    if (!name || !nisn) {
      return NextResponse.json(
        { success: false, message: "Nama dan NISN wajib diisi" },
        { status: 400 }
      );
    }

    // Resolusi periodId
    let activePeriodId = periodId;
    if (!activePeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    const genderText = genderCode === "P" ? "Perempuan" : "Laki-laki";

    // 1. Update student master data
    const [result]: any = await db.query(
      `UPDATE students SET name = ?, gender_text = ?, gender_code = ?, nisn = ?, status = ?
       WHERE id = ?`,
      [name, genderText, genderCode, nisn, status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    // 2. Resolve class_period_id from classLabel
    let classPeriodId = null;
    if (classLabel) {
      const targetClassName = classLabel.startsWith("Kelas") ? classLabel : `Kelas ${classLabel}`;
      const [classPeriodRow]: any = await db.query(
        `SELECT clp.id FROM class_periods clp 
         JOIN classes c ON clp.class_id = c.id 
         WHERE c.class_name = ? AND clp.period_id = ?`,
        [targetClassName, activePeriodId]
      );
      if (classPeriodRow.length > 0) {
        classPeriodId = classPeriodRow[0].id;
      }
    }

    // 3. Link or update in student_periods
    await db.query(
      `INSERT INTO student_periods (student_id, period_id, class_period_id, is_active)
       VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE class_period_id = ?`,
      [id, activePeriodId, classPeriodId, classPeriodId]
    );

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("Student Detail API PUT Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [result]: any = await db.query("DELETE FROM students WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Student Detail API DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
