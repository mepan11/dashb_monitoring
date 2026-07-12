import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const statusFilter = url.searchParams.get("status") || "";
    const subjectFilter = url.searchParams.get("subject") || "";

    // 1. Fetch counts/statistics
    const [totalRes]: any = await db.query("SELECT COUNT(*) AS count FROM teachers");
    const [activeRes]: any = await db.query("SELECT COUNT(*) AS count FROM teachers WHERE status = 'Aktif'");
    const [akademikRes]: any = await db.query("SELECT COUNT(*) AS count FROM teachers WHERE specialization = 'Akademik'");
    const [nonAkademikRes]: any = await db.query("SELECT COUNT(*) AS count FROM teachers WHERE specialization = 'Non-Akademik'");

    const stats = {
      total: totalRes[0]?.count || 0,
      active: activeRes[0]?.count || 0,
      akademik: akademikRes[0]?.count || 0,
      nonAkademik: nonAkademikRes[0]?.count || 0,
    };

    // 2. Fetch list of teachers with their subjects and classes using GROUP_CONCAT
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
      LEFT JOIN subjects s ON cs.subject_id = s.id 
      LEFT JOIN classes c ON cs.class_id = c.id
    `;

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const queryParams: any[] = [];
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
      conditions.push("t.id IN (SELECT cs_sub.teacher_id FROM class_subjects cs_sub JOIN subjects s_sub ON cs_sub.subject_id = s_sub.id WHERE s_sub.name = ?)");
      queryParams.push(subjectFilter);
    }

    // Get total count of filtered records
    let countQuery = "SELECT COUNT(DISTINCT t.id) AS count FROM teachers t";
    if (conditions.length > 0) {
      countQuery += " WHERE " + conditions.join(" AND ");
    }
    const [countRows]: any = await db.query(countQuery, queryParams);
    const filteredTotal = countRows[0]?.count || 0;

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " GROUP BY t.id ORDER BY t.id ASC LIMIT ? OFFSET ?";
    
    // Create query parameter array with limit and offset
    const finalParams = [...queryParams, limit, offset];

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
    console.error("Teachers API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { 
      name, 
      email, 
      nip, 
      specialization,
      isHomeroom,
      homeroomClass,
      subjects,
      classes
    } = await request.json();

    if (!name || !email || !nip) {
      return NextResponse.json(
        { success: false, message: "Nama, Email, dan NIP wajib diisi" },
        { status: 400 }
      );
    }

    // --- BUSINESS RULE VALIDATIONS ---
    // Rule 2: WALI KELAS = HANYA 1 per ROMBEL
    if (isHomeroom && homeroomClass) {
      const targetClassName = homeroomClass.startsWith("Kelas") ? homeroomClass : `Kelas ${homeroomClass}`;
      const [hrCheck]: any = await db.query(
        `
        SELECT c.homeroom_teacher_id, t.name AS teacher_name 
        FROM classes c 
        JOIN teachers t ON c.homeroom_teacher_id = t.id 
        WHERE c.class_name = ? AND c.homeroom_teacher_id IS NOT NULL
        `,
        [targetClassName]
      );
      if (hrCheck && hrCheck.length > 0) {
        return NextResponse.json(
          { success: false, message: `${targetClassName} sudah memiliki wali kelas yaitu ${hrCheck[0].teacher_name}` },
          { status: 400 }
        );
      }
    }

    // Rule 1: SATU GURU = SATU MATA PELAJARAN per ROMBEL
    if (Array.isArray(subjects) && Array.isArray(classes)) {
      for (const className of classes) {
        const targetClassName = className.startsWith("Kelas") ? className : `Kelas ${className}`;
        const [cRows]: any = await db.query("SELECT id FROM classes WHERE class_name = ?", [targetClassName]);
        const classId = cRows[0]?.id;

        if (classId) {
          for (const subjectName of subjects) {
            const [sRows]: any = await db.query("SELECT id FROM subjects WHERE name = ?", [subjectName]);
            const subjectId = sRows[0]?.id;

            if (subjectId) {
              const [conflict]: any = await db.query(
                `
                SELECT t.name 
                FROM class_subjects cs 
                JOIN teachers t ON cs.teacher_id = t.id 
                WHERE cs.class_id = ? AND cs.subject_id = ?
                `,
                [classId, subjectId]
              );
              if (conflict && conflict.length > 0) {
                return NextResponse.json(
                  { 
                    success: false, 
                    message: `Mata pelajaran ${subjectName} di ${targetClassName} sudah diajar oleh guru lain (${conflict[0].name})` 
                  },
                  { status: 400 }
                );
              }
            }
          }
        }
      }
    }

    // 1. Insert new teacher into database
    const [result]: any = await db.query(
      `
      INSERT INTO teachers (name, email, nip, specialization, status)
      VALUES (?, ?, ?, COALESCE(?, 'Akademik'), 'Aktif')
      `,
      [name, email, nip, specialization]
    );

    const teacherId = result.insertId;

    // 2. Manage Homeroom assignment
    if (isHomeroom && homeroomClass) {
      const targetClassName = homeroomClass.startsWith("Kelas") ? homeroomClass : `Kelas ${homeroomClass}`;
      await db.query(
        "UPDATE classes SET homeroom_teacher_id = ? WHERE class_name = ?",
        [teacherId, targetClassName]
      );
    }

    // 3. Manage Class Subjects taught mapping
    if (Array.isArray(subjects) && Array.isArray(classes)) {
      for (const className of classes) {
        const targetClassName = className.startsWith("Kelas") ? className : `Kelas ${className}`;
        const [cRows]: any = await db.query("SELECT id FROM classes WHERE class_name = ?", [targetClassName]);
        const classId = cRows[0]?.id;

        if (classId) {
          for (const subjectName of subjects) {
            const [sRows]: any = await db.query("SELECT id FROM subjects WHERE name = ?", [subjectName]);
            const subjectId = sRows[0]?.id;

            if (subjectId) {
              await db.query(
                "INSERT IGNORE INTO class_subjects (class_id, subject_id, teacher_id) VALUES (?, ?, ?)",
                [classId, subjectId, teacherId]
              );
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Data guru berhasil ditambahkan",
      id: teacherId,
    });
  } catch (error: any) {
    console.error("Create Teacher API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

