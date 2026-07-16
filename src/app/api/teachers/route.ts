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

    // 1. Fetch counts/statistics filtered by period joining teacher_periods
    const [totalRes]: any = await db.query(
      `SELECT COUNT(DISTINCT t.id) AS count 
       FROM teachers t
       JOIN teacher_periods tp ON t.id = tp.teacher_id AND tp.period_id = ?`, 
      [activePeriodId]
    );
    const [activeRes]: any = await db.query(
      `SELECT COUNT(DISTINCT t.id) AS count 
       FROM teachers t 
       JOIN teacher_periods tp ON t.id = tp.teacher_id AND tp.period_id = ?
       WHERE t.status = 'Aktif'`, 
      [activePeriodId]
    );
    const [akademikRes]: any = await db.query(
      `SELECT COUNT(DISTINCT t.id) AS count 
       FROM teachers t 
       JOIN teacher_periods tp ON t.id = tp.teacher_id AND tp.period_id = ?
       WHERE t.specialization = 'Akademik'`, 
      [activePeriodId]
    );
    const [nonAkademikRes]: any = await db.query(
      `SELECT COUNT(DISTINCT t.id) AS count 
       FROM teachers t 
       JOIN teacher_periods tp ON t.id = tp.teacher_id AND tp.period_id = ?
       WHERE t.specialization = 'Non-Akademik'`, 
      [activePeriodId]
    );

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
        COALESCE(GROUP_CONCAT(DISTINCT cl.class_name SEPARATOR ', '), '—') AS classes 
      FROM teachers t 
      JOIN teacher_periods tp ON t.id = tp.teacher_id AND tp.period_id = ?
      LEFT JOIN class_subjects cs ON tp.id = cs.teacher_period_id 
      LEFT JOIN subject_periods sp ON cs.subject_period_id = sp.id AND sp.period_id = ?
      LEFT JOIN subjects s ON sp.subject_id = s.id
      LEFT JOIN class_periods clp ON cs.class_period_id = clp.id AND clp.period_id = ?
      LEFT JOIN classes cl ON clp.class_id = cl.id
    `;

    const hasLimit = url.searchParams.has("limit");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const queryParams: any[] = [activePeriodId, activePeriodId, activePeriodId];
    const conditions: string[] = [];

    if (search) {
      conditions.push("(t.name LIKE ? OR t.nip LIKE ? OR t.email LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (statusFilter && statusFilter !== "Semua") {
      conditions.push("t.status = ?");
      queryParams.push(statusFilter);
    }

    if (subjectFilter) {
      conditions.push(`tp.id IN (
        SELECT cs_sub.teacher_period_id 
        FROM class_subjects cs_sub 
        JOIN subject_periods sp_sub ON cs_sub.subject_period_id = sp_sub.id 
        JOIN subjects s_sub ON sp_sub.subject_id = s_sub.id 
        WHERE s_sub.name = ? AND sp_sub.period_id = ?
      )`);
    }

    const availableHomeroom = url.searchParams.get("available_homeroom") === "true";
    const currentHomeroomTeacherId = url.searchParams.get("current_homeroom_teacher_id");

    if (availableHomeroom) {
      if (currentHomeroomTeacherId && currentHomeroomTeacherId !== "null" && currentHomeroomTeacherId !== "undefined" && currentHomeroomTeacherId !== "") {
        conditions.push(`(
          tp.id NOT IN (
            SELECT homeroom_teacher_id 
            FROM class_periods 
            WHERE period_id = ? AND homeroom_teacher_id IS NOT NULL
          ) OR t.id = ?
        )`);
        queryParams.push(activePeriodId, currentHomeroomTeacherId);
      } else {
        conditions.push(`tp.id NOT IN (
          SELECT homeroom_teacher_id 
          FROM class_periods 
          WHERE period_id = ? AND homeroom_teacher_id IS NOT NULL
        )`);
        queryParams.push(activePeriodId);
      }
    }

    // Get total count of filtered records
    let countQuery = `
      SELECT COUNT(DISTINCT t.id) AS count 
      FROM teachers t
      JOIN teacher_periods tp ON t.id = tp.teacher_id AND tp.period_id = ?
    `;
    const countQueryParams = [activePeriodId];

    if (conditions.length > 0) {
      countQuery += " WHERE " + conditions.join(" AND ");
      query += " WHERE " + conditions.join(" AND ");
      countQueryParams.push(...queryParams.slice(3));
    }

    const [countRows]: any = await db.query(countQuery, countQueryParams);
    const filteredTotal = countRows[0]?.count || 0;

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

      // Ambil data relasi guru dari periode sebelumnya
      const [prevTeacherPeriods]: any = await db.query(
        "SELECT teacher_id FROM teacher_periods WHERE period_id = ?",
        [prevPeriodId]
      );

      if (prevTeacherPeriods.length === 0) {
        return NextResponse.json(
          { success: false, message: `Tidak ada data guru pada periode sebelumnya (${prevPeriods[0].academic_year} - ${prevPeriods[0].semester})` },
          { status: 400 }
        );
      }

      let copiedCount = 0;
      for (const tp of prevTeacherPeriods) {
        const [result]: any = await db.query(
          `INSERT IGNORE INTO teacher_periods (teacher_id, period_id, is_active)
           VALUES (?, ?, 1)`,
          [tp.teacher_id, targetPeriodId]
        );
        if (result.affectedRows > 0) {
          copiedCount++;
        }
      }

      return NextResponse.json({
        success: true,
        message: `Berhasil menyalin ${copiedCount} data guru ke periode aktif dari periode sebelumnya (${prevPeriods[0].academic_year} - ${prevPeriods[0].semester})`,
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

    // 1. Dapatkan atau buat data guru master
    let teacherId: number;
    const [existingMaster]: any = await db.query(
      "SELECT id FROM teachers WHERE nip = ? OR email = ?",
      [nip, email]
    );

    if (existingMaster.length > 0) {
      teacherId = existingMaster[0].id;
      // Update data guru jika ada perubahan
      await db.query(
        "UPDATE teachers SET name = ?, email = ?, specialization = ?, status = ? WHERE id = ?",
        [name, email, specialization || "Akademik", status || "Aktif", teacherId]
      );
    } else {
      const [insertRes]: any = await db.query(
        `INSERT INTO teachers (name, email, nip, specialization, status)
         VALUES (?, ?, ?, ?, ?)`,
        [name, email, nip, specialization || "Akademik", status || "Aktif"]
      );
      teacherId = insertRes.insertId;
    }

    // 2. Hubungkan ke periode akademik
    const [existingJunction]: any = await db.query(
      "SELECT id FROM teacher_periods WHERE teacher_id = ? AND period_id = ?",
      [teacherId, periodId]
    );

    if (existingJunction.length > 0) {
      return NextResponse.json(
        { success: false, message: "Guru tersebut sudah terdaftar pada periode akademik ini" },
        { status: 400 }
      );
    }

    await db.query(
      "INSERT INTO teacher_periods (teacher_id, period_id, is_active) VALUES (?, ?, 1)",
      [teacherId, periodId]
    );

    return NextResponse.json({
      success: true,
      message: "Data guru berhasil ditambahkan",
      id: teacherId,
    });
  } catch (error: any) {
    console.error("Teachers API POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
