import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const ekskulId = url.searchParams.get("ekskulId") || "";
    const periodId = url.searchParams.get("period_id");

    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // Fetch all students who are NOT registered in the specified extracurricular and match the period_id
    const [rows]: any = await db.query(
      `SELECT id, name, nisn, class_label AS className 
       FROM students 
       WHERE period_id = ? AND id NOT IN (
         SELECT student_id 
         FROM extracurricular_students 
         WHERE extracurricular_id = ?
       )
       ORDER BY name ASC`,
      [activePeriodId, ekskulId]
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("Available Ekskul Students GET error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
