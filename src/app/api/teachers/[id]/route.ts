import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

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

    // Find teacher_period_id
    const [tpRows]: any = await db.query(
      "SELECT id FROM teacher_periods WHERE teacher_id = ? AND period_id = ?",
      [id, activePeriodId]
    );
    const teacherPeriodId = tpRows[0]?.id;

    let homeroomClass = null;
    const subjects: string[] = [];
    const classes: string[] = [];
    let attendanceRate = "0.0";
    let averageScore = "0.0";

    if (teacherPeriodId) {
      // 2. Fetch homeroom class status filtered by period
      const [classRows]: any = await db.query(
        `SELECT c.id, c.class_name 
         FROM class_periods clp 
         JOIN classes c ON clp.class_id = c.id 
         WHERE clp.homeroom_teacher_id = ?`,
        [teacherPeriodId]
      );
      homeroomClass = classRows[0] || null;

      // 3. Fetch subjects and classes taught by teacher filtered by period
      const [classSubjectsRows]: any = await db.query(
        `
        SELECT DISTINCT s.name AS subject_name 
        FROM class_subjects cs 
        JOIN subject_periods sp ON cs.subject_period_id = sp.id 
        JOIN subjects s ON sp.subject_id = s.id
        WHERE cs.teacher_period_id = ?
        `,
        [teacherPeriodId]
      );

      const [taughtClassesRows]: any = await db.query(
        `
        SELECT DISTINCT c.class_name 
        FROM class_subjects cs 
        JOIN class_periods clp ON cs.class_period_id = clp.id
        JOIN classes c ON clp.class_id = c.id 
        WHERE cs.teacher_period_id = ?
        `,
        [teacherPeriodId]
      );

      classSubjectsRows.forEach((r: any) => subjects.push(r.subject_name));
      taughtClassesRows.forEach((r: any) => classes.push(r.class_name));

      // 4. Fetch and calculate teacher attendance percentage filtered by period
      const [attRows]: any = await db.query(
        `
        SELECT 
          COUNT(*) AS total,
          SUM(CASE WHEN status IN ('Hadir', 'Terlambat') THEN 1 ELSE 0 END) AS present
        FROM teacher_attendance 
        WHERE teacher_period_id = ?
        `,
        [teacherPeriodId]
      );
      const attTotal = attRows[0]?.total || 0;
      const attPresent = attRows[0]?.present || 0;
      attendanceRate = attTotal > 0 ? ((attPresent / attTotal) * 100).toFixed(1) : "0.0";

      // 5. Fetch and calculate average grade of students taught by this teacher filtered by period
      const [gradeRows]: any = await db.query(
        `
        SELECT AVG(g.average) AS avg_score 
        FROM grades g 
        JOIN class_subjects cs ON g.class_subject_id = cs.id
        WHERE cs.teacher_period_id = ?
        `,
        [teacherPeriodId]
      );
      averageScore = gradeRows[0]?.avg_score ? parseFloat(gradeRows[0].avg_score).toFixed(1) : "0.0";
    }

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

    // Ensure teacher has a record in teacher_periods for this period
    let teacherPeriodId: number;
    const [tpRows]: any = await db.query(
      "SELECT id FROM teacher_periods WHERE teacher_id = ? AND period_id = ?",
      [id, activePeriodId]
    );

    if (tpRows.length > 0) {
      teacherPeriodId = tpRows[0].id;
    } else {
      const [tpResult]: any = await db.query(
        "INSERT INTO teacher_periods (teacher_id, period_id, is_active) VALUES (?, ?, 1)",
        [id, activePeriodId]
      );
      teacherPeriodId = tpResult.insertId;
    }

    // --- BUSINESS RULE VALIDATIONS ---
    // Rule 2: WALI KELAS = HANYA 1 per ROMBEL
    if (isHomeroom && homeroomClass) {
      const targetClassName = homeroomClass.startsWith("Kelas") ? homeroomClass : `Kelas ${homeroomClass}`;
      const [hrCheck]: any = await db.query(
        `
        SELECT clp.homeroom_teacher_id, t.name AS teacher_name 
        FROM class_periods clp 
        JOIN classes c ON clp.class_id = c.id
        JOIN teacher_periods tp ON clp.homeroom_teacher_id = tp.id
        JOIN teachers t ON tp.teacher_id = t.id 
        WHERE c.class_name = ? AND clp.period_id = ? AND clp.homeroom_teacher_id IS NOT NULL AND clp.homeroom_teacher_id != ?
        `,
        [targetClassName, activePeriodId, teacherPeriodId]
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
        `SELECT c.class_name 
         FROM class_periods clp 
         JOIN classes c ON clp.class_id = c.id 
         WHERE clp.homeroom_teacher_id = ? AND clp.period_id = ? AND c.class_name != ?`,
        [teacherPeriodId, activePeriodId, targetClassName]
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
        const [cRows]: any = await db.query(
          `SELECT clp.id FROM class_periods clp 
           JOIN classes c ON clp.class_id = c.id 
           WHERE c.class_name = ? AND clp.period_id = ?`,
          [targetClassName, activePeriodId]
        );
        const classPeriodId = cRows[0]?.id;

        if (classPeriodId) {
          for (const subjectName of subjects) {
            const [sRows]: any = await db.query(
              `SELECT sp.id FROM subject_periods sp 
               JOIN subjects s ON sp.subject_id = s.id 
               WHERE s.name = ? AND sp.period_id = ?`,
              [subjectName, activePeriodId]
            );
            const subjectPeriodId = sRows[0]?.id;

            if (subjectPeriodId) {
              const [conflict]: any = await db.query(
                `
                SELECT t.name 
                FROM class_subjects cs 
                JOIN teacher_periods tp ON cs.teacher_period_id = tp.id
                JOIN teachers t ON tp.teacher_id = t.id 
                WHERE cs.class_period_id = ? AND cs.subject_period_id = ? AND cs.teacher_period_id != ?
                `,
                [classPeriodId, subjectPeriodId, teacherPeriodId]
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

    // Fetch old email first
    const [current]: any = await db.query("SELECT email FROM teachers WHERE id = ?", [id]);
    const oldEmail = current[0]?.email;

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

    // Sync to users table
    if (oldEmail) {
      const [existingUser]: any = await db.query("SELECT id FROM users WHERE email = ?", [oldEmail]);
      if (existingUser.length > 0) {
        await db.query("UPDATE users SET email = ?, name = ? WHERE email = ?", [email, name, oldEmail]);
      } else {
        const [existingNew]: any = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existingNew.length === 0) {
          const salt = await bcrypt.genSalt(10);
          const defaultHash = await bcrypt.hash("password123", salt);
          await db.query(
            "INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, 'teacher', ?)",
            [name, email, defaultHash]
          );
        }
      }
    }

    // 2. Manage Homeroom assignment
    // Reset this teacher's homeroom responsibility from all classes in this period
    await db.query("UPDATE class_periods SET homeroom_teacher_id = NULL WHERE homeroom_teacher_id = ? AND period_id = ?", [teacherPeriodId, activePeriodId]);

    if (isHomeroom && homeroomClass) {
      const targetClassName = homeroomClass.startsWith("Kelas") ? homeroomClass : `Kelas ${homeroomClass}`;
      // Find classPeriodId
      const [classPeriodRow]: any = await db.query(
        `SELECT clp.id FROM class_periods clp 
         JOIN classes c ON clp.class_id = c.id 
         WHERE c.class_name = ? AND clp.period_id = ?`,
        [targetClassName, activePeriodId]
      );
      if (classPeriodRow.length > 0) {
        await db.query(
          "UPDATE class_periods SET homeroom_teacher_id = ? WHERE id = ?",
          [teacherPeriodId, classPeriodRow[0].id]
        );
      }
    }

    // 3. Manage Class Subjects taught mapping for this period
    if (Array.isArray(subjects) && Array.isArray(classes)) {
      // Clear existing records for this teacher in this period
      await db.query(
        `DELETE FROM class_subjects WHERE teacher_period_id = ?`,
        [teacherPeriodId]
      );

      // Resolve class and subject IDs to insert
      for (const className of classes) {
        const targetClassName = className.startsWith("Kelas") ? className : `Kelas ${className}`;
        const [cRows]: any = await db.query(
          `SELECT clp.id FROM class_periods clp 
           JOIN classes c ON clp.class_id = c.id 
           WHERE c.class_name = ? AND clp.period_id = ?`,
          [targetClassName, activePeriodId]
        );
        const classPeriodId = cRows[0]?.id;

        if (classPeriodId) {
          for (const subjectName of subjects) {
            const [sRows]: any = await db.query(
              `SELECT sp.id FROM subject_periods sp 
               JOIN subjects s ON sp.subject_id = s.id 
               WHERE s.name = ? AND sp.period_id = ?`,
              [subjectName, activePeriodId]
            );
            const subjectPeriodId = sRows[0]?.id;

            if (subjectPeriodId) {
              await db.query(
                "INSERT IGNORE INTO class_subjects (class_period_id, subject_period_id, teacher_period_id) VALUES (?, ?, ?)",
                [classPeriodId, subjectPeriodId, teacherPeriodId]
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
