import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const ekskulId = url.searchParams.get("ekskulId") || "";

    // Fetch all students who are NOT registered in the specified extracurricular
    const [rows]: any = await db.query(
      `SELECT id, name, nisn, class_label AS className 
       FROM students 
       WHERE id NOT IN (
         SELECT student_id 
         FROM extracurricular_students 
         WHERE extracurricular_id = ?
       )
       ORDER BY name ASC`,
      [ekskulId]
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
