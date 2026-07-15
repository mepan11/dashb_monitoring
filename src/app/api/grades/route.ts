import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const classId = url.searchParams.get("class_id");
    const periodId = url.searchParams.get("period_id");

    if (!classId) {
      return NextResponse.json(
        { success: false, message: "class_id wajib disertakan" },
        { status: 400 }
      );
    }

    // Ambil periode aktif jika periodId tidak dikirim
    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // Ambil info kelas
    const [classRows]: any = await db.query(
      "SELECT class_name FROM classes WHERE id = ?",
      [classId]
    );
    if (!classRows || classRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }
    const className = classRows[0].class_name;

    // Ambil daftar siswa di kelas ini
    const [students]: any = await db.query(
      "SELECT id, name, nisn FROM students WHERE class_label = ? AND status = 'Aktif' ORDER BY name ASC",
      [className]
    );

    const data = [];
    for (const student of students) {
      // 1. Ambil nilai sumatif (UTS, UAS) & status dari tabel grades
      const [gradeRow]: any = await db.query(
        "SELECT daily_assignment, ekskul, uts, uas, average, status FROM grades WHERE student_id = ? AND class_id = ? AND period_id = ? LIMIT 1",
        [student.id, classId, activePeriodId]
      );

      // 2. Ambil rincian nilai tugas harian dari student_daily_grades
      const [dailyGrades]: any = await db.query(
        "SELECT assignment_name, score FROM student_daily_grades WHERE student_id = ? AND class_id = ? AND period_id = ?",
        [student.id, classId, activePeriodId]
      );

      // Hitung rata-rata nilai tugas harian jika ada rincian tugas
      let dailyAssignmentAvg = gradeRow[0]?.daily_assignment || 0;
      if (dailyGrades && dailyGrades.length > 0) {
        const sum = dailyGrades.reduce((acc: number, item: any) => acc + parseFloat(item.score || 0), 0);
        dailyAssignmentAvg = sum / dailyGrades.length;
      }

      const uts = parseFloat(gradeRow[0]?.uts || 0);
      const uas = parseFloat(gradeRow[0]?.uas || 0);
      const ekskul = parseFloat(gradeRow[0]?.ekskul || 0);

      // Hitung nilai akhir/rata-rata rapor secara dinamis
      // Rumus: (2 * Rata-rata Tugas + UTS + UAS) / 4
      const average = (2 * dailyAssignmentAvg + uts + uas) / 4;
      const status = average >= 75 ? "Lulus" : "Remedial"; // Standar KKM 75

      // 3. Hitung persentase kehadiran siswa
      const [attendanceRow]: any = await db.query(
        `SELECT 
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'Hadir' THEN 1 ELSE 0 END) AS present
         FROM student_attendance 
         WHERE student_id = ?`,
        [student.id]
      );
      
      const totalAttendance = attendanceRow[0]?.total || 0;
      const presentAttendance = attendanceRow[0]?.present || 0;
      const attendancePercentage = totalAttendance > 0 
        ? Math.round((presentAttendance / totalAttendance) * 100) 
        : 100; // Default 100% jika belum ada data absensi

      const nameParts = student.name.split(" ");
      const initials = nameParts.length >= 2 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0] || "S"}`.toUpperCase();

      data.push({
        id: String(student.id),
        name: student.name,
        nisn: student.nisn,
        initials,
        dailyGrades,
        dailyAssignmentAvg: Math.round(dailyAssignmentAvg * 10) / 10,
        ekskul,
        uts,
        uas,
        average: Math.round(average * 10) / 10,
        status,
        attendancePercentage,
        totalAttendance,
        presentAttendance,
      });
    }

    // Ambil info statistik kelas
    const totalStudents = data.length;
    const belowKKM = data.filter((d: any) => d.average < 75).length;

    // Ambil info detail periode
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
    const { studentId, classId, periodId, type, assignmentName, score, uts, uas, ekskul } = await request.json();

    if (!studentId || !classId) {
      return NextResponse.json(
        { success: false, message: "studentId dan classId wajib diisi" },
        { status: 400 }
      );
    }

    // Ambil periode aktif jika periodId tidak dikirim
    let activePeriodId = periodId;
    if (!activePeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // Kasus 1: Input/Update Nilai Tugas Harian
    if (type === "daily") {
      if (!assignmentName) {
        return NextResponse.json(
          { success: false, message: "Nama tugas (assignmentName) wajib diisi" },
          { status: 400 }
        );
      }

      // Gunakan INSERT ... ON DUPLICATE KEY UPDATE untuk menyimpan nilai tugas harian
      await db.query(
        `INSERT INTO student_daily_grades (student_id, class_id, period_id, assignment_name, score)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE score = ?`,
        [studentId, classId, activePeriodId, assignmentName, score, score]
      );

      // Hitung ulang rata-rata tugas harian dari student_daily_grades
      const [dailyGrades]: any = await db.query(
        "SELECT score FROM student_daily_grades WHERE student_id = ? AND class_id = ? AND period_id = ?",
        [studentId, classId, activePeriodId]
      );
      const sum = dailyGrades.reduce((acc: number, item: any) => acc + parseFloat(item.score || 0), 0);
      const dailyAssignmentAvg = sum / dailyGrades.length;

      // Update nilai rata-rata tugas harian di tabel master grades
      await updateMasterGrades(studentId, classId, activePeriodId, dailyAssignmentAvg, null, null, null);

      return NextResponse.json({
        success: true,
        message: "Nilai tugas harian berhasil disimpan",
      });
    }

    // Kasus 2: Input/Update Nilai Sumatif (UTS, UAS, Ekskul)
    if (type === "term") {
      await updateMasterGrades(studentId, classId, activePeriodId, null, uts, uas, ekskul);
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

// Fungsi pembantu untuk mengupdate tabel master grades
async function updateMasterGrades(
  studentId: any,
  classId: any,
  periodId: any,
  dailyAssignment: number | null,
  uts: number | null,
  uas: number | null,
  ekskul: number | null
) {
  // Cek apakah data di tabel grades sudah ada
  const [existing]: any = await db.query(
    "SELECT id, daily_assignment, uts, uas, ekskul FROM grades WHERE student_id = ? AND class_id = ? AND period_id = ? LIMIT 1",
    [studentId, classId, periodId]
  );

  let newDaily = dailyAssignment !== null ? dailyAssignment : (existing[0]?.daily_assignment || 0);
  let newUts = uts !== null ? uts : (existing[0]?.uts || 0);
  let newUas = uas !== null ? uas : (existing[0]?.uas || 0);
  let newEkskul = ekskul !== null ? ekskul : (existing[0]?.ekskul || 0);

  // Kalkulasi rata-rata (bobot: 2 * tugas + UTS + UAS / 4)
  const average = (2 * parseFloat(newDaily) + parseFloat(newUts) + parseFloat(newUas)) / 4;
  const status = average >= 75 ? "Lulus" : "Remedial";

  if (existing && existing.length > 0) {
    await db.query(
      `UPDATE grades 
       SET daily_assignment = ?, uts = ?, uas = ?, ekskul = ?, average = ?, status = ?
       WHERE id = ?`,
      [newDaily, newUts, newUas, newEkskul, average, status, existing[0].id]
    );
  } else {
    await db.query(
      `INSERT INTO grades (student_id, class_id, period_id, daily_assignment, uts, uas, ekskul, average, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [studentId, classId, periodId, newDaily, newUts, newUas, newEkskul, average, status]
    );
  }
}
