import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows]: any = await db.query(
      "SELECT id, name, code, description, period_id FROM subjects WHERE id = ?",
      [id]
    );

    const subject = rows[0];
    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: subject });
  } catch (error: any) {
    console.error("Subject GET detail error:", error);
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
    const { name, code, description, periodId } = await request.json();

    if (!name || !code) {
      return NextResponse.json(
        { success: false, message: "Nama dan Kode mata pelajaran wajib diisi" },
        { status: 400 }
      );
    }

    // Ambil period_id saat ini jika tidak disediakan
    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      const [current]: any = await db.query("SELECT period_id FROM subjects WHERE id = ?", [id]);
      targetPeriodId = current[0]?.period_id || null;
    }

    const [result]: any = await db.query(
      "UPDATE subjects SET name = ?, code = ?, description = ?, period_id = ? WHERE id = ?",
      [name, code, description || "", targetPeriodId, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mata pelajaran berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("Subject PUT detail error:", error);
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

    // Hapus relasi class_subjects terlebih dahulu
    await db.query("DELETE FROM class_subjects WHERE subject_id = ?", [id]);

    const [result]: any = await db.query("DELETE FROM subjects WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mata pelajaran berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Subject DELETE detail error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
