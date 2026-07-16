import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const classId = url.searchParams.get("class_id");
    const periodId = url.searchParams.get("period_id");
    const classSubjectId = url.searchParams.get("class_subject_id") || url.searchParams.get("classSubjectId");

    if (!classId) {
      return NextResponse.json(
        { success: false, message: "class_id wajib disertakan" },
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

    // Ambil class_period_id
    const [classPeriodRows]: any = await db.query(
      "SELECT id FROM class_periods WHERE class_id = ? AND period_id = ?",
      [classId, activePeriodId]
    );
    if (!classPeriodRows || classPeriodRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan untuk periode akademik ini" },
        { status: 404 }
      );
    }
    const classPeriodId = classPeriodRows[0].id;

    // Ambil daftar siswa di kelas ini (dari student_periods)
    const [studentPeriods]: any = await db.query(
      `SELECT sp.id AS student_period_id, s.id AS student_id, s.name, s.nisn 
       FROM student_periods sp 
       JOIN students s ON sp.student_id = s.id 
       WHERE sp.class_period_id = ? AND s.status = 'Aktif' 
       ORDER BY s.name ASC`,
      [classPeriodId]
    );

    const data = [];
    for (const sp of studentPeriods) {
      const spId = sp.student_period_id;

      let dailyGrades: any[] = [];
      let gradeRow: any[] = [];

      if (classSubjectId) {
        // 1. Ambil nilai sumatif (UTS, UAS) & status dari tabel grades
        const [gRows]: any = await db.query(
          "SELECT daily_assignment, uts, uas, average, status FROM grades WHERE student_period_id = ? AND class_subject_id = ? LIMIT 1",
          [spId, classSubjectId]
        );
        gradeRow = gRows;

        // 2. Ambil rincian nilai tugas harian dari student_daily_grades dengan join ke subject_assignments & task_names
        const [dgRows]: any = await db.query(
          `SELECT tn.name AS assignment_name, g.score 
           FROM student_daily_grades g
           JOIN subject_assignments sa ON g.assignment_id = sa.id
           JOIN task_names tn ON sa.task_name_id = tn.id
           WHERE g.student_period_id = ? AND g.class_subject_id = ?`,
          [spId, classSubjectId]
        );
        dailyGrades = dgRows;
      }

      let dailyAssignmentAvg = gradeRow[0]?.daily_assignment || 0;
      if (dailyGrades && dailyGrades.length > 0) {
        const sum = dailyGrades.reduce((acc: number, item: any) => acc + parseFloat(item.score || 0), 0);
        dailyAssignmentAvg = sum / dailyGrades.length;
      }

      const uts = parseFloat(gradeRow[0]?.uts || 0);
      const uas = parseFloat(gradeRow[0]?.uas || 0);

      const average = (2 * dailyAssignmentAvg + uts + uas) / 4;
      const status = average >= 75 ? "Lulus" : "Remedial";

      // 3. Hitung persentase kehadiran siswa
      const [attendanceRow]: any = await db.query(
        `SELECT 
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'Hadir' THEN 1 ELSE 0 END) AS present
         FROM student_attendance 
         WHERE student_period_id = ? ${classSubjectId ? "AND class_subject_id = ?" : ""}`,
        classSubjectId ? [spId, classSubjectId] : [spId]
      );
      
      const totalAttendance = attendanceRow[0]?.total || 0;
      const presentAttendance = attendanceRow[0]?.present || 0;
      const attendancePercentage = totalAttendance > 0 
        ? Math.round((presentAttendance / totalAttendance) * 100) 
        : 100;

      const nameParts = sp.name.split(" ");
      const initials = nameParts.length >= 2 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0] || "S"}`.toUpperCase();

      data.push({
        id: String(sp.student_id),
        name: sp.name,
        nisn: sp.nisn,
        initials,
        dailyGrades,
        dailyAssignmentAvg: Math.round(dailyAssignmentAvg * 10) / 10,
        uts,
        uas,
        average: Math.round(average * 10) / 10,
        status,
        attendancePercentage,
        totalAttendance,
        presentAttendance,
      });
    }

    const totalStudents = data.length;
    const belowKKM = data.filter((d: any) => d.average < 75).length;

    const [periodRows]: any = await db.query(
      "SELECT academic_year, semester FROM academic_periods WHERE id = ?",
      [activePeriodId]
    );
    const periodName = periodRows[0] 
      ? `TA ${periodRows[0].academic_year} - ${periodRows[0].semester}` 
      : "—";

    return NextResponse.json({
      success: true,
      data,
      stats: {
        totalStudents,
        belowKKM,
        academicYear: periodRows[0]?.academic_year || "—",
        semester: periodRows[0]?.semester || "—",
        periodName,
      },
    });
  } catch (error: any) {
    console.error("Grades GET API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { studentId, classId, periodId, classSubjectId, type, assignmentId, score, uts, uas } = await request.json();

    if (!studentId || !classId || !classSubjectId) {
      return NextResponse.json(
        { success: false, message: "studentId, classId, dan classSubjectId wajib diisi" },
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

    // Resolve student_period_id
    const [studentPeriodRow]: any = await db.query(
      "SELECT id FROM student_periods WHERE student_id = ? AND period_id = ?",
      [studentId, activePeriodId]
    );
    const studentPeriodId = studentPeriodRow[0]?.id;

    if (!studentPeriodId) {
      return NextResponse.json(
        { success: false, message: "Relasi siswa pada periode ini tidak ditemukan" },
        { status: 404 }
      );
    }

    if (type === "daily") {
      if (!assignmentId) {
        return NextResponse.json(
          { success: false, message: "ID tugas (assignmentId) wajib diisi" },
          { status: 400 }
        );
      }

      await db.query(
        `INSERT INTO student_daily_grades (student_period_id, class_subject_id, assignment_id, score)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE score = ?`,
        [studentPeriodId, classSubjectId, assignmentId, score, score]
      );

      const [dailyGrades]: any = await db.query(
        "SELECT score FROM student_daily_grades WHERE student_period_id = ? AND class_subject_id = ?",
        [studentPeriodId, classSubjectId]
      );
      const sum = dailyGrades.reduce((acc: number, item: any) => acc + parseFloat(item.score || 0), 0);
      const dailyAssignmentAvg = sum / dailyGrades.length;

      await updateMasterGrades(studentPeriodId, classSubjectId, dailyAssignmentAvg, null, null);

      return NextResponse.json({
        success: true,
        message: "Nilai tugas harian berhasil disimpan",
      });
    }

    if (type === "term") {
      await updateMasterGrades(studentPeriodId, classSubjectId, null, uts, uas);
      return NextResponse.json({
        success: true,
        message: "Nilai UTS/UAS berhasil disimpan",
      });
    }

    return NextResponse.json(
      { success: false, message: "Tipe input tidak valid" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Grades POST API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

async function updateMasterGrades(
  studentPeriodId: any,
  classSubjectId: any,
  dailyAssignment: number | null,
  uts: number | null,
  uas: number | null
) {
  const [existing]: any = await db.query(
    "SELECT id, daily_assignment, uts, uas FROM grades WHERE student_period_id = ? AND class_subject_id = ? LIMIT 1",
    [studentPeriodId, classSubjectId]
  );

  const newDaily = dailyAssignment !== null ? dailyAssignment : (existing[0]?.daily_assignment || 0);
  const newUts = uts !== null ? uts : (existing[0]?.uts || 0);
  const newUas = uas !== null ? uas : (existing[0]?.uas || 0);

  const average = (2 * parseFloat(newDaily) + parseFloat(newUts) + parseFloat(newUas)) / 4;
  const status = average >= 75 ? "Lulus" : "Remedial";

  if (existing && existing.length > 0) {
    await db.query(
      `UPDATE grades 
       SET daily_assignment = ?, uts = ?, uas = ?, average = ?, status = ?
       WHERE id = ?`,
      [newDaily, newUts, newUas, average, status, existing[0].id]
    );
  } else {
    await db.query(
      `INSERT INTO grades (student_period_id, class_subject_id, daily_assignment, uts, uas, average, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [studentPeriodId, classSubjectId, newDaily, newUts, newUas, average, status]
    );
  }
}
