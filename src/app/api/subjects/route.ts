import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const periodId = url.searchParams.get("period_id");

    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    const query = `
      SELECT s.id, s.name, s.code, s.description, sp.period_id 
      FROM subjects s
      JOIN subject_periods sp ON s.id = sp.subject_id AND sp.period_id = ?
      ORDER BY s.name ASC
    `;

    const [subjects]: any = await db.query(query, [activePeriodId]);
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

    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      targetPeriodId = activePeriod[0]?.id || 1;
    }

    // 1. Dapatkan atau buat mata pelajaran master
    let subjectId: number;
    const [existingMaster]: any = await db.query(
      "SELECT id FROM subjects WHERE code = ?",
      [code]
    );

    if (existingMaster.length > 0) {
      subjectId = existingMaster[0].id;
      // Update data master
      await db.query(
        "UPDATE subjects SET name = ?, description = ? WHERE id = ?",
        [name, description || "", subjectId]
      );
    } else {
      const [insertRes]: any = await db.query(
        "INSERT INTO subjects (name, code, description) VALUES (?, ?, ?)",
        [name, code, description || ""]
      );
      subjectId = insertRes.insertId;
    }

    // 2. Hubungkan ke periode akademik
    await db.query(
      "INSERT IGNORE INTO subject_periods (subject_id, period_id, is_active) VALUES (?, ?, 1)",
      [subjectId, targetPeriodId]
    );

    return NextResponse.json({
      success: true,
      message: "Mata pelajaran berhasil ditambahkan",
      id: subjectId,
    });
  } catch (error: any) {
    console.error("Subjects POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
