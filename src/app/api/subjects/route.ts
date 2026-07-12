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

export async function POST(request: Request) {
  try {
    const { name, code, description } = await request.json();

    if (!name || !code) {
      return NextResponse.json(
        { success: false, message: "Nama dan Kode mata pelajaran wajib diisi" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      "INSERT INTO subjects (name, code, description) VALUES (?, ?, ?)",
      [name, code, description || ""]
    );

    return NextResponse.json({
      success: true,
      message: "Mata pelajaran berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error: any) {
    console.error("Subjects POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
