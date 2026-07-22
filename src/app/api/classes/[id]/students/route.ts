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

    // Get class_period info
    const [classPeriodRows]: any = await db.query(
      `SELECT clp.id AS class_period_id, clp.homeroom_teacher_id, c.class_name AS className, t.name AS homeroomTeacher
       FROM class_periods clp
       JOIN classes c ON clp.class_id = c.id
       LEFT JOIN teacher_periods tp ON clp.homeroom_teacher_id = tp.id
       LEFT JOIN teachers t ON tp.teacher_id = t.id
       WHERE clp.class_id = ? AND clp.period_id = ?`,
      [id, activePeriodId]
    );

    const cls = classPeriodRows[0];
    if (!cls) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan untuk periode akademik ini" },
        { status: 404 }
      );
    }

    const teacherEmail = url.searchParams.get("teacher_email");
    let isHomeroom = false;
    if (teacherEmail && cls) {
      const [tRows]: any = await db.query(
        "SELECT id FROM teacher_periods WHERE teacher_id = (SELECT id FROM teachers WHERE email = ? LIMIT 1) AND period_id = ? LIMIT 1",
        [teacherEmail, activePeriodId]
      );
      const teacherPeriodId = tRows[0]?.id;
      if (teacherPeriodId && cls.homeroom_teacher_id === teacherPeriodId) {
        isHomeroom = true;
      }
    }

    // Get students belonging to this class period
    const [studentRows]: any = await db.query(
      `SELECT s.id, s.name, s.gender_text, s.gender_code, s.nisn, s.status 
       FROM student_periods sp
       JOIN students s ON sp.student_id = s.id 
       WHERE sp.class_period_id = ?
       ORDER BY s.name ASC`,
      [cls.class_period_id]
    );

    const total = studentRows.length;
    const male = studentRows.filter((s: any) => s.gender_code === "L").length;
    const female = studentRows.filter((s: any) => s.gender_code === "P").length;

    const students = studentRows.map((s: any, idx: number) => {
      const nameParts = s.name.trim().split(" ");
      const initials = nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0] || "S"}`.toUpperCase();

      return {
        id: String(s.id),
        name: s.name,
        absenNumber: `Absen #${String(idx + 1).padStart(2, "0")}`,
        nisn: s.nisn,
        gender: s.gender_text,
        status: s.status,
        initials,
      };
    });

    return NextResponse.json({
      success: true,
      className: cls.className,
      homeroomTeacher: cls.homeroomTeacher || "Belum ditentukan",
      isHomeroom,
      stats: { total, male, female },
      data: students,
    });
  } catch (error: any) {
    console.error("Class Students API GET Error:", error);
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
    const { id } = await params; // class_id
    const userRole = request.headers.get("x-user-role");
    const userEmail = request.headers.get("x-user-email");
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

    if (userRole === "guru") {
      const [classPeriodRows]: any = await db.query(
        `SELECT clp.id 
         FROM class_periods clp
         WHERE clp.class_id = ? AND clp.period_id = ? AND clp.homeroom_teacher_id = (
           SELECT id FROM teacher_periods WHERE teacher_id = (SELECT id FROM teachers WHERE email = ? LIMIT 1) AND period_id = ? LIMIT 1
         )`,
        [id, activePeriodId, userEmail, activePeriodId]
      );
      if (classPeriodRows.length === 0) {
        return NextResponse.json(
          { success: false, message: "Akses ditolak: Anda bukan Wali Kelas untuk kelas ini" },
          { status: 403 }
        );
      }
    }

    // Resolve class_period_id
    const [classPeriodRows]: any = await db.query(
      "SELECT id, class_id FROM class_periods WHERE class_id = ? AND period_id = ?",
      [id, activePeriodId]
    );
    const classPeriod = classPeriodRows[0];
    if (!classPeriod) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan untuk periode akademik ini" },
        { status: 404 }
      );
    }

    // Get student_period details to check if they already have a class in the current period
    const [spRows]: any = await db.query(
      `SELECT sp.id, sp.class_period_id, s.name, c.class_name 
       FROM student_periods sp 
       JOIN students s ON sp.student_id = s.id
       LEFT JOIN class_periods clp ON sp.class_period_id = clp.id
       LEFT JOIN classes c ON clp.class_id = c.id
       WHERE sp.student_id = ? AND sp.period_id = ?`,
      [studentId, activePeriodId]
    );
    
    let studentPeriod = spRows[0];
    if (!studentPeriod) {
      // Create student_period link first
      const [insertSpRes]: any = await db.query(
        "INSERT INTO student_periods (student_id, period_id, class_period_id, is_active) VALUES (?, ?, NULL, 1)",
        [studentId, activePeriodId]
      );
      studentPeriod = { id: insertSpRes.insertId, class_period_id: null, name: "", class_name: null };
    }

    if (studentPeriod.class_period_id) {
      return NextResponse.json(
        { success: false, message: `Siswa sudah terdaftar di kelas ${studentPeriod.class_name || "lain"} pada periode ini` },
        { status: 400 }
      );
    }

    // Update class_period_id of student_periods
    await db.query(
      "UPDATE student_periods SET class_period_id = ? WHERE id = ?",
      [classPeriod.id, studentPeriod.id]
    );

    return NextResponse.json({
      success: true,
      message: "Siswa berhasil ditambahkan ke kelas",
    });
  } catch (error: any) {
    console.error("Class Students API POST Error:", error);
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
    const { id } = await params; // class_id
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

    const userRole = request.headers.get("x-user-role");
    const userEmail = request.headers.get("x-user-email");

    if (userRole === "guru") {
      const [classPeriodRows]: any = await db.query(
        `SELECT clp.id 
         FROM class_periods clp
         WHERE clp.class_id = ? AND clp.period_id = ? AND clp.homeroom_teacher_id = (
           SELECT id FROM teacher_periods WHERE teacher_id = (SELECT id FROM teachers WHERE email = ? LIMIT 1) AND period_id = ? LIMIT 1
         )`,
        [id, activePeriodId, userEmail, activePeriodId]
      );
      if (classPeriodRows.length === 0) {
        return NextResponse.json(
          { success: false, message: "Akses ditolak: Anda bukan Wali Kelas untuk kelas ini" },
          { status: 403 }
        );
      }
    }

    // Set class_period_id to NULL for this student period
    await db.query(
      `UPDATE student_periods 
       SET class_period_id = NULL 
       WHERE student_id = ? AND period_id = ?`,
      [studentId, activePeriodId]
    );

    return NextResponse.json({
      success: true,
      message: "Siswa berhasil dikeluarkan dari kelas",
    });
  } catch (error: any) {
    console.error("Class Students API DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
