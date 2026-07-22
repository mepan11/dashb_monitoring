import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const statusFilter = url.searchParams.get("status") || "";
    const specFilter = url.searchParams.get("specialization") || "";
    const periodId = url.searchParams.get("period_id");

    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // 1. Fetch counts/statistics filtered by period joining coach_periods
    const [totalRes]: any = await db.query(
      `SELECT COUNT(DISTINCT c.id) AS count 
       FROM coaches c
       JOIN coach_periods cp ON c.id = cp.coach_id AND cp.period_id = ?`, 
      [activePeriodId]
    );
    const [activeRes]: any = await db.query(
      `SELECT COUNT(DISTINCT c.id) AS count 
       FROM coaches c 
       JOIN coach_periods cp ON c.id = cp.coach_id AND cp.period_id = ?
       WHERE c.status = 'Aktif'`, 
      [activePeriodId]
    );
    const [specCountRes]: any = await db.query(
      `SELECT COUNT(DISTINCT c.specialization) AS count 
       FROM coaches c
       JOIN coach_periods cp ON c.id = cp.coach_id AND cp.period_id = ?`, 
      [activePeriodId]
    );
    const [nonActiveRes]: any = await db.query(
      `SELECT COUNT(DISTINCT c.id) AS count 
       FROM coaches c 
       JOIN coach_periods cp ON c.id = cp.coach_id AND cp.period_id = ?
       WHERE c.status = 'Non-Aktif'`, 
      [activePeriodId]
    );

    const stats = {
      total: totalRes[0]?.count || 0,
      active: activeRes[0]?.count || 0,
      specializationCount: specCountRes[0]?.count || 0,
      nonActive: nonActiveRes[0]?.count || 0,
    };

    // 2. Fetch list of coaches joining coach_periods
    let query = `
      SELECT c.id, c.name, c.email, c.id_number AS idNumber, c.specialization, c.status 
      FROM coaches c
      JOIN coach_periods cp ON c.id = cp.coach_id AND cp.period_id = ?
    `;
    const hasLimit = url.searchParams.has("limit");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const queryParams: any[] = [activePeriodId];
    const conditions: string[] = [];

    if (search) {
      conditions.push("(c.name LIKE ? OR c.id_number LIKE ? OR c.email LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (statusFilter && statusFilter !== "Semua") {
      conditions.push("c.status = ?");
      queryParams.push(statusFilter);
    }

    if (specFilter && specFilter !== "Semua Bidang") {
      conditions.push("c.specialization = ?");
      queryParams.push(specFilter);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Get total count of filtered records
    let countQuery = `
      SELECT COUNT(DISTINCT c.id) AS count 
      FROM coaches c
      JOIN coach_periods cp ON c.id = cp.coach_id AND cp.period_id = ?
    `;
    const countQueryParams = [activePeriodId];

    if (conditions.length > 0) {
      countQuery += " WHERE " + conditions.join(" AND ");
      countQueryParams.push(...queryParams.slice(1));
    }
    const [countRes]: any = await db.query(countQuery, countQueryParams);
    const filteredTotal = countRes[0]?.count || 0;

    if (hasLimit) {
      query += " ORDER BY c.id DESC LIMIT ? OFFSET ?";
      queryParams.push(limit, offset);
    } else {
      query += " ORDER BY c.id DESC";
    }

    const [rows]: any = await db.query(query, queryParams);

    const formattedCoaches = rows.map((r: any) => {
      const nameParts = r.name.split(" ");
      const initials = nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0] || "C"}`.toUpperCase();

      return {
        id: String(r.id),
        name: r.name,
        email: r.email,
        idNumber: r.idNumber,
        specialization: r.specialization,
        specializationType: r.specialization.toLowerCase(),
        status: r.status,
        initials,
      };
    });

    return NextResponse.json({
      success: true,
      stats,
      data: formattedCoaches,
      filteredTotal,
    });
  } catch (error: any) {
    console.error("Coaches API GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Fitur Salin Data Coach Periode Sebelumnya
    if (body.action === "copy_previous") {
      const targetPeriodId = body.periodId;
      if (!targetPeriodId) {
        return NextResponse.json(
          { success: false, message: "Period ID tujuan wajib disertakan" },
          { status: 400 }
        );
      }

      // Cari periode akademik sebelumnya
      const [prevPeriods]: any = await db.query(
        "SELECT id, academic_year, semester FROM academic_periods WHERE id < ? ORDER BY id DESC LIMIT 1",
        [targetPeriodId]
      );

      if (prevPeriods.length === 0) {
        return NextResponse.json(
          { success: false, message: "Tidak ditemukan periode akademik sebelumnya untuk disalin" },
          { status: 400 }
        );
      }

      const prevPeriodId = prevPeriods[0].id;

      // Ambil data coach dari periode sebelumnya
      const [prevCoachPeriods]: any = await db.query(
        "SELECT coach_id FROM coach_periods WHERE period_id = ?",
        [prevPeriodId]
      );

      if (prevCoachPeriods.length === 0) {
        return NextResponse.json(
          { success: false, message: `Tidak ada data coach pada periode sebelumnya (${prevPeriods[0].academic_year} - ${prevPeriods[0].semester})` },
          { status: 400 }
        );
      }

      let copiedCount = 0;
      for (const cp of prevCoachPeriods) {
        const [result]: any = await db.query(
          `INSERT IGNORE INTO coach_periods (coach_id, period_id, is_active)
           VALUES (?, ?, 1)`,
          [cp.coach_id, targetPeriodId]
        );
        if (result.affectedRows > 0) {
          copiedCount++;
        }
      }

      return NextResponse.json({
        success: true,
        message: `Berhasil menyalin ${copiedCount} data coach ke periode aktif dari periode sebelumnya (${prevPeriods[0].academic_year} - ${prevPeriods[0].semester})`,
      });
    }

    // Alur Insert Coach Tunggal
    const { name, email, idNumber, specialization, status, periodId } = body;

    if (!name || !email || !idNumber || !periodId) {
      return NextResponse.json(
        { success: false, message: "Nama, Email, ID Number, dan Periode Akademik wajib diisi" },
        { status: 400 }
      );
    }

    // 1. Dapatkan atau buat data coach master
    let coachId: number;
    const [existingMaster]: any = await db.query(
      "SELECT id FROM coaches WHERE id_number = ? OR email = ?",
      [idNumber, email]
    );

    if (existingMaster.length > 0) {
      coachId = existingMaster[0].id;
      // Update jika ada perubahan data
      await db.query(
        "UPDATE coaches SET name = ?, email = ?, specialization = ?, status = ? WHERE id = ?",
        [name, email, specialization || "Sains", status || "Aktif", coachId]
      );
    } else {
      const [insertRes]: any = await db.query(
        `INSERT INTO coaches (name, email, id_number, specialization, status)
         VALUES (?, ?, ?, ?, ?)`,
        [name, email, idNumber, specialization || "Sains", status || "Aktif"]
      );
      coachId = insertRes.insertId;
    }

    // 1b. Sync/Create user login credentials
    const [existingUser]: any = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      await db.query(
        "UPDATE users SET name = ?, role = 'coach' WHERE email = ?",
        [name, email]
      );
    } else {
      const salt = await bcrypt.genSalt(10);
      const defaultHash = await bcrypt.hash("password123", salt);
      await db.query(
        "INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, 'coach', ?)",
        [name, email, defaultHash]
      );
    }

    // 2. Hubungkan ke periode akademik
    const [existingJunction]: any = await db.query(
      "SELECT id FROM coach_periods WHERE coach_id = ? AND period_id = ?",
      [coachId, periodId]
    );

    if (existingJunction.length > 0) {
      return NextResponse.json(
        { success: false, message: "Coach tersebut sudah terdaftar pada periode akademik ini" },
        { status: 400 }
      );
    }

    await db.query(
      "INSERT INTO coach_periods (coach_id, period_id, is_active) VALUES (?, ?, 1)",
      [coachId, periodId]
    );

    return NextResponse.json({
      success: true,
      message: "Data coach berhasil ditambahkan",
      id: coachId,
    });
  } catch (error: any) {
    console.error("Coaches API POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
