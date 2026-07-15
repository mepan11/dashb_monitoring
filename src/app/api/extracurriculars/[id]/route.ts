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
      `SELECT e.id, e.name, e.category, cp.coach_id AS coachId, c.name AS coachName,
              e.schedule, e.location, e.contact, ep.period_id AS periodId,
              (SELECT COUNT(*) FROM extracurricular_students WHERE extracurricular_period_id = ep.id) AS membersCount
       FROM extracurriculars e
       JOIN extracurricular_periods ep ON e.id = ep.extracurricular_id
       LEFT JOIN extracurricular_coaches ec ON ep.id = ec.extracurricular_period_id
       LEFT JOIN coach_periods cp ON ec.coach_period_id = cp.id
       LEFT JOIN coaches c ON cp.coach_id = c.id
       WHERE e.id = ? AND ep.period_id = ?`,
      [id, activePeriodId]
    );

    const ekskul = rows[0];
    if (!ekskul) {
      return NextResponse.json(
        { success: false, message: "Ekstrakurikuler tidak ditemukan untuk periode akademik ini" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: ekskul });
  } catch (error: any) {
    console.error("Extracurricular Detail GET Error:", error);
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
    const { name, category, coachId, schedule, location, contact, periodId } = await request.json();

    if (!name || !category || !schedule || !location || !contact) {
      return NextResponse.json(
        { success: false, message: "Seluruh parameter wajib diisi (kecuali Coach)" },
        { status: 400 }
      );
    }

    // Resolusi period_id saat ini jika tidak disediakan
    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      const [current]: any = await db.query(
        "SELECT period_id FROM extracurricular_periods WHERE extracurricular_id = ? LIMIT 1",
        [id]
      );
      targetPeriodId = current[0]?.period_id || 1;
    }

    // 1. Update extracurricular master
    const [result]: any = await db.query(
      `UPDATE extracurriculars 
       SET name = ?, category = ?, schedule = ?, location = ?, contact = ?
       WHERE id = ?`,
      [name, category, schedule, location, contact, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Ekstrakurikuler tidak ditemukan" },
        { status: 404 }
      );
    }

    // 2. Ensure linked to extracurricular_periods
    await db.query(
      `INSERT INTO extracurricular_periods (extracurricular_id, period_id, is_active)
       VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE is_active = 1`,
      [id, targetPeriodId]
    );

    // Get the extracurricular_period_id
    const [epRows]: any = await db.query(
      "SELECT id FROM extracurricular_periods WHERE extracurricular_id = ? AND period_id = ?",
      [id, targetPeriodId]
    );
    const epId = epRows[0].id;

    // 3. Update coach in extracurricular_coaches
    await db.query(
      "DELETE FROM extracurricular_coaches WHERE extracurricular_period_id = ?",
      [epId]
    );

    if (coachId) {
      const [cpRows]: any = await db.query(
        "SELECT id FROM coach_periods WHERE coach_id = ? AND period_id = ?",
        [coachId, targetPeriodId]
      );
      if (cpRows.length > 0) {
        await db.query(
          `INSERT INTO extracurricular_coaches (extracurricular_period_id, coach_period_id)
           VALUES (?, ?)`,
          [epId, cpRows[0].id]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Ekstrakurikuler berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("Extracurricular Detail PUT Error:", error);
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

    // Delete extracurricular master (cascades to extracurricular_periods, etc.)
    const [result]: any = await db.query("DELETE FROM extracurriculars WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Ekstrakurikuler tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ekstrakurikuler berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Extracurricular Detail DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
