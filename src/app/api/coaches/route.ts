import { NextResponse } from "next/server";
import db from "@/lib/db";

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

    // 1. Fetch counts/statistics filtered by period
    const [totalRes]: any = await db.query("SELECT COUNT(*) AS count FROM coaches WHERE period_id = ?", [activePeriodId]);
    const [activeRes]: any = await db.query("SELECT COUNT(*) AS count FROM coaches WHERE status = 'Aktif' AND period_id = ?", [activePeriodId]);
    const [specCountRes]: any = await db.query("SELECT COUNT(DISTINCT specialization) AS count FROM coaches WHERE period_id = ?", [activePeriodId]);
    const [nonActiveRes]: any = await db.query("SELECT COUNT(*) AS count FROM coaches WHERE status = 'Non-Aktif' AND period_id = ?", [activePeriodId]);

    const stats = {
      total: totalRes[0]?.count || 0,
      active: activeRes[0]?.count || 0,
      specializationCount: specCountRes[0]?.count || 0,
      nonActive: nonActiveRes[0]?.count || 0,
    };

    // 2. Fetch list of coaches with pagination
    let query = "SELECT id, name, email, id_number AS idNumber, specialization, contact, status, schedule, location FROM coaches";
    const hasLimit = url.searchParams.has("limit");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const queryParams: any[] = [];
    const conditions: string[] = ["period_id = ?"];
    queryParams.push(activePeriodId);

    if (search) {
      conditions.push("(name LIKE ? OR id_number LIKE ? OR email LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (statusFilter && statusFilter !== "Semua") {
      conditions.push("status = ?");
      queryParams.push(statusFilter);
    }

    if (specFilter && specFilter !== "Semua Bidang") {
      conditions.push("specialization = ?");
      queryParams.push(specFilter);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Get total count of filtered records for pagination calculation
    let countQuery = "SELECT COUNT(*) AS count FROM coaches";
    if (conditions.length > 0) {
      countQuery += " WHERE " + conditions.join(" AND ");
    }
    const [countRes]: any = await db.query(countQuery, queryParams);
    const filteredTotal = countRes[0]?.count || 0;

    if (hasLimit) {
      query += " ORDER BY id DESC LIMIT ? OFFSET ?";
      queryParams.push(limit, offset);
    } else {
      query += " ORDER BY id DESC";
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
        contact: r.contact,
        status: r.status,
        schedule: r.schedule,
        location: r.location,
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
      const [prevCoaches]: any = await db.query(
        "SELECT name, email, id_number, specialization, contact, status, schedule, location FROM coaches WHERE period_id = ?",
        [prevPeriodId]
      );

      if (prevCoaches.length === 0) {
        return NextResponse.json(
          { success: false, message: `Tidak ada data coach pada periode sebelumnya (${prevPeriods[0].academic_year} - ${prevPeriods[0].semester})` },
          { status: 400 }
        );
      }

      // Cek apakah target period sudah memiliki coach
      const [existingCoaches]: any = await db.query(
        "SELECT id_number FROM coaches WHERE period_id = ?",
        [targetPeriodId]
      );
      const existingIds = new Set(existingCoaches.map((c: any) => String(c.id_number)));

      let copiedCount = 0;
      for (const c of prevCoaches) {
        if (!existingIds.has(String(c.id_number))) {
          await db.query(
            `INSERT INTO coaches (name, email, id_number, specialization, contact, status, schedule, location, period_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [c.name, c.email, c.id_number, c.specialization, c.contact, c.status, c.schedule, c.location, targetPeriodId]
          );
          copiedCount++;
        }
      }

      return NextResponse.json({
        success: true,
        message: `Berhasil menyalin ${copiedCount} data coach dari periode sebelumnya (${prevPeriods[0].academic_year} - ${prevPeriods[0].semester})`,
      });
    }

    // Alur Insert Coach Tunggal
    const { name, email, idNumber, specialization, contact, status, schedule, location, periodId } = body;

    if (!name || !email || !idNumber || !periodId) {
      return NextResponse.json(
        { success: false, message: "Nama, Email, ID Number, dan Periode Akademik wajib diisi" },
        { status: 400 }
      );
    }

    // Cek duplikasi ID Number pada periode yang sama
    const [existing]: any = await db.query(
      "SELECT id FROM coaches WHERE id_number = ? AND period_id = ?",
      [idNumber, periodId]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Coach dengan ID Number tersebut sudah terdaftar pada periode akademik ini" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `
      INSERT INTO coaches (name, email, id_number, specialization, contact, status, schedule, location, period_id)
      VALUES (?, ?, ?, ?, ?, COALESCE(?, 'Aktif'), ?, ?, ?)
      `,
      [name, email, idNumber, specialization || "Sains", contact || "", status || "Aktif", schedule || "", location || "", periodId]
    );

    return NextResponse.json({
      success: true,
      message: "Data coach berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error: any) {
    console.error("Coaches API POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
