import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [rows]: any = await db.query(
      `SELECT s.id, s.name, s.gender_text, s.gender_code, s.nisn, s.class_label, s.status, es.status AS membershipStatus
       FROM extracurricular_students es
       JOIN students s ON es.student_id = s.id
       WHERE es.extracurricular_id = ?
       ORDER BY s.name ASC`,
      [id]
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("Extracurricular Students GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
