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
      `SELECT s.id, s.name, s.code, s.description, sp.period_id 
       FROM subjects s
       JOIN subject_periods sp ON s.id = sp.subject_id
       WHERE s.id = ? AND sp.period_id = ?`,
      [id, activePeriodId]
    );

    const subject = rows[0];
    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran tidak ditemukan untuk periode ini" },
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

    // Resolusi period_id saat ini jika tidak disediakan
    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      const [current]: any = await db.query(
        "SELECT period_id FROM subject_periods WHERE subject_id = ? LIMIT 1",
        [id]
      );
      targetPeriodId = current[0]?.period_id || 1;
    }

    // 1. Update subject master
    const [result]: any = await db.query(
      "UPDATE subjects SET name = ?, code = ?, description = ? WHERE id = ?",
      [name, code, description || "", id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Mata pelajaran tidak ditemukan" },
        { status: 404 }
      );
    }

    // 2. Link in subject_periods
    await db.query(
      "INSERT IGNORE INTO subject_periods (subject_id, period_id, is_active) VALUES (?, ?, 1)",
      [id, targetPeriodId]
    );

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

    // Delete subject master (cascades to subject_periods, etc.)
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
