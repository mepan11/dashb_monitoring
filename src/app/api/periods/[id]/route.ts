import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { academicYear, semester, isActive } = await request.json();

    if (!academicYear || !semester) {
      return NextResponse.json(
        { success: false, message: "Tahun Ajaran dan Semester wajib diisi" },
        { status: 400 }
      );
    }

    // Cek duplikasi dengan periode lain
    const [existing]: any = await db.query(
      "SELECT id FROM academic_periods WHERE academic_year = ? AND semester = ? AND id != ?",
      [academicYear, semester, id]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Periode akademik dengan Tahun Ajaran & Semester tersebut sudah ada" },
        { status: 400 }
      );
    }

    const activeFlag = isActive ? 1 : 0;

    // Jika diaktifkan, nonaktifkan yang lain
    if (activeFlag === 1) {
      await db.query("UPDATE academic_periods SET is_active = 0");
    }

    const [result]: any = await db.query(
      "UPDATE academic_periods SET academic_year = ?, semester = ?, is_active = ? WHERE id = ?",
      [academicYear, semester, activeFlag, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Periode akademik tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Periode akademik berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("Period Detail PUT Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Cek apakah periode ini sedang aktif
    const [statusRow]: any = await db.query("SELECT is_active FROM academic_periods WHERE id = ?", [id]);
    if (statusRow.length > 0 && statusRow[0].is_active === 1) {
      return NextResponse.json(
        { success: false, message: "Periode yang sedang aktif tidak dapat dihapus. Silakan aktifkan periode lain terlebih dahulu." },
        { status: 400 }
      );
    }

    // 2. Cek relasi data demi menjaga integritas database (Core Protection)
    const [classCheck]: any = await db.query("SELECT COUNT(*) AS count FROM classes WHERE period_id = ?", [id]);
    const [subjectCheck]: any = await db.query("SELECT COUNT(*) AS count FROM subjects WHERE period_id = ?", [id]);
    const [studentCheck]: any = await db.query("SELECT COUNT(*) AS count FROM students WHERE period_id = ?", [id]);
    const [ekskulCheck]: any = await db.query("SELECT COUNT(*) AS count FROM extracurriculars WHERE period_id = ?", [id]);
    const [gradeCheck]: any = await db.query("SELECT COUNT(*) AS count FROM grades WHERE period_id = ?", [id]);
    
    const referencesCount = 
      (classCheck[0]?.count || 0) +
      (subjectCheck[0]?.count || 0) +
      (studentCheck[0]?.count || 0) +
      (ekskulCheck[0]?.count || 0) +
      (gradeCheck[0]?.count || 0);

    if (referencesCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Periode akademik tidak dapat dihapus karena sudah memiliki data relasi (Kelas/Siswa/Mapel/Ekskul/Nilai) yang terhubung. Hapus atau pindahkan data tersebut terlebih dahulu." 
        },
        { status: 400 }
      );
    }

    const [result]: any = await db.query("DELETE FROM academic_periods WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Periode akademik tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Periode akademik berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Period Detail DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
