import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const classFilter = url.searchParams.get("class") || "";
    const genderFilter = url.searchParams.get("gender") || "";
    const statusFilter = url.searchParams.get("status") || "";
    const periodId = url.searchParams.get("period_id");
    
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "15", 10);
    const offset = (page - 1) * limit;

    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // Build stats filtered by student_periods joining students
    const [statsRows]: any = await db.query(
      `SELECT 
        COUNT(DISTINCT s.id) AS total,
        SUM(CASE WHEN s.status = 'Aktif' THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN s.gender_code = 'L' THEN 1 ELSE 0 END) AS male,
        SUM(CASE WHEN s.gender_code = 'P' THEN 1 ELSE 0 END) AS female
       FROM students s
       JOIN student_periods sp ON s.id = sp.student_id AND sp.period_id = ?`,
      [activePeriodId]
    );

    const stats = {
      total: statsRows[0]?.total || 0,
      active: statsRows[0]?.active || 0,
      male: statsRows[0]?.male || 0,
      female: statsRows[0]?.female || 0,
    };

    // Build main query
    let query = `
      SELECT 
        s.id, 
        s.name, 
        s.gender_text, 
        s.gender_code, 
        s.nisn, 
        s.status, 
        cl.class_name AS class_label,
        sp.period_id 
      FROM students s
      JOIN student_periods sp ON s.id = sp.student_id AND sp.period_id = ?
      LEFT JOIN class_periods clp ON sp.class_period_id = clp.id
      LEFT JOIN classes cl ON clp.class_id = cl.id
    `;
    const queryParams: any[] = [activePeriodId];
    const conditions: string[] = [];

    if (search) {
      conditions.push("(s.name LIKE ? OR s.nisn LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (classFilter && classFilter !== "Semua") {
      conditions.push("cl.class_name LIKE ?");
      queryParams.push(`${classFilter}%`);
    }

    if (genderFilter && genderFilter !== "Semua") {
      conditions.push("s.gender_code = ?");
      queryParams.push(genderFilter);
    }

    if (statusFilter && statusFilter !== "Semua") {
      conditions.push("s.status = ?");
      queryParams.push(statusFilter);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT s.id) AS count 
      FROM students s
      JOIN student_periods sp ON s.id = sp.student_id AND sp.period_id = ?
      LEFT JOIN class_periods clp ON sp.class_period_id = clp.id
      LEFT JOIN classes cl ON clp.class_id = cl.id
    `;
    const countQueryParams = [activePeriodId];
    if (conditions.length > 0) {
      countQuery += " WHERE " + conditions.join(" AND ");
      countQueryParams.push(...queryParams.slice(1));
    }
    const [countRes]: any = await db.query(countQuery, countQueryParams);
    const filteredTotal = countRes[0]?.count || 0;

    query += " ORDER BY cl.class_name ASC, s.name ASC LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    const [rows]: any = await db.query(query, queryParams);

    const students = rows.map((r: any) => {
      const nameParts = r.name.trim().split(" ");
      const initials =
        nameParts.length >= 2
          ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
          : `${nameParts[0][0] || "S"}`.toUpperCase();
      return {
        id: String(r.id),
        name: r.name,
        genderText: r.gender_text,
        genderCode: r.gender_code,
        nisn: r.nisn,
        classLabel: r.class_label || "",
        status: r.status,
        initials,
        periodId: r.period_id,
      };
    });

    return NextResponse.json({
      success: true,
      stats,
      data: students,
      filteredTotal,
    });
  } catch (error: any) {
    console.error("Students API GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, genderCode, nisn, classLabel, status, periodId } = await request.json();

    if (!name || !nisn) {
      return NextResponse.json(
        { success: false, message: "Nama dan NISN wajib diisi" },
        { status: 400 }
      );
    }

    // Ambil period_id aktif jika tidak disediakan
    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      targetPeriodId = activePeriod[0]?.id || 1;
    }

    const genderText = genderCode === "P" ? "Perempuan" : "Laki-laki";

    // 1. Dapatkan atau buat data siswa master
    let studentId: number;
    const [existingMaster]: any = await db.query(
      "SELECT id FROM students WHERE nisn = ?",
      [nisn]
    );

    if (existingMaster.length > 0) {
      studentId = existingMaster[0].id;
      // Update data siswa master
      await db.query(
        "UPDATE students SET name = ?, gender_text = ?, gender_code = ?, status = ? WHERE id = ?",
        [name, genderText, genderCode || "L", status || "Aktif", studentId]
      );
    } else {
      const [insertRes]: any = await db.query(
        `INSERT INTO students (name, gender_text, gender_code, nisn, status)
         VALUES (?, ?, ?, ?, ?)`,
        [name, genderText, genderCode || "L", nisn, status || "Aktif"]
      );
      studentId = insertRes.insertId;
    }

    // 2. Tentukan class_period_id dari classLabel
    let classPeriodId = null;
    if (classLabel) {
      const targetClassName = classLabel.startsWith("Kelas") ? classLabel : `Kelas ${classLabel}`;
      const [classPeriodRow]: any = await db.query(
        `SELECT clp.id FROM class_periods clp 
         JOIN classes c ON clp.class_id = c.id 
         WHERE c.class_name = ? AND clp.period_id = ?`,
        [targetClassName, targetPeriodId]
      );
      if (classPeriodRow.length > 0) {
        classPeriodId = classPeriodRow[0].id;
      }
    }

    // 3. Hubungkan ke periode akademik di student_periods
    await db.query(
      `INSERT INTO student_periods (student_id, period_id, class_period_id, is_active)
       VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE class_period_id = ?`,
      [studentId, targetPeriodId, classPeriodId, classPeriodId]
    );

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil ditambahkan",
      id: studentId,
    });
  } catch (error: any) {
    console.error("Students API POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
