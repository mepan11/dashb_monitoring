import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows]: any = await db.query(
      `SELECT c.id, c.class_name AS className, 
              c.homeroom_teacher_id AS homeroomTeacherId,
              c.capacity,
              c.academic_year AS academicYear,
              c.semester
       FROM classes c
       WHERE c.id = ?`,
      [id]
    );

    const cls = rows[0];
    if (!cls) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: cls });
  } catch (error: any) {
    console.error("Class detail GET error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
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
    const { className, homeroomTeacherId, capacity, academicYear, semester } = await request.json();

    if (!className) {
      return NextResponse.json(
        { success: false, message: "Nama kelas wajib diisi" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `UPDATE classes 
       SET class_name = ?, homeroom_teacher_id = ?, capacity = ?, academic_year = ?, semester = ?
       WHERE id = ?`,
      [className, homeroomTeacherId || null, capacity || 32, academicYear || "2025/2026", semester || "Ganjil", id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("Class detail PUT error:", error);
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
    const [result]: any = await db.query("DELETE FROM classes WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Class detail DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
