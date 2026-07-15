import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const statusFilter = url.searchParams.get("status") || "";
    const subjectFilter = url.searchParams.get("subject") || "";
    const periodId = url.searchParams.get("period_id");

    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // 1. Fetch counts/statistics filtered by period
    const [totalRes]: any = await db.query("SELECT COUNT(*) AS count FROM teachers WHERE period_id = ?", [activePeriodId]);
    const [activeRes]: any = await db.query("SELECT COUNT(*) AS count FROM teachers WHERE status = 'Aktif' AND period_id = ?", [activePeriodId]);
    const [akademikRes]: any = await db.query("SELECT COUNT(*) AS count FROM teachers WHERE specialization = 'Akademik' AND period_id = ?", [activePeriodId]);
    const [nonAkademikRes]: any = await db.query("SELECT COUNT(*) AS count FROM teachers WHERE specialization = 'Non-Akademik' AND period_id = ?", [activePeriodId]);

    const stats = {
      total: totalRes[0]?.count || 0,
      active: activeRes[0]?.count || 0,
      akademik: akademikRes[0]?.count || 0,
      nonAkademik: nonAkademikRes[0]?.count || 0,
    };

    // 2. Fetch list of teachers with their subjects and classes for the selected period
    let query = `
      SELECT 
        t.id, 
        t.name, 
        t.email, 
        t.nip, 
        t.specialization, 
        t.status, 
        COALESCE(GROUP_CONCAT(DISTINCT s.name SEPARATOR ', '), '—') AS subjects, 
        COALESCE(GROUP_CONCAT(DISTINCT c.class_name SEPARATOR ', '), '—') AS classes 
      FROM teachers t 
      LEFT JOIN class_subjects cs ON t.id = cs.teacher_id 
      LEFT JOIN subjects s ON cs.subject_id = s.id AND s.period_id = ?
      LEFT JOIN classes c ON cs.class_id = c.id AND c.period_id = ?
    `;

    const hasLimit = url.searchParams.has("limit");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const queryParams: any[] = [activePeriodId, activePeriodId];
    const conditions: string[] = ["t.period_id = ?"];
    queryParams.push(activePeriodId);

    if (search) {
      conditions.push("(t.name LIKE ? OR t.nip LIKE ? OR t.email LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (statusFilter && statusFilter !== "Semua") {
      conditions.push("t.status = ?");
      queryParams.push(statusFilter);
    }

    if (subjectFilter) {
      conditions.push("t.id IN (SELECT cs_sub.teacher_id FROM class_subjects cs_sub JOIN subjects s_sub ON cs_sub.subject_id = s_sub.id WHERE s_sub.name = ? AND s_sub.period_id = ?)");
      queryParams.push(subjectFilter, activePeriodId);
    }

    // Get total count of filtered records
    let countQuery = "SELECT COUNT(DISTINCT t.id) AS count FROM teachers t";
    if (conditions.length > 0) {
      countQuery += " WHERE " + conditions.join(" AND ");
    }
    const [countRows]: any = await db.query(countQuery, queryParams.slice(2)); // Skip the first two periodId params
    const filteredTotal = countRows[0]?.count || 0;

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    let finalParams = [...queryParams];
    if (hasLimit) {
      query += " GROUP BY t.id ORDER BY t.id ASC LIMIT ? OFFSET ?";
      finalParams.push(limit, offset);
    } else {
      query += " GROUP BY t.id ORDER BY t.id ASC";
    }

    const [teachersRows]: any = await db.query(query, finalParams);

    // Format initials for avatar
    const formattedTeachers = teachersRows.map((row: any) => {
      const nameParts = row.name.split(" ");
      const initials = nameParts.length >= 2 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0] || "G"}`.toUpperCase();

      return {
        id: String(row.id),
        name: row.name,
        email: row.email,
        nip: row.nip,
        specialization: row.specialization,
        subjects: row.subjects,
        classes: row.classes,
        status: row.status,
        initials,
      };
    });

    return NextResponse.json({
      success: true,
      stats,
      data: formattedTeachers,
      filteredTotal,
    });
  } catch (error: any) {
    console.error("Teachers API GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Fitur Salin Data Guru Periode Sebelumnya
    if (body.action === "copy_previous") {
      const targetPeriodId = body.periodId;
      if (!targetPeriodId) {
        return NextResponse.json(
          { success: false, message: "Period ID tujuan wajib disertakan" },
          { status: 400 }
        );
      }

      // Cari periode akademik dengan ID yang lebih kecil (periode sebelumnya)
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

      // Ambil data guru dari periode sebelumnya
      const [prevTeachers]: any = await db.query(
        "SELECT name, email, nip, specialization, status FROM teachers WHERE period_id = ?",
        [prevPeriodId]
      );

      if (prevTeachers.length === 0) {
        return NextResponse.json(
          { success: false, message: `Tidak ada data guru pada periode sebelumnya (${prevPeriods[0].academic_year} - ${prevPeriods[0].semester})` },
          { status: 400 }
        );
      }

      // Cek apakah target period sudah memiliki guru agar tidak duplikasi
      const [existingTeachers]: any = await db.query(
        "SELECT nip FROM teachers WHERE period_id = ?",
        [targetPeriodId]
      );
      const existingNips = new Set(existingTeachers.map((t: any) => String(t.nip)));

      let copiedCount = 0;
      for (const t of prevTeachers) {
        if (!existingNips.has(String(t.nip))) {
          await db.query(
            `INSERT INTO teachers (name, email, nip, specialization, status, period_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [t.name, t.email, t.nip, t.specialization, t.status, targetPeriodId]
          );
          copiedCount++;
        }
      }

      return NextResponse.json({
        success: true,
        message: `Berhasil menyalin ${copiedCount} data guru dari periode sebelumnya (${prevPeriods[0].academic_year} - ${prevPeriods[0].semester})`,
      });
    }

    // Alur Insert Guru Tunggal
    const { name, email, nip, specialization, status, periodId } = body;

    if (!name || !email || !nip || !periodId) {
      return NextResponse.json(
        { success: false, message: "Nama, Email, NIP, dan Periode Akademik wajib diisi" },
        { status: 400 }
      );
    }

    // Cek duplikasi NIP pada periode yang sama
    const [existing]: any = await db.query(
      "SELECT id FROM teachers WHERE nip = ? AND period_id = ?",
      [nip, periodId]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Guru dengan NIP tersebut sudah terdaftar pada periode akademik ini" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `
      INSERT INTO teachers (name, email, nip, specialization, status, period_id)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [name, email, nip, specialization || "Akademik", status || "Aktif", periodId]
    );

    return NextResponse.json({
      success: true,
      message: "Data guru berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error: any) {
    console.error("Teachers API POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
