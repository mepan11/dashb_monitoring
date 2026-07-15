import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get class info
    const [classRows]: any = await db.query(
      `SELECT c.id, c.class_name AS className, t.name AS homeroomTeacher
       FROM classes c
       LEFT JOIN teachers t ON c.homeroom_teacher_id = t.id
       WHERE c.id = ?`,
      [id]
    );

    const cls = classRows[0];
    if (!cls) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get students belonging to this class
    const [studentRows]: any = await db.query(
      `SELECT id, name, gender_text, gender_code, nisn, status 
       FROM students 
       WHERE class_label = ?
       ORDER BY name ASC`,
      [cls.className]
    );

    const total = studentRows.length;
    const male = studentRows.filter((s: any) => s.gender_code === "L").length;
    const female = studentRows.filter((s: any) => s.gender_code === "P").length;

    const students = studentRows.map((s: any, idx: number) => {
      const nameParts = s.name.trim().split(" ");
      const initials = nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0] || "S"}`.toUpperCase();

      return {
        id: String(s.id),
        name: s.name,
        absenNumber: `Absen #${String(idx + 1).padStart(2, "0")}`,
        nisn: s.nisn,
        gender: s.gender_text,
        status: s.status,
        initials,
      };
    });

    return NextResponse.json({
      success: true,
      className: cls.className,
      homeroomTeacher: cls.homeroomTeacher || "Belum ditentukan",
      stats: { total, male, female },
      data: students,
    });
  } catch (error: any) {
    console.error("Class Students API GET Error:", error);
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
    const { id } = await params;
    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Siswa wajib dipilih" },
        { status: 400 }
      );
    }

    // Get class name
    const [classRows]: any = await db.query(
      "SELECT class_name FROM classes WHERE id = ?",
      [id]
    );
    const cls = classRows[0];
    if (!cls) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if student already has a class in the current period
    const [studentRows]: any = await db.query(
      "SELECT name, class_label FROM students WHERE id = ?",
      [studentId]
    );
    const student = studentRows[0];
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    if (student.class_label && student.class_label !== "—" && student.class_label !== "") {
      return NextResponse.json(
        { success: false, message: `Siswa ${student.name} sudah terdaftar di kelas ${student.class_label} pada periode ini` },
        { status: 400 }
      );
    }

    // Update class_label of student
    await db.query(
      "UPDATE students SET class_label = ? WHERE id = ?",
      [cls.class_name, studentId]
    );

    return NextResponse.json({
      success: true,
      message: "Siswa berhasil ditambahkan ke kelas",
    });
  } catch (error: any) {
    console.error("Class Students API POST Error:", error);
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
    const { id } = await params;
    const url = new URL(request.url);
    const studentId = url.searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Student ID wajib disertakan" },
        { status: 400 }
      );
    }

    // Set class_label to NULL to remove student from this class
    await db.query(
      "UPDATE students SET class_label = NULL WHERE id = ?",
      [studentId]
    );

    return NextResponse.json({
      success: true,
      message: "Siswa berhasil dikeluarkan dari kelas",
    });
  } catch (error: any) {
    console.error("Class Students API DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
