import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // extracurricular_id
    const url = new URL(request.url);
    const periodId = url.searchParams.get("period_id");

    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // Resolve extracurricular_period_id
    const [epRows]: any = await db.query(
      "SELECT id FROM extracurricular_periods WHERE extracurricular_id = ? AND period_id = ?",
      [id, activePeriodId]
    );
    const epId = epRows[0]?.id;

    if (!epId) {
      return NextResponse.json({ success: true, data: [] });
    }

    const [rows]: any = await db.query(
      `SELECT s.id, s.name, s.gender_text, s.gender_code, s.nisn, cl.class_name AS class_label, s.status, es.status AS membershipStatus
       FROM extracurricular_students es
       JOIN student_periods sp ON es.student_period_id = sp.id
       JOIN students s ON sp.student_id = s.id
       LEFT JOIN class_periods clp ON sp.class_period_id = clp.id
       LEFT JOIN classes cl ON clp.class_id = cl.id
       WHERE es.extracurricular_period_id = ?
       ORDER BY s.name ASC`,
      [epId]
    );

    const formatted = rows.map((r: any) => {
      const nameParts = (r.name || "").trim().split(" ");
      const initials = nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0] || "S"}`.toUpperCase();
      return {
        id: String(r.id),
        name: r.name,
        className: r.class_label || "—",
        nisn: r.nisn,
        status: r.membershipStatus || "Aktif",
        initials
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Extracurricular Students GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // extracurricular_id
    const { studentId, periodId } = await request.json();

    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Siswa wajib dipilih" },
        { status: 400 }
      );
    }

    let activePeriodId = periodId;
    if (!activePeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // 1. Resolve or create extracurricular_period_id
    let epId: number;
    const [epRows]: any = await db.query(
      "SELECT id FROM extracurricular_periods WHERE extracurricular_id = ? AND period_id = ?",
      [id, activePeriodId]
    );
    if (epRows.length > 0) {
      epId = epRows[0].id;
    } else {
      const [insertEpRes]: any = await db.query(
        "INSERT INTO extracurricular_periods (extracurricular_id, period_id, is_active) VALUES (?, ?, 1)",
        [id, activePeriodId]
      );
      epId = insertEpRes.insertId;
    }

    // 2. Resolve or create student_period_id
    let spId: number;
    const [spRows]: any = await db.query(
      "SELECT id FROM student_periods WHERE student_id = ? AND period_id = ?",
      [studentId, activePeriodId]
    );
    if (spRows.length > 0) {
      spId = spRows[0].id;
    } else {
      const [insertSpRes]: any = await db.query(
        "INSERT INTO student_periods (student_id, period_id, is_active) VALUES (?, ?, 1)",
        [studentId, activePeriodId]
      );
      spId = insertSpRes.insertId;
    }

    // 3. Add to extracurricular_students
    await db.query(
      `INSERT INTO extracurricular_students (extracurricular_period_id, student_period_id, status)
       VALUES (?, ?, 'Aktif')
       ON DUPLICATE KEY UPDATE status = 'Aktif'`,
      [epId, spId]
    );

    return NextResponse.json({
      success: true,
      message: "Siswa berhasil ditambahkan ke ekstrakurikuler",
    });
  } catch (error: any) {
    console.error("Extracurricular Students POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // extracurricular_id
    const url = new URL(request.url);
    const studentId = url.searchParams.get("studentId");
    const periodId = url.searchParams.get("period_id");

    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Student ID wajib disertakan" },
        { status: 400 }
      );
    }

    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // 1. Resolve extracurricular_period_id
    const [epRows]: any = await db.query(
      "SELECT id FROM extracurricular_periods WHERE extracurricular_id = ? AND period_id = ?",
      [id, activePeriodId]
    );
    const epId = epRows[0]?.id;

    // 2. Resolve student_period_id
    const [spRows]: any = await db.query(
      "SELECT id FROM student_periods WHERE student_id = ? AND period_id = ?",
      [studentId, activePeriodId]
    );
    const spId = spRows[0]?.id;

    if (epId && spId) {
      await db.query(
        "DELETE FROM extracurricular_students WHERE extracurricular_period_id = ? AND student_period_id = ?",
        [epId, spId]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Siswa berhasil dikeluarkan dari ekstrakurikuler",
    });
  } catch (error: any) {
    console.error("Extracurricular Students DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
