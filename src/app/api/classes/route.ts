import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const periodId = url.searchParams.get("period_id");

    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    let query = `
      SELECT c.id, 
             c.class_name AS name,
             c.class_name AS className, 
             t.name AS homeroomTeacher,
             tp.teacher_id AS homeroomTeacherId,
             c.capacity,
             ap.academic_year AS academicYear,
             ap.semester,
             clp.period_id AS periodId,
             (SELECT COUNT(*) FROM student_periods WHERE class_period_id = clp.id) AS studentsCount,
             (SELECT COUNT(*) FROM class_subjects WHERE class_period_id = clp.id) AS subjectsCount
      FROM class_periods clp
      JOIN classes c ON clp.class_id = c.id
      JOIN academic_periods ap ON clp.period_id = ap.id
      LEFT JOIN teacher_periods tp ON clp.homeroom_teacher_id = tp.id
      LEFT JOIN teachers t ON tp.teacher_id = t.id
      WHERE clp.period_id = ?
      ORDER BY c.class_name ASC
    `;

    const [classes]: any = await db.query(query, [activePeriodId]);
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
    const { className, homeroomTeacherId, capacity, periodId } = await request.json();

    if (!className) {
      return NextResponse.json(
        { success: false, message: "Nama kelas wajib diisi" },
        { status: 400 }
      );
    }

    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      targetPeriodId = activePeriod[0]?.id || 1;
    }

    // 1. Dapatkan atau buat kelas master
    let classId: number;
    const [existingMaster]: any = await db.query(
      "SELECT id FROM classes WHERE class_name = ?",
      [className]
    );

    if (existingMaster.length > 0) {
      classId = existingMaster[0].id;
      // Update capacity
      await db.query("UPDATE classes SET capacity = ? WHERE id = ?", [capacity || 32, classId]);
    } else {
      const [insertRes]: any = await db.query(
        "INSERT INTO classes (class_name, capacity) VALUES (?, ?)",
        [className, capacity || 32]
      );
      classId = insertRes.insertId;
    }

    // 2. Tentukan homeroom teacher_period_id
    let homeroomTeacherPeriodId = null;
    if (homeroomTeacherId) {
      const [tpRows]: any = await db.query(
        "SELECT id FROM teacher_periods WHERE teacher_id = ? AND period_id = ?",
        [homeroomTeacherId, targetPeriodId]
      );
      if (tpRows.length > 0) {
        homeroomTeacherPeriodId = tpRows[0].id;
      }
    }

    // 3. Hubungkan ke periode akademik
    await db.query(
      `INSERT INTO class_periods (class_id, period_id, homeroom_teacher_id)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE homeroom_teacher_id = ?`,
      [classId, targetPeriodId, homeroomTeacherPeriodId, homeroomTeacherPeriodId]
    );

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil ditambahkan",
      id: classId,
    });
  } catch (error: any) {
    console.error("Classes POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
