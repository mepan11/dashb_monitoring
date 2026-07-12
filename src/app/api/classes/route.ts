import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [classes]: any = await db.query(
      `SELECT c.id, 
              c.class_name AS name,
              c.class_name AS className, 
              t.name AS homeroomTeacher,
              c.homeroom_teacher_id AS homeroomTeacherId,
              c.capacity,
              c.academic_year AS academicYear,
              c.semester,
              (SELECT COUNT(*) FROM students WHERE class_label = c.class_name) AS studentsCount,
              (SELECT COUNT(*) FROM class_subjects WHERE class_id = c.id) AS subjectsCount
       FROM classes c
       LEFT JOIN teachers t ON c.homeroom_teacher_id = t.id
       ORDER BY c.class_name ASC`
    );
    return NextResponse.json({ success: true, data: classes });
  } catch (error: any) {
    console.error("Classes GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { className, homeroomTeacherId, capacity, academicYear, semester } = await request.json();

    if (!className) {
      return NextResponse.json(
        { success: false, message: "Nama kelas wajib diisi" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `INSERT INTO classes (class_name, homeroom_teacher_id, academic_year, semester, capacity)
       VALUES (?, ?, ?, ?, ?)`,
      [className, homeroomTeacherId || null, academicYear || "2025/2026", semester || "Ganjil", capacity || 32]
    );

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error: any) {
    console.error("Classes POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
