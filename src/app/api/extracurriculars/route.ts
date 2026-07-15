import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const periodId = url.searchParams.get("period_id");

    let query = `
      SELECT e.id, e.name, e.category, e.schedule, e.location, e.contact,
             c.name AS coachName, e.coach_id AS coachId, e.period_id AS periodId
      FROM extracurriculars e
      LEFT JOIN coaches c ON e.coach_id = c.id
    `;
    const params = [];
    if (periodId && periodId !== "undefined") {
      query += " WHERE e.period_id = ?";
      params.push(periodId);
    }
    query += " ORDER BY e.name ASC";

    const [rows]: any = await db.query(query, params);
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("Extracurriculars GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, category, coachId, schedule, location, contact, periodId } = await request.json();

    if (!name || !category || !schedule || !location || !contact) {
      return NextResponse.json(
        { success: false, message: "Seluruh parameter wajib diisi (kecuali Coach)" },
        { status: 400 }
      );
    }

    // Ambil period_id aktif jika tidak disediakan
    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      targetPeriodId = activePeriod[0]?.id || 1;
    }

    const [result]: any = await db.query(
      `INSERT INTO extracurriculars (name, category, coach_id, schedule, location, contact, period_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, category, coachId || null, schedule, location, contact, targetPeriodId]
    );

    return NextResponse.json({
      success: true,
      message: "Ekstrakurikuler berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error: any) {
    console.error("Extracurriculars POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
