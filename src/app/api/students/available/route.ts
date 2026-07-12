import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const currentClassName = url.searchParams.get("currentClass") || "";

    // Get all students where class_label is NOT the current class name
    const [students]: any = await db.query(
      `SELECT id, name, nisn, class_label AS classLabel 
       FROM students 
       WHERE class_label IS NULL OR class_label != ?
       ORDER BY name ASC`,
      [currentClassName]
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
