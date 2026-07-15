import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(
      "SELECT id, academic_year AS academicYear, academic_year, semester, is_active AS isActive, is_active, created_at AS createdAt, created_at FROM academic_periods ORDER BY academic_year DESC, semester DESC"
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error("Periods GET API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { academicYear, semester, isActive } = await request.json();

    if (!academicYear || !semester) {
      return NextResponse.json(
        { success: false, message: "Tahun Ajaran dan Semester wajib diisi" },
        { status: 400 }
      );
    }

    // Cek duplikasi
    const [existing]: any = await db.query(
      "SELECT id FROM academic_periods WHERE academic_year = ? AND semester = ?",
      [academicYear, semester]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Periode akademik tersebut sudah ada" },
        { status: 400 }
      );
    }

    const activeFlag = isActive ? 1 : 0;

    // Jika diset aktif, nonaktifkan periode lain
    if (activeFlag === 1) {
      await db.query("UPDATE academic_periods SET is_active = 0");
    }

    const [result]: any = await db.query(
      "INSERT INTO academic_periods (academic_year, semester, is_active) VALUES (?, ?, ?)",
      [academicYear, semester, activeFlag]
    );

    return NextResponse.json({
      success: true,
      message: "Periode akademik berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error: any) {
    console.error("Periods POST API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
