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

    let query = `
      SELECT e.id, ep.id AS extracurricularPeriodId, e.name, e.category, e.schedule, e.location, e.contact,
             c.name AS coachName, cp.coach_id AS coachId, ep.period_id AS periodId,
             (
               SELECT COUNT(*) 
               FROM extracurricular_students es 
               WHERE es.extracurricular_period_id = ep.id
             ) AS membersCount
      FROM extracurriculars e
      JOIN extracurricular_periods ep ON e.id = ep.extracurricular_id AND ep.period_id = ?
      LEFT JOIN extracurricular_coaches ec ON ep.id = ec.extracurricular_period_id
      LEFT JOIN coach_periods cp ON ec.coach_period_id = cp.id
      LEFT JOIN coaches c ON cp.coach_id = c.id
      ORDER BY e.name ASC
    `;

    const [rows]: any = await db.query(query, [activePeriodId]);
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

    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      targetPeriodId = activePeriod[0]?.id || 1;
    }

    // 1. Dapatkan atau buat ekskul master
    let extracurricularId: number;
    const [existingMaster]: any = await db.query(
      "SELECT id FROM extracurriculars WHERE name = ?",
      [name]
    );

    if (existingMaster.length > 0) {
      extracurricularId = existingMaster[0].id;
      // Update data master
      await db.query(
        `UPDATE extracurriculars 
         SET category = ?, schedule = ?, location = ?, contact = ? 
         WHERE id = ?`,
        [category, schedule, location, contact, extracurricularId]
      );
    } else {
      const [insertRes]: any = await db.query(
        `INSERT INTO extracurriculars (name, category, schedule, location, contact)
         VALUES (?, ?, ?, ?, ?)`,
        [name, category, schedule, location, contact]
      );
      extracurricularId = insertRes.insertId;
    }

    // 2. Hubungkan ke periode akademik
    await db.query(
      `INSERT INTO extracurricular_periods (extracurricular_id, period_id, is_active)
       VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE is_active = 1`,
      [extracurricularId, targetPeriodId]
    );

    // Dapatkan id dari extracurricular_periods
    const [epRows]: any = await db.query(
      "SELECT id FROM extracurricular_periods WHERE extracurricular_id = ? AND period_id = ?",
      [extracurricularId, targetPeriodId]
    );
    const epId = epRows[0].id;

    // 3. Hubungkan coach ke ekskul periode ini jika disediakan
    if (coachId) {
      // Dapatkan coach_period_id
      const [cpRows]: any = await db.query(
        "SELECT id FROM coach_periods WHERE coach_id = ? AND period_id = ?",
        [coachId, targetPeriodId]
      );
      if (cpRows.length > 0) {
        await db.query(
          `INSERT INTO extracurricular_coaches (extracurricular_period_id, coach_period_id)
           VALUES (?, ?)
           ON DUPLICATE KEY UPDATE coach_period_id = coach_period_id`,
          [epId, cpRows[0].id]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Ekstrakurikuler berhasil ditambahkan",
      id: extracurricularId,
    });
  } catch (error: any) {
    console.error("Extracurriculars POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
