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

      // Ambil class_period_id terlebih dahulu
      const [classPeriodRows]: any = await db.query(
        "SELECT id FROM class_periods WHERE class_id = ? AND period_id = ?",
        [classId, activePeriodId]
      );
      const classPeriodId = classPeriodRows[0]?.id;
      if (!classPeriodId) {
        return NextResponse.json({ success: true, data: [] });
      }

      const classSubjectId = url.searchParams.get("classSubjectId") || url.searchParams.get("class_subject_id");

      if (isRange) {
        // Query untuk histori rentang
        const [rows]: any = await db.query(
          `SELECT DATE_FORMAT(sa.date, '%Y-%m-%d') AS date, s.name, s.nisn, sa.status AS attendanceStatus
           FROM student_attendance sa
           JOIN student_periods sp ON sa.student_period_id = sp.id
           JOIN students s ON sp.student_id = s.id
           WHERE sp.class_period_id = ? ${classSubjectId ? "AND sa.class_subject_id = ?" : ""} AND sa.date BETWEEN ? AND ?
           ORDER BY sa.date ASC, s.name ASC`,
          classSubjectId ? [classPeriodId, classSubjectId, startDate, endDate] : [classPeriodId, startDate, endDate]
        );
        return NextResponse.json({ success: true, data: rows });
      } else {
        // Ambil data siswa dan kehadiran pada tanggal tersebut
        let rows: any[];
        if (!classSubjectId) {
          const [result]: any = await db.query(
            `SELECT s.id, s.name, s.gender_text, s.gender_code, s.nisn, s.status AS studentStatus,
                    NULL AS attendanceStatus
             FROM student_periods sp
             JOIN students s ON sp.student_id = s.id
             WHERE sp.class_period_id = ?
             ORDER BY s.name ASC`,
            [classPeriodId]
          );
          rows = result;
        } else {
          const [result]: any = await db.query(
            `SELECT s.id, s.name, s.gender_text, s.gender_code, s.nisn, s.status AS studentStatus,
                    sa.status AS attendanceStatus
             FROM student_periods sp
             JOIN students s ON sp.student_id = s.id
             LEFT JOIN student_attendance sa ON sp.id = sa.student_period_id AND sa.class_subject_id = ? AND sa.date = ?
             WHERE sp.class_period_id = ?
             ORDER BY s.name ASC`,
            [classSubjectId, date, classPeriodId]
          );
          rows = result;
        }

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
      const teacherEmail = url.searchParams.get("teacher_email");
      if (isRange) {
        // Query untuk histori rentang
        let q = `SELECT DATE_FORMAT(ta.date, '%Y-%m-%d') AS date, t.name, t.nip, ta.status AS attendanceStatus, ta.check_in_time AS checkInTime, ta.check_out_time AS checkOutTime
           FROM teacher_attendance ta
           JOIN teacher_periods tp ON ta.teacher_period_id = tp.id
           JOIN teachers t ON tp.teacher_id = t.id
           WHERE tp.period_id = ? AND ta.date BETWEEN ? AND ?`;
        const qParams = [activePeriodId, startDate, endDate];
        if (teacherEmail) {
          q += ` AND t.email = ?`;
          qParams.push(teacherEmail);
        }
        q += ` ORDER BY ta.date ASC, t.name ASC`;
        const [rows]: any = await db.query(q, qParams);
        return NextResponse.json({ success: true, data: rows });
      } else {
        // Ambil data guru dan kehadiran pada tanggal tersebut
        let q = `SELECT t.id, t.name, t.email, t.nip, t.specialization, t.status AS teacherStatus,
                  ta.status AS attendanceStatus, ta.check_in_time AS checkInTime, ta.check_out_time AS checkOutTime
           FROM teacher_periods tp
           JOIN teachers t ON tp.teacher_id = t.id
           LEFT JOIN teacher_attendance ta ON tp.id = ta.teacher_period_id AND ta.date = ?
           WHERE tp.period_id = ?`;
        const qParams = [date, activePeriodId];
        if (teacherEmail) {
          q += ` AND t.email = ?`;
          qParams.push(teacherEmail);
        }
        q += ` ORDER BY t.name ASC`;
        const [rows]: any = await db.query(q, qParams);

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
           JOIN coach_periods cp ON ca.coach_period_id = cp.id
           JOIN coaches c ON cp.coach_id = c.id
           WHERE cp.period_id = ? AND ca.date BETWEEN ? AND ?
           ORDER BY ca.date ASC, c.name ASC`,
          [activePeriodId, startDate, endDate]
        );
        return NextResponse.json({ success: true, data: rows });
      } else {
        // Ambil data coach dan kehadiran pada tanggal tersebut
        const [rows]: any = await db.query(
          `SELECT c.id, c.name, c.email, c.id_number AS idNumber, c.specialization, c.status AS coachStatus,
                  ca.status AS attendanceStatus, ca.check_in_time AS checkInTime, ca.check_out_time AS checkOutTime
           FROM coach_periods cp
           JOIN coaches c ON cp.coach_id = c.id
           LEFT JOIN coach_attendance ca ON cp.id = ca.coach_period_id AND ca.date = ?
           WHERE cp.period_id = ?
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

      // Ambil extracurricular_period_id
      const [ekskulPeriodRows]: any = await db.query(
        "SELECT id FROM extracurricular_periods WHERE extracurricular_id = ? AND period_id = ?",
        [extracurricularId, activePeriodId]
      );
      const epId = ekskulPeriodRows[0]?.id;
      if (!epId) {
        return NextResponse.json({ success: true, data: [] });
      }

      if (isRange) {
        const [rows]: any = await db.query(
          `SELECT DATE_FORMAT(sa.date, '%Y-%m-%d') AS date, s.name, s.nisn, cl.class_name AS classLabel, sa.status AS attendanceStatus
           FROM student_attendance sa
           JOIN student_periods sp ON sa.student_period_id = sp.id
           JOIN students s ON sp.student_id = s.id
           JOIN extracurricular_students es ON es.student_period_id = sp.id
           LEFT JOIN class_periods clp ON sp.class_period_id = clp.id
           LEFT JOIN classes cl ON clp.class_id = cl.id
           WHERE es.extracurricular_period_id = ? AND sa.date BETWEEN ? AND ?
           ORDER BY sa.date ASC, s.name ASC`,
          [epId, startDate, endDate]
        );
        return NextResponse.json({ success: true, data: rows });
      } else {
        const [rows]: any = await db.query(
          `SELECT s.id, s.name, s.gender_text, s.gender_code, s.nisn, cl.class_name AS class_label,
                  sa.status AS attendanceStatus
           FROM extracurricular_students es
           JOIN student_periods sp ON es.student_period_id = sp.id
           JOIN students s ON sp.student_id = s.id
           LEFT JOIN class_periods clp ON sp.class_period_id = clp.id
           LEFT JOIN classes cl ON clp.class_id = cl.id
           LEFT JOIN student_attendance sa ON sp.id = sa.student_period_id AND sa.date = ? AND sa.class_subject_id IS NULL
           WHERE es.extracurricular_period_id = ?
           ORDER BY s.name ASC`,
          [date, epId]
        );

        const formatted = rows.map((s: any) => {
          const nameParts = s.name.trim().split(" ");
          const initials = nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
            : `${nameParts[0][0] || "S"}`.toUpperCase();

          return {
            id: String(s.id),
            name: s.name,
            class_label: s.class_label || "",
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
    let { type, date, attendance, classId, extracurricularId, periodId } = body;

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
      const classSubjectId = body.classSubjectId || body.class_subject_id || null;
      for (const item of attendance) {
        const { studentId, status } = item;
        
        // Dapatkan student_period_id
        const [spRow]: any = await db.query(
          "SELECT id FROM student_periods WHERE student_id = ? AND period_id = ?",
          [studentId, activePeriodId]
        );
        const studentPeriodId = spRow[0]?.id;

        if (studentPeriodId) {
          const [existing]: any = await db.query(
            "SELECT id FROM student_attendance WHERE student_period_id = ? AND date = ? AND (class_subject_id = ? OR (class_subject_id IS NULL AND ? IS NULL))",
            [studentPeriodId, date, classSubjectId, classSubjectId]
          );

          if (existing.length > 0) {
            await db.query(
              "UPDATE student_attendance SET status = ? WHERE id = ?",
              [status, existing[0].id]
            );
          } else {
            await db.query(
              "INSERT INTO student_attendance (student_period_id, class_subject_id, status, date) VALUES (?, ?, ?, ?)",
              [studentPeriodId, classSubjectId, status, date]
            );
          }
        }
      }

      // Log aktivitas
      let className = "Kelas";
      if (classId) {
        const [classInfo]: any = await db.query("SELECT class_name FROM classes WHERE id = ?", [classId]);
        className = classInfo[0]?.class_name || "Kelas";
      }
      await db.query(
        "INSERT INTO activity_logs (action, target, details) VALUES (?, ?, ?)",
        ["Presensi Siswa", className, `Mencatat kehadiran siswa kelas ${className} untuk tanggal ${date}`]
      );

      return NextResponse.json({ success: true, message: "Kehadiran siswa berhasil disimpan" });

    } else if (type === "teachers") {
      for (const item of attendance) {
        const { teacherId, status, checkInTime, checkOutTime } = item;

        // Dapatkan teacher_period_id
        const [tpRow]: any = await db.query(
          "SELECT id FROM teacher_periods WHERE teacher_id = ? AND period_id = ?",
          [teacherId, activePeriodId]
        );
        const teacherPeriodId = tpRow[0]?.id;

        if (teacherPeriodId) {
          const [existing]: any = await db.query(
            "SELECT id FROM teacher_attendance WHERE teacher_period_id = ? AND date = ?",
            [teacherPeriodId, date]
          );

          if (existing.length > 0) {
            await db.query(
              "UPDATE teacher_attendance SET status = ?, check_in_time = ?, check_out_time = ? WHERE id = ?",
              [status, checkInTime || "-- : --", checkOutTime || "-- : --", existing[0].id]
            );
          } else {
            await db.query(
              "INSERT INTO teacher_attendance (teacher_period_id, check_in_time, check_out_time, status, date) VALUES (?, ?, ?, ?, ?)",
              [teacherPeriodId, checkInTime || "-- : --", checkOutTime || "-- : --", status, date]
            );
          }
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

        // Dapatkan coach_period_id
        const [cpRow]: any = await db.query(
          "SELECT id FROM coach_periods WHERE coach_id = ? AND period_id = ?",
          [coachId, activePeriodId]
        );
        const coachPeriodId = cpRow[0]?.id;

        if (coachPeriodId) {
          const [existing]: any = await db.query(
            "SELECT id FROM coach_attendance WHERE coach_period_id = ? AND date = ?",
            [coachPeriodId, date]
          );

          if (existing.length > 0) {
            await db.query(
              "UPDATE coach_attendance SET status = ?, check_in_time = ?, check_out_time = ? WHERE id = ?",
              [status, checkInTime || "-- : --", checkOutTime || "-- : --", existing[0].id]
            );
          } else {
            await db.query(
              "INSERT INTO coach_attendance (coach_period_id, check_in_time, check_out_time, status, date) VALUES (?, ?, ?, ?, ?)",
              [coachPeriodId, checkInTime || "-- : --", checkOutTime || "-- : --", status, date]
            );
          }
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

        // Dapatkan student_period_id
        const [spRow]: any = await db.query(
          "SELECT id FROM student_periods WHERE student_id = ? AND period_id = ?",
          [studentId, activePeriodId]
        );
        const studentPeriodId = spRow[0]?.id;

        if (studentPeriodId) {
          const [existing]: any = await db.query(
            "SELECT id FROM student_attendance WHERE student_period_id = ? AND date = ? AND class_subject_id IS NULL",
            [studentPeriodId, date]
          );

          if (existing.length > 0) {
            await db.query(
              "UPDATE student_attendance SET status = ? WHERE id = ?",
              [status, existing[0].id]
            );
          } else {
            await db.query(
              "INSERT INTO student_attendance (student_period_id, status, date) VALUES (?, ?, ?)",
              [studentPeriodId, status, date]
            );
          }
        }
      }

      let ekskulName = "Ekstrakurikuler";
      if (extracurricularId) {
        const [ekskulInfo]: any = await db.query("SELECT name FROM extracurriculars WHERE id = ?", [extracurricularId]);
        ekskulName = ekskulInfo[0]?.name || "Ekstrakurikuler";
      }
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
