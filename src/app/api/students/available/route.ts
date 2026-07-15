import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const periodId = url.searchParams.get("period_id");

    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      targetPeriodId = activePeriod[0]?.id || 1;
    }

    // Get all students in the period where class_label is NULL or empty (not assigned to any class yet)
    const [students]: any = await db.query(
      `SELECT id, name, nisn, class_label AS classLabel 
       FROM students 
       WHERE period_id = ? AND (class_label IS NULL OR class_label = '' OR class_label = '—')
       ORDER BY name ASC`,
      [targetPeriodId]
    );

    return NextResponse.json({ success: true, data: students });
  } catch (error: any) {
    console.error("Available Students GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
