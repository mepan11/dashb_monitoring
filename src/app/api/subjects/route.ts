import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const periodId = url.searchParams.get("period_id");

    let query = "SELECT id, name, code, description, period_id FROM subjects";
    const params = [];
    if (periodId && periodId !== "undefined") {
      query += " WHERE period_id = ?";
      params.push(periodId);
    }
    query += " ORDER BY name ASC";

    const [subjects]: any = await db.query(query, params);
    return NextResponse.json({ success: true, data: subjects });
  } catch (error: any) {
    console.error("Subjects GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, code, description, periodId } = await request.json();

    if (!name || !code) {
      return NextResponse.json(
        { success: false, message: "Nama dan Kode mata pelajaran wajib diisi" },
        { status: 400 }
      );
    }

    // Ambil periode aktif jika tidak disediakan
    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      targetPeriodId = activePeriod[0]?.id || null;
    }

    const [result]: any = await db.query(
      "INSERT INTO subjects (name, code, description, period_id) VALUES (?, ?, ?, ?)",
      [name, code, description || "", targetPeriodId]
    );

    return NextResponse.json({
      success: true,
      message: "Mata pelajaran berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error: any) {
    console.error("Subjects POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
