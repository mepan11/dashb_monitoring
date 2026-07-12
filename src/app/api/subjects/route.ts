import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [subjects]: any = await db.query(
      "SELECT id, name, code, description FROM subjects ORDER BY name ASC"
    );
    return NextResponse.json({ success: true, data: subjects });
  } catch (error: any) {
    console.error("Subjects GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
