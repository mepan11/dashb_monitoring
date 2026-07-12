import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows]: any = await db.query(
      "SELECT id, name, gender_text, gender_code, nisn, class_label, status FROM students WHERE id = ?",
      [id]
    );

    const student = rows[0];
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    const nameParts = student.name.trim().split(" ");
    const initials =
      nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0] || "S"}`.toUpperCase();

    // Attendance rate
    const [attRows]: any = await db.query(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN status = 'Hadir' THEN 1 ELSE 0 END) AS hadir
       FROM student_attendance WHERE student_id = ?`,
      [id]
    );
    const attTotal = Number(attRows[0]?.total) || 0;
    const attHadir = Number(attRows[0]?.hadir) || 0;
    const attendanceRate = attTotal > 0 ? Math.round((attHadir / attTotal) * 100) : null;

    // Grades from this student (through class_label match to classes)
    const [gradeRows]: any = await db.query(
      `SELECT g.daily_assignment, g.uts, g.uas, g.average,
              subj.name AS subject_name
       FROM grades g
       JOIN classes c ON g.class_id = c.id
       LEFT JOIN class_subjects cs ON cs.class_id = c.id
       LEFT JOIN subjects subj ON cs.subject_id = subj.id
       WHERE g.student_id = ?
       LIMIT 10`,
      [id]
    );

    // Homeroom teacher from classes matched to student class_label
    const [hrtRows]: any = await db.query(
      `SELECT t.name AS teacher_name, c.class_name, c.academic_year
       FROM classes c
       LEFT JOIN teachers t ON c.homeroom_teacher_id = t.id
       WHERE c.class_name LIKE ?
       LIMIT 1`,
      [`%${student.class_label.replace("Kelas ", "").trim()}%`]
    );
    const hrt = hrtRows[0] || null;

    return NextResponse.json({
      success: true,
      data: {
        id: String(student.id),
        name: student.name,
        genderText: student.gender_text,
        genderCode: student.gender_code,
        nisn: student.nisn,
        classLabel: student.class_label,
        status: student.status,
        initials,
        attendanceRate,
        grades: gradeRows,
        homeroomTeacher: hrt?.teacher_name || null,
        academicYear: hrt?.academic_year || "2025/2026",
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
    const { name, genderCode, nisn, classLabel, status } = await request.json();

    if (!name || !nisn || !classLabel) {
      return NextResponse.json(
        { success: false, message: "Nama, NISN, dan Kelas wajib diisi" },
        { status: 400 }
      );
    }

    const genderText = genderCode === "P" ? "Perempuan" : "Laki-laki";

    const [result]: any = await db.query(
      `UPDATE students SET name = ?, gender_text = ?, gender_code = ?, nisn = ?, class_label = ?, status = ?
       WHERE id = ?`,
      [name, genderText, genderCode, nisn, classLabel, status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

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
