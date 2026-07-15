import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const periodId = url.searchParams.get("period_id");

    let query = `
      SELECT c.id, 
             c.class_name AS name,
             c.class_name AS className, 
             t.name AS homeroomTeacher,
             c.homeroom_teacher_id AS homeroomTeacherId,
             c.capacity,
             c.academic_year AS academicYear,
             c.semester,
             c.period_id AS periodId,
             (SELECT COUNT(*) FROM students WHERE class_label = c.class_name) AS studentsCount,
             (SELECT COUNT(*) FROM class_subjects WHERE class_id = c.id) AS subjectsCount
      FROM classes c
      LEFT JOIN teachers t ON c.homeroom_teacher_id = t.id
    `;
    const params = [];
    if (periodId && periodId !== "undefined") {
      query += " WHERE c.period_id = ?";
      params.push(periodId);
    }
    query += " ORDER BY c.class_name ASC";

    const [classes]: any = await db.query(query, params);
    return NextResponse.json({ success: true, data: classes });
  } catch (error: any) {
    console.error("Classes GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { className, homeroomTeacherId, capacity, academicYear, semester, periodId } = await request.json();

    if (!className) {
      return NextResponse.json(
        { success: false, message: "Nama kelas wajib diisi" },
        { status: 400 }
      );
    }

    // Ambil period jika tidak dikirim, atau ambil detail periode untuk di-mirror ke academic_year & semester di kelas
    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      targetPeriodId = activePeriod[0]?.id || 1;
    }

    const [periodDetails]: any = await db.query(
      "SELECT academic_year, semester FROM academic_periods WHERE id = ?",
      [targetPeriodId]
    );
    const resolvedYear = periodDetails[0]?.academic_year || academicYear || "2024/2025";
    const resolvedSemester = periodDetails[0]?.semester || semester || "Ganjil";

    const [result]: any = await db.query(
      `INSERT INTO classes (class_name, homeroom_teacher_id, academic_year, semester, capacity, period_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [className, homeroomTeacherId || null, resolvedYear, resolvedSemester, capacity || 32, targetPeriodId]
    );

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error: any) {
    console.error("Classes POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
