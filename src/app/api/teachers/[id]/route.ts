import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const periodId = url.searchParams.get("period_id");

    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // 1. Fetch teacher master data
    const [teacherRows]: any = await db.query("SELECT * FROM teachers WHERE id = ?", [id]);

    if (!teacherRows || teacherRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    const teacher = teacherRows[0];

    // 2. Fetch homeroom class status filtered by period
    const [classRows]: any = await db.query(
      "SELECT id, class_name FROM classes WHERE homeroom_teacher_id = ? AND period_id = ?",
      [id, activePeriodId]
    );
    const homeroomClass = classRows[0] || null;

    // 3. Fetch subjects and classes taught by teacher filtered by period
    const [classSubjectsRows]: any = await db.query(
      `
      SELECT DISTINCT s.name AS subject_name 
      FROM class_subjects cs 
      JOIN subjects s ON cs.subject_id = s.id 
      JOIN classes c ON cs.class_id = c.id
      WHERE cs.teacher_id = ? AND c.period_id = ? AND s.period_id = ?
      `,
      [id, activePeriodId, activePeriodId]
    );

    const [taughtClassesRows]: any = await db.query(
      `
      SELECT DISTINCT c.class_name 
      FROM class_subjects cs 
      JOIN classes c ON cs.class_id = c.id 
      WHERE cs.teacher_id = ? AND c.period_id = ?
      `,
      [id, activePeriodId]
    );

    const subjects = classSubjectsRows.map((r: any) => r.subject_name);
    const classes = taughtClassesRows.map((r: any) => r.class_name);

    // 4. Fetch and calculate teacher attendance percentage filtered by period
    const [attRows]: any = await db.query(
      `
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status IN ('Hadir', 'Terlambat') THEN 1 ELSE 0 END) AS present
      FROM teacher_attendance 
      WHERE teacher_id = ? AND period_id = ?
      `,
      [id, activePeriodId]
    );
    const attTotal = attRows[0]?.total || 0;
    const attPresent = attRows[0]?.present || 0;
    const attendanceRate = attTotal > 0 ? ((attPresent / attTotal) * 100).toFixed(1) : "0.0";

    // 5. Fetch and calculate average grade of students taught by this teacher filtered by period
    const [gradeRows]: any = await db.query(
      `
      SELECT AVG(g.average) AS avg_score 
      FROM grades g 
      JOIN class_subjects cs ON g.class_id = cs.class_id 
      JOIN classes c ON g.class_id = c.id
      WHERE cs.teacher_id = ? AND c.period_id = ?
      `,
      [id, activePeriodId]
    );
    const averageScore = gradeRows[0]?.avg_score ? parseFloat(gradeRows[0].avg_score).toFixed(1) : "0.0";

    // Format initials for avatar
    const nameParts = teacher.name.split(" ");
    const initials = nameParts.length >= 2 
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : `${nameParts[0][0] || "G"}`.toUpperCase();

    // Mock additional profile details
    const profileDetails = {
      phone: "+62 812-3456-7890",
      joinDate: "15 Januari 2010",
      address: "Jl. Mentari Pagi No. 45, Kebayoran Lama, Jakarta Selatan",
    };

    return NextResponse.json({
      success: true,
      data: {
        id: String(teacher.id),
        name: teacher.name,
        email: teacher.email,
        nip: teacher.nip,
        specialization: teacher.specialization,
        status: teacher.status,
        initials,
        homeroomClass: homeroomClass ? homeroomClass.class_name : null,
        subjects,
        classes,
        attendanceRate,
        averageScore,
        ...profileDetails,
      },
    });
  } catch (error: any) {
    console.error("Teacher Detail API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { 
      name, 
      email, 
      nip, 
      specialization, 
      status,
      isHomeroom,
      homeroomClass,
      subjects,
      classes,
      periodId
    } = await request.json();

    if (!name || !email || !nip) {
      return NextResponse.json(
        { success: false, message: "Nama, Email, dan NIP wajib diisi" },
        { status: 400 }
      );
    }

    // Resolusi periodId
    let activePeriodId = periodId;
    if (!activePeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
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
        WHERE c.class_name = ? AND c.period_id = ? AND c.homeroom_teacher_id IS NOT NULL AND c.homeroom_teacher_id != ?
        `,
        [targetClassName, activePeriodId, id]
      );
      if (hrCheck && hrCheck.length > 0) {
        return NextResponse.json(
          { success: false, message: `${targetClassName} sudah memiliki wali kelas yaitu ${hrCheck[0].teacher_name}` },
          { status: 400 }
        );
      }
    }

    // Rule 3: SATU GURU = 1 WALI KELAS
    if (isHomeroom) {
      const targetClassName = homeroomClass.startsWith("Kelas") ? homeroomClass : `Kelas ${homeroomClass}`;
      const [teacherHrCheck]: any = await db.query(
        "SELECT class_name FROM classes WHERE homeroom_teacher_id = ? AND period_id = ? AND class_name != ?",
        [id, activePeriodId, targetClassName]
      );
      if (teacherHrCheck && teacherHrCheck.length > 0) {
        return NextResponse.json(
          { success: false, message: `Guru ini sudah menjadi wali kelas di ${teacherHrCheck[0].class_name}` },
          { status: 400 }
        );
      }
    }

    // Rule 1: SATU GURU = SATU MATA PELAJARAN per ROMBEL
    if (Array.isArray(subjects) && Array.isArray(classes)) {
      for (const className of classes) {
        const targetClassName = className.startsWith("Kelas") ? className : `Kelas ${className}`;
        const [cRows]: any = await db.query("SELECT id FROM classes WHERE class_name = ? AND period_id = ?", [targetClassName, activePeriodId]);
        const classId = cRows[0]?.id;

        if (classId) {
          for (const subjectName of subjects) {
            const [sRows]: any = await db.query("SELECT id FROM subjects WHERE name = ? AND period_id = ?", [subjectName, activePeriodId]);
            const subjectId = sRows[0]?.id;

            if (subjectId) {
              const [conflict]: any = await db.query(
                `
                SELECT t.name 
                FROM class_subjects cs 
                JOIN teachers t ON cs.teacher_id = t.id 
                WHERE cs.class_id = ? AND cs.subject_id = ? AND cs.teacher_id != ?
                `,
                [classId, subjectId, id]
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

    // 1. Update teacher master data
    const [result]: any = await db.query(
      `
      UPDATE teachers 
      SET name = ?, email = ?, nip = ?, specialization = COALESCE(?, specialization), status = COALESCE(?, status)
      WHERE id = ?
      `,
      [name, email, nip, specialization, status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    // 2. Manage Homeroom assignment
    // Reset this teacher's homeroom responsibility from all classes in this period
    await db.query("UPDATE classes SET homeroom_teacher_id = NULL WHERE homeroom_teacher_id = ? AND period_id = ?", [id, activePeriodId]);

    if (isHomeroom && homeroomClass) {
      const targetClassName = homeroomClass.startsWith("Kelas") ? homeroomClass : `Kelas ${homeroomClass}`;
      await db.query(
        "UPDATE classes SET homeroom_teacher_id = ? WHERE class_name = ? AND period_id = ?",
        [id, targetClassName, activePeriodId]
      );
    }

    // 3. Manage Class Subjects taught mapping for this period
    if (Array.isArray(subjects) && Array.isArray(classes)) {
      // Clear existing records for this period
      await db.query(
        `DELETE cs FROM class_subjects cs
         JOIN classes c ON cs.class_id = c.id
         WHERE cs.teacher_id = ? AND c.period_id = ?`,
        [id, activePeriodId]
      );

      // Resolve class and subject IDs to insert
      for (const className of classes) {
        const targetClassName = className.startsWith("Kelas") ? className : `Kelas ${className}`;
        const [cRows]: any = await db.query("SELECT id FROM classes WHERE class_name = ? AND period_id = ?", [targetClassName, activePeriodId]);
        const classId = cRows[0]?.id;

        if (classId) {
          for (const subjectName of subjects) {
            const [sRows]: any = await db.query("SELECT id FROM subjects WHERE name = ? AND period_id = ?", [subjectName, activePeriodId]);
            const subjectId = sRows[0]?.id;

            if (subjectId) {
              await db.query(
                "INSERT IGNORE INTO class_subjects (class_id, subject_id, teacher_id) VALUES (?, ?, ?)",
                [classId, subjectId, id]
              );
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Data guru berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("Update Teacher API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete teacher
    const [result]: any = await db.query("DELETE FROM teachers WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data guru berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Delete Teacher API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
