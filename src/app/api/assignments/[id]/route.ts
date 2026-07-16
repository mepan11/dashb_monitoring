import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Nama tugas wajib diisi" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      "UPDATE task_names SET name = ?, description = ? WHERE id = ?",
      [name, description || null, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Tugas master tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tugas master berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("Assignments PUT Error:", error);
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

    const [result]: any = await db.query(
      "DELETE FROM task_names WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Tugas master tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tugas master berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Assignments DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
