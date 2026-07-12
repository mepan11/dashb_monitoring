import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(
      `SELECT e.id, e.name, e.category, e.schedule, e.location, e.contact,
              c.name AS coachName, e.coach_id AS coachId
       FROM extracurriculars e
       LEFT JOIN coaches c ON e.coach_id = c.id
       ORDER BY e.name ASC`
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("Extracurriculars GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
