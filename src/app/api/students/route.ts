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

    // Build stats filtered by period_id
    let statsQuery = `
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Aktif' THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN gender_code = 'L' THEN 1 ELSE 0 END) AS male,
        SUM(CASE WHEN gender_code = 'P' THEN 1 ELSE 0 END) AS female
      FROM students
    `;
    const statsParams = [];
    if (periodId && periodId !== "undefined") {
      statsQuery += " WHERE period_id = ?";
      statsParams.push(periodId);
    }

    const [statsRows]: any = await db.query(statsQuery, statsParams);
    const stats = {
      total: statsRows[0]?.total || 0,
      active: statsRows[0]?.active || 0,
      male: statsRows[0]?.male || 0,
      female: statsRows[0]?.female || 0,
    };

    // Build main query
    let query = "SELECT id, name, gender_text, gender_code, nisn, class_label, status, period_id FROM students";
    const queryParams: any[] = [];
    const conditions: string[] = [];

    if (periodId && periodId !== "undefined") {
      conditions.push("period_id = ?");
      queryParams.push(periodId);
    }

    if (search) {
      conditions.push("(name LIKE ? OR nisn LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (classFilter && classFilter !== "Semua") {
      conditions.push("class_label LIKE ?");
      queryParams.push(`${classFilter}%`);
    }

    if (genderFilter && genderFilter !== "Semua") {
      conditions.push("gender_code = ?");
      queryParams.push(genderFilter);
    }

    if (statusFilter && statusFilter !== "Semua") {
      conditions.push("status = ?");
      queryParams.push(statusFilter);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Count for pagination
    let countQuery = "SELECT COUNT(*) AS count FROM students";
    if (conditions.length > 0) {
      countQuery += " WHERE " + conditions.join(" AND ");
    }
    const [countRes]: any = await db.query(countQuery, queryParams);
    const filteredTotal = countRes[0]?.count || 0;

    query += " ORDER BY class_label ASC, name ASC LIMIT ? OFFSET ?";
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
        classLabel: r.class_label,
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

    const [result]: any = await db.query(
      `INSERT INTO students (name, gender_text, gender_code, nisn, class_label, status, period_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, genderText, genderCode || "L", nisn, classLabel || null, status || "Aktif", targetPeriodId]
    );

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error: any) {
    console.error("Students API POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
