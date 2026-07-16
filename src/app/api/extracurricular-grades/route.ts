import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const ekstrakurikulerPeriodId = url.searchParams.get("extracurricular_period_id");
    const periodId = url.searchParams.get("period_id");

    if (!ekstrakurikulerPeriodId) {
      return NextResponse.json({ success: false, message: "extracurricular_period_id wajib disertakan" }, { status: 400 });
    }

    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query("SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1");
      activePeriodId = activePeriod[0]?.id || 1;
    }

    const [checkPeriod]: any = await db.query(
      "SELECT id FROM extracurricular_periods WHERE id = ?",
      [ekstrakurikulerPeriodId]
    );

    let finalEpId = null;
    if (checkPeriod && checkPeriod.length > 0) {
      finalEpId = checkPeriod[0].id;
    } else {
      const [resolvedPeriod]: any = await db.query(
        "SELECT id FROM extracurricular_periods WHERE extracurricular_id = ? AND period_id = ?",
        [ekstrakurikulerPeriodId, activePeriodId]
      );
      finalEpId = resolvedPeriod[0]?.id || null;
    }

    if (!finalEpId) {
      return NextResponse.json({
        success: true,
        data: [],
        ekskul: null,
        message: "Periode ekskul tidak ditemukan"
      });
    }

    const [rows]: any = await db.query(
      `SELECT 
         es.student_period_id,
         s.id AS student_id,
         s.name,
         s.nisn,
         s.gender_text AS gender,
         cl.class_name AS class_name,
         eg.id AS grade_id,
         eg.score,
         eg.notes
       FROM extracurricular_students es
       JOIN student_periods sp ON es.student_period_id = sp.id
       JOIN students s ON sp.student_id = s.id
       LEFT JOIN class_periods clp ON sp.class_period_id = clp.id
       LEFT JOIN classes cl ON clp.class_id = cl.id
       LEFT JOIN extracurricular_grades eg 
              ON eg.extracurricular_period_id = es.extracurricular_period_id 
             AND eg.student_period_id = es.student_period_id
       WHERE es.extracurricular_period_id = ?
       ORDER BY s.name ASC`,
      [finalEpId]
    );

    const data = rows.map((r: any) => ({
      studentPeriodId: r.student_period_id,
      studentId: String(r.student_id),
      name: r.name,
      nisn: r.nisn,
      gender: r.gender || "—",
      className: r.class_name || "—",
      gradeId: r.grade_id || null,
      score: r.score !== null && r.score !== undefined ? parseFloat(r.score) : null,
      notes: r.notes || "",
    }));

    const [epRows]: any = await db.query(
      `SELECT e.name AS ekskul_name, ap.academic_year, ap.semester
       FROM extracurricular_periods ep
       JOIN extracurriculars e ON ep.extracurricular_id = e.id
       JOIN academic_periods ap ON ep.period_id = ap.id
       WHERE ep.id = ?`,
      [finalEpId]
    );

    return NextResponse.json({
      success: true,
      data,
      ekskul: epRows[0] ? { name: epRows[0].ekskul_name, academicYear: epRows[0].academic_year, semester: epRows[0].semester } : null,
    });
  } catch (error: any) {
    console.error("Extracurricular Grades GET Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan internal server" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { extracurricularPeriodId, studentPeriodId, score, notes } = await request.json();

    if (!extracurricularPeriodId || !studentPeriodId) {
      return NextResponse.json({ success: false, message: "extracurricularPeriodId dan studentPeriodId wajib diisi" }, { status: 400 });
    }

    if (score === undefined || score === null || score === "") {
      return NextResponse.json({ success: false, message: "Nilai (score) wajib diisi" }, { status: 400 });
    }

    const scoreValue = parseFloat(score);
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
      return NextResponse.json({ success: false, message: "Nilai harus berupa angka antara 0 - 100" }, { status: 400 });
    }

    const [checkPeriod]: any = await db.query(
      "SELECT id FROM extracurricular_periods WHERE id = ?",
      [extracurricularPeriodId]
    );

    let finalEpId = null;
    if (checkPeriod && checkPeriod.length > 0) {
      finalEpId = checkPeriod[0].id;
    } else {
      const [spRow]: any = await db.query(
        "SELECT period_id FROM student_periods WHERE id = ?",
        [studentPeriodId]
      );
      const activePeriodId = spRow[0]?.period_id || 1;

      const [resolvedPeriod]: any = await db.query(
        "SELECT id FROM extracurricular_periods WHERE extracurricular_id = ? AND period_id = ?",
        [extracurricularPeriodId, activePeriodId]
      );
      finalEpId = resolvedPeriod[0]?.id || null;
    }

    if (!finalEpId) {
      return NextResponse.json({ success: false, message: "Periode ekstrakurikuler tidak ditemukan" }, { status: 404 });
    }

    await db.query(
      `INSERT INTO extracurricular_grades (extracurricular_period_id, student_period_id, score, notes)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE score = ?, notes = ?`,
      [finalEpId, studentPeriodId, scoreValue, notes || null, scoreValue, notes || null]
    );

    return NextResponse.json({ success: true, message: "Nilai ekskul berhasil disimpan" });
  } catch (error: any) {
    console.error("Extracurricular Grades POST Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan internal server" }, { status: 500 });
  }
}
