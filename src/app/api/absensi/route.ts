import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    let type = url.searchParams.get("type") || "";
    const date = url.searchParams.get("date");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const classId = url.searchParams.get("classId");
    const extracurricularId = url.searchParams.get("extracurricularId");
    const periodId = url.searchParams.get("period_id");

    if (!type || (!date && (!startDate || !endDate))) {
      return NextResponse.json(
        { success: false, message: "Parameter type dan date (atau startDate & endDate) wajib disertakan" },
        { status: 400 }
      );
    }

    // Resolusi period_id aktif
    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // Normalisasi tipe term
    if (type === "siswa") type = "students";
    if (type === "guru") type = "teachers";
    if (type === "coach") type = "coaches";

    const isRange = !!(startDate && endDate);

    if (type === "students") {
      if (!classId) {
        return NextResponse.json(
          { success: false, message: "classId wajib disertakan untuk tipe students" },
          { status: 400 }
        );
      }

      // Ambil nama kelas terlebih dahulu
      const [classRows]: any = await db.query("SELECT class_name FROM classes WHERE id = ?", [classId]);
      const className = classRows[0]?.class_name;
      if (!className) {
        return NextResponse.json({ success: true, data: [] });
      }

      if (isRange) {
        // Query untuk histori rentang
        const [rows]: any = await db.query(
          `SELECT DATE_FORMAT(sa.date, '%Y-%m-%d') AS date, s.name, s.nisn, sa.status AS attendanceStatus
           FROM student_attendance sa
           JOIN students s ON sa.student_id = s.id
           WHERE s.class_label = ? AND sa.date BETWEEN ? AND ? AND sa.period_id = ?
           ORDER BY sa.date ASC, s.name ASC`,
          [className, startDate, endDate, activePeriodId]
        );
        return NextResponse.json({ success: true, data: rows });
      } else {
        // Ambil data siswa dan kehadiran pada tanggal tersebut
        const [rows]: any = await db.query(
          `SELECT s.id, s.name, s.gender_text, s.gender_code, s.nisn, s.status AS studentStatus,
                  sa.status AS attendanceStatus
           FROM students s
           LEFT JOIN student_attendance sa ON s.id = sa.student_id AND sa.date = ? AND sa.period_id = ?
           WHERE s.class_label = ?
           ORDER BY s.name ASC`,
          [date, activePeriodId, className]
        );

        const formatted = rows.map((s: any) => {
          const nameParts = s.name.trim().split(" ");
          const initials = nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
            : `${nameParts[0][0] || "S"}`.toUpperCase();

          return {
            id: String(s.id),
            name: s.name,
            nisn: s.nisn,
            initials,
            status: s.attendanceStatus || null
          };
        });

        return NextResponse.json({ success: true, data: formatted });
      }

    } else if (type === "teachers") {
      if (isRange) {
        // Query untuk histori rentang
        const [rows]: any = await db.query(
          `SELECT DATE_FORMAT(ta.date, '%Y-%m-%d') AS date, t.name, t.nip, ta.status AS attendanceStatus, ta.check_in_time AS checkInTime, ta.check_out_time AS checkOutTime
           FROM teacher_attendance ta
           JOIN teachers t ON ta.teacher_id = t.id
           WHERE ta.date BETWEEN ? AND ? AND ta.period_id = ?
           ORDER BY ta.date ASC, t.name ASC`,
          [startDate, endDate, activePeriodId]
        );
        return NextResponse.json({ success: true, data: rows });
      } else {
        // Ambil data guru dan kehadiran pada tanggal tersebut
        const [rows]: any = await db.query(
          `SELECT t.id, t.name, t.email, t.nip, t.specialization, t.status AS teacherStatus,
                  ta.status AS attendanceStatus, ta.check_in_time AS checkInTime, ta.check_out_time AS checkOutTime
           FROM teachers t
           LEFT JOIN teacher_attendance ta ON t.id = ta.teacher_id AND ta.date = ? AND ta.period_id = ?
           ORDER BY t.name ASC`,
          [date, activePeriodId]
        );

        const formatted = rows.map((t: any) => {
          const nameParts = t.name.trim().split(" ");
          const initials = nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
            : `${nameParts[0][0] || "G"}`.toUpperCase();

          return {
            id: String(t.id),
            name: t.name,
            nip: t.nip,
            initials,
            status: t.attendanceStatus || null,
            checkInTime: t.checkInTime ? t.checkInTime.replace(" WIB", "") : null,
            checkOutTime: t.checkOutTime ? t.checkOutTime.replace(" WIB", "") : null
          };
        });

        return NextResponse.json({ success: true, data: formatted });
      }

    } else if (type === "coaches") {
      if (isRange) {
        // Query untuk histori rentang
        const [rows]: any = await db.query(
          `SELECT DATE_FORMAT(ca.date, '%Y-%m-%d') AS date, c.name, c.id_number AS idNumber, ca.status AS attendanceStatus, ca.check_in_time AS checkInTime, ca.check_out_time AS checkOutTime
           FROM coach_attendance ca
           JOIN coaches c ON ca.coach_id = c.id
           WHERE ca.date BETWEEN ? AND ? AND ca.period_id = ?
           ORDER BY ca.date ASC, c.name ASC`,
          [startDate, endDate, activePeriodId]
        );
        return NextResponse.json({ success: true, data: rows });
      } else {
        // Ambil data coach dan kehadiran pada tanggal tersebut
        const [rows]: any = await db.query(
          `SELECT c.id, c.name, c.email, c.id_number AS idNumber, c.specialization, c.status AS coachStatus,
                  ca.status AS attendanceStatus, ca.check_in_time AS checkInTime, ca.check_out_time AS checkOutTime
           FROM coaches c
           LEFT JOIN coach_attendance ca ON c.id = ca.coach_id AND ca.date = ? AND ca.period_id = ?
           ORDER BY c.name ASC`,
          [date, activePeriodId]
        );

        const formatted = rows.map((c: any) => {
          const nameParts = c.name.trim().split(" ");
          const initials = nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
            : `${nameParts[0][0] || "C"}`.toUpperCase();

          return {
            id: String(c.id),
            name: c.name,
            idNumber: c.idNumber,
            initials,
            status: c.attendanceStatus || null,
            checkInTime: c.checkInTime ? c.checkInTime.replace(" WIB", "") : null,
            checkOutTime: c.checkOutTime ? c.checkOutTime.replace(" WIB", "") : null
          };
        });

        return NextResponse.json({ success: true, data: formatted });
      }

    } else if (type === "ekskul") {
      if (!extracurricularId) {
        return NextResponse.json(
          { success: false, message: "extracurricularId wajib disertakan untuk tipe ekskul" },
          { status: 400 }
        );
      }

      if (isRange) {
        const [rows]: any = await db.query(
          `SELECT DATE_FORMAT(sa.date, '%Y-%m-%d') AS date, s.name, s.nisn, s.class_label AS classLabel, sa.status AS attendanceStatus
           FROM student_attendance sa
           JOIN students s ON sa.student_id = s.id
           JOIN extracurricular_students es ON es.student_id = s.id
           WHERE es.extracurricular_id = ? AND sa.date BETWEEN ? AND ? AND sa.period_id = ?
           ORDER BY sa.date ASC, s.name ASC`,
          [extracurricularId, startDate, endDate, activePeriodId]
        );
        return NextResponse.json({ success: true, data: rows });
      } else {
        const [rows]: any = await db.query(
          `SELECT s.id, s.name, s.gender_text, s.gender_code, s.nisn, s.class_label,
                  sa.status AS attendanceStatus
           FROM extracurricular_students es
           JOIN students s ON es.student_id = s.id
           LEFT JOIN student_attendance sa ON s.id = sa.student_id AND sa.date = ? AND sa.period_id = ?
           WHERE es.extracurricular_id = ?
           ORDER BY s.name ASC`,
          [date, activePeriodId, extracurricularId]
        );

        const formatted = rows.map((s: any) => {
          const nameParts = s.name.trim().split(" ");
          const initials = nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
            : `${nameParts[0][0] || "S"}`.toUpperCase();

          return {
            id: String(s.id),
            name: s.name,
            class_label: s.class_label,
            nisn: s.nisn,
            initials,
            status: s.attendanceStatus || null
          };
        });

        return NextResponse.json({ success: true, data: formatted });
      }
    }

    return NextResponse.json({ success: false, message: "Tipe tidak dikenal" }, { status: 400 });
  } catch (error: any) {
    console.error("Absensi GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { type, date, attendance, classId, subjectId, extracurricularId, periodId } = body;

    if (!type || !date || !Array.isArray(attendance)) {
      return NextResponse.json(
        { success: false, message: "Parameter type, date, dan attendance wajib diisi" },
        { status: 400 }
      );
    }

    // Resolusi period_id aktif
    let activePeriodId = periodId;
    if (!activePeriodId) {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // Normalisasi tipe term
    if (type === "siswa") type = "students";
    if (type === "guru") type = "teachers";
    if (type === "coach") type = "coaches";

    if (type === "students") {
      for (const item of attendance) {
        const { studentId, status } = item;
        
        const [existing]: any = await db.query(
          "SELECT id FROM student_attendance WHERE student_id = ? AND date = ? AND period_id = ?",
          [studentId, date, activePeriodId]
        );

        if (existing.length > 0) {
          await db.query(
            "UPDATE student_attendance SET status = ? WHERE id = ?",
            [status, existing[0].id]
          );
        } else {
          await db.query(
            "INSERT INTO student_attendance (student_id, status, date, period_id) VALUES (?, ?, ?, ?)",
            [studentId, status, date, activePeriodId]
          );
        }
      }

      // Log aktivitas
      const [classInfo]: any = await db.query("SELECT class_name FROM classes WHERE id = ?", [classId]);
      const className = classInfo[0]?.class_name || "Kelas";
      await db.query(
        "INSERT INTO activity_logs (action, target, details) VALUES (?, ?, ?)",
        ["Presensi Siswa", className, `Mencatat kehadiran siswa kelas ${className} untuk tanggal ${date}`]
      );

      return NextResponse.json({ success: true, message: "Kehadiran siswa berhasil disimpan" });

    } else if (type === "teachers") {
      for (const item of attendance) {
        const { teacherId, status, checkInTime, checkOutTime } = item;

        const [existing]: any = await db.query(
          "SELECT id FROM teacher_attendance WHERE teacher_id = ? AND date = ? AND period_id = ?",
          [teacherId, date, activePeriodId]
        );

        if (existing.length > 0) {
          await db.query(
            "UPDATE teacher_attendance SET status = ?, check_in_time = ?, check_out_time = ? WHERE id = ?",
            [status, checkInTime || "-- : --", checkOutTime || "-- : --", existing[0].id]
          );
        } else {
          await db.query(
            "INSERT INTO teacher_attendance (teacher_id, check_in_time, check_out_time, status, date, period_id) VALUES (?, ?, ?, ?, ?, ?)",
            [teacherId, checkInTime || "-- : --", checkOutTime || "-- : --", status, date, activePeriodId]
          );
        }
      }

      await db.query(
        "INSERT INTO activity_logs (action, target, details) VALUES (?, ?, ?)",
        ["Presensi Guru", "Semua Guru", `Mencatat kehadiran guru untuk tanggal ${date}`]
      );

      return NextResponse.json({ success: true, message: "Kehadiran guru berhasil disimpan" });

    } else if (type === "coaches") {
      for (const item of attendance) {
        const { coachId, status, checkInTime, checkOutTime } = item;

        const [existing]: any = await db.query(
          "SELECT id FROM coach_attendance WHERE coach_id = ? AND date = ? AND period_id = ?",
          [coachId, date, activePeriodId]
        );

        if (existing.length > 0) {
          await db.query(
            "UPDATE coach_attendance SET status = ?, check_in_time = ?, check_out_time = ? WHERE id = ?",
            [status, checkInTime || "-- : --", checkOutTime || "-- : --", existing[0].id]
          );
        } else {
          await db.query(
            "INSERT INTO coach_attendance (coach_id, check_in_time, check_out_time, status, date, period_id) VALUES (?, ?, ?, ?, ?, ?)",
            [coachId, checkInTime || "-- : --", checkOutTime || "-- : --", status, date, activePeriodId]
          );
        }
      }

      await db.query(
        "INSERT INTO activity_logs (action, target, details) VALUES (?, ?, ?)",
        ["Presensi Coach", "Semua Coach", `Mencatat kehadiran coach untuk tanggal ${date}`]
      );

      return NextResponse.json({ success: true, message: "Kehadiran coach berhasil disimpan" });

    } else if (type === "ekskul") {
      for (const item of attendance) {
        const { studentId, status } = item;

        const [existing]: any = await db.query(
          "SELECT id FROM student_attendance WHERE student_id = ? AND date = ? AND period_id = ?",
          [studentId, date, activePeriodId]
        );

        if (existing.length > 0) {
          await db.query(
            "UPDATE student_attendance SET status = ? WHERE id = ?",
            [status, existing[0].id]
          );
        } else {
          await db.query(
            "INSERT INTO student_attendance (student_id, status, date, period_id) VALUES (?, ?, ?, ?)",
            [studentId, status, date, activePeriodId]
          );
        }
      }

      // Log aktivitas
      const [ekskulInfo]: any = await db.query("SELECT name FROM extracurriculars WHERE id = ?", [extracurricularId]);
      const ekskulName = ekskulInfo[0]?.name || "Ekstrakurikuler";
      await db.query(
        "INSERT INTO activity_logs (action, target, details) VALUES (?, ?, ?)",
        ["Presensi Ekskul", ekskulName, `Mencatat kehadiran siswa ekskul ${ekskulName} untuk tanggal ${date}`]
      );

      return NextResponse.json({ success: true, message: "Kehadiran siswa ekskul berhasil disimpan" });

    } else {
      return NextResponse.json(
        { success: false, message: "Tipe presensi tidak dikenali" },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error("Absensi POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
