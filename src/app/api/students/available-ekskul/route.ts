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

    // Resolve extracurricular_period_id
    const [epRows]: any = await db.query(
      "SELECT id FROM extracurricular_periods WHERE extracurricular_id = ? AND period_id = ?",
      [ekskulId, activePeriodId]
    );
    const epId = epRows[0]?.id;

    let students = [];
    if (epId) {
      // Fetch all students registered in the current period who are NOT registered in the specified extracurricular period
      const [rows]: any = await db.query(
        `SELECT s.id, s.name, s.nisn, cl.class_name AS className 
         FROM student_periods sp
         JOIN students s ON sp.student_id = s.id
         LEFT JOIN class_periods clp ON sp.class_period_id = clp.id
         LEFT JOIN classes cl ON clp.class_id = cl.id
         WHERE sp.period_id = ? AND sp.id NOT IN (
           SELECT student_period_id 
           FROM extracurricular_students 
           WHERE extracurricular_period_id = ?
         )
         ORDER BY s.name ASC`,
        [activePeriodId, epId]
      );
      students = rows;
    } else {
      // If epId doesn't exist, all students in active period are available
      const [rows]: any = await db.query(
        `SELECT s.id, s.name, s.nisn, cl.class_name AS className 
         FROM student_periods sp
         JOIN students s ON sp.student_id = s.id
         LEFT JOIN class_periods clp ON sp.class_period_id = clp.id
         LEFT JOIN classes cl ON clp.class_id = cl.id
         WHERE sp.period_id = ?
         ORDER BY s.name ASC`,
        [activePeriodId]
      );
      students = rows;
    }

    return NextResponse.json({ success: true, data: students });
  } catch (error: any) {
    console.error("Available Ekskul Students GET error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
