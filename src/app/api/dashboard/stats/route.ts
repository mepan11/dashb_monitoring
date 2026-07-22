import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const periodId = url.searchParams.get("period_id");
    const coachEmail = url.searchParams.get("coach_email") || "";

    let activePeriodId = periodId;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    // 1. Total Siswa
    let totalStudents = 0;
    if (coachEmail) {
      const [rows]: any = await db.query(
        `SELECT COUNT(DISTINCT es.student_period_id) AS total
         FROM extracurricular_students es
         JOIN extracurricular_periods ep ON es.extracurricular_period_id = ep.id
         JOIN extracurricular_coaches ec ON ep.id = ec.extracurricular_period_id
         JOIN coach_periods cp ON ec.coach_period_id = cp.id
         JOIN coaches c ON cp.coach_id = c.id
         WHERE ep.period_id = ? AND c.email = ?`,
        [activePeriodId, coachEmail]
      );
      totalStudents = rows[0]?.total || 0;
    } else {
      const [studentCountRows]: any = await db.query(
        "SELECT COUNT(*) AS total FROM student_periods WHERE period_id = ?",
        [activePeriodId]
      );
      totalStudents = studentCountRows[0]?.total || 0;
    }

    // 2. Total Guru (Only needed for Admin/Kepala Sekolah)
    let totalTeachers = 0;
    if (!coachEmail) {
      const [teacherCountRows]: any = await db.query(
        "SELECT COUNT(*) AS total FROM teacher_periods WHERE period_id = ?",
        [activePeriodId]
      );
      totalTeachers = teacherCountRows[0]?.total || 0;
    }

    // 3. Ruang Kelas (Only needed for Admin/Kepala Sekolah)
    let totalClasses = 0;
    if (!coachEmail) {
      const [classCountRows]: any = await db.query(
        "SELECT COUNT(*) AS total FROM class_periods WHERE period_id = ?",
        [activePeriodId]
      );
      totalClasses = classCountRows[0]?.total || 0;
    }

    // 4. Kehadiran Hari Ini / Terbaru
    let latestDate = null;
    if (coachEmail) {
      const [latestStudentDateRows]: any = await db.query(
        `SELECT MAX(sa.date) AS d 
         FROM student_attendance sa
         JOIN student_periods sp ON sa.student_period_id = sp.id
         JOIN extracurricular_students es ON es.student_period_id = sp.id
         JOIN extracurricular_periods ep ON es.extracurricular_period_id = ep.id
         JOIN extracurricular_coaches ec ON ep.id = ec.extracurricular_period_id
         JOIN coach_periods cp ON ec.coach_period_id = cp.id
         JOIN coaches c ON cp.coach_id = c.id
         WHERE ep.period_id = ? AND c.email = ?`,
        [activePeriodId, coachEmail]
      );
      latestDate = latestStudentDateRows[0]?.d;
    } else {
      const [latestStudentDateRows]: any = await db.query(
        `SELECT MAX(sa.date) AS d 
         FROM student_attendance sa
         JOIN student_periods sp ON sa.student_period_id = sp.id
         WHERE sp.period_id = ?`,
        [activePeriodId]
      );
      latestDate = latestStudentDateRows[0]?.d;
    }

    let attendanceRate = 100;
    if (latestDate) {
      if (coachEmail) {
        const [attRows]: any = await db.query(
          `SELECT 
             SUM(CASE WHEN sa.status = 'Hadir' THEN 1 ELSE 0 END) AS present,
             COUNT(*) AS total
           FROM student_attendance sa
           JOIN student_periods sp ON sa.student_period_id = sp.id
           JOIN extracurricular_students es ON es.student_period_id = sp.id
           JOIN extracurricular_periods ep ON es.extracurricular_period_id = ep.id
           JOIN extracurricular_coaches ec ON ep.id = ec.extracurricular_period_id
           JOIN coach_periods cp ON ec.coach_period_id = cp.id
           JOIN coaches c ON cp.coach_id = c.id
           WHERE ep.period_id = ? AND c.email = ? AND sa.date = ?`,
          [activePeriodId, coachEmail, latestDate]
        );
        const present = attRows[0]?.present || 0;
        const total = attRows[0]?.total || 0;
        if (total > 0) {
          attendanceRate = Math.round((present / total) * 100);
        }
      } else {
        const [attRows]: any = await db.query(
          `SELECT 
             SUM(CASE WHEN sa.status = 'Hadir' THEN 1 ELSE 0 END) AS present,
             COUNT(*) AS total
           FROM student_attendance sa
           JOIN student_periods sp ON sa.student_period_id = sp.id
           WHERE sp.period_id = ? AND sa.date = ?`,
          [activePeriodId, latestDate]
        );
        const present = attRows[0]?.present || 0;
        const total = attRows[0]?.total || 0;
        if (total > 0) {
          attendanceRate = Math.round((present / total) * 100);
        }
      }
    }

    // 5. Weekly Trend (last 5 active dates)
    let dateRows: any[] = [];
    if (coachEmail) {
      const [rows]: any = await db.query(
        `SELECT DISTINCT sa.date 
         FROM student_attendance sa
         JOIN student_periods sp ON sa.student_period_id = sp.id
         JOIN extracurricular_students es ON es.student_period_id = sp.id
         JOIN extracurricular_periods ep ON es.extracurricular_period_id = ep.id
         JOIN extracurricular_coaches ec ON ep.id = ec.extracurricular_period_id
         JOIN coach_periods cp ON ec.coach_period_id = cp.id
         JOIN coaches c ON cp.coach_id = c.id
         WHERE ep.period_id = ? AND c.email = ?
         ORDER BY sa.date DESC
         LIMIT 5`,
        [activePeriodId, coachEmail]
      );
      dateRows = rows;
    } else {
      const [rows]: any = await db.query(
        `SELECT DISTINCT sa.date 
         FROM student_attendance sa
         JOIN student_periods sp ON sa.student_period_id = sp.id
         WHERE sp.period_id = ?
         ORDER BY sa.date DESC
         LIMIT 5`,
        [activePeriodId]
      );
      dateRows = rows;
    }

    const dates = dateRows.map((r: any) => r.date).reverse();
    const weeklyTrend = await Promise.all(
      dates.map(async (d: string) => {
        let present = 0;
        let total = 0;
        if (coachEmail) {
          const [att]: any = await db.query(
            `SELECT 
               SUM(CASE WHEN sa.status = 'Hadir' THEN 1 ELSE 0 END) AS present,
               COUNT(*) AS total
             FROM student_attendance sa
             JOIN student_periods sp ON sa.student_period_id = sp.id
             JOIN extracurricular_students es ON es.student_period_id = sp.id
             JOIN extracurricular_periods ep ON es.extracurricular_period_id = ep.id
             JOIN extracurricular_coaches ec ON ep.id = ec.extracurricular_period_id
             JOIN coach_periods cp ON ec.coach_period_id = cp.id
             JOIN coaches c ON cp.coach_id = c.id
             WHERE ep.period_id = ? AND c.email = ? AND sa.date = ?`,
            [activePeriodId, coachEmail, d]
          );
          present = att[0]?.present || 0;
          total = att[0]?.total || 0;
        } else {
          const [att]: any = await db.query(
            `SELECT 
               SUM(CASE WHEN sa.status = 'Hadir' THEN 1 ELSE 0 END) AS present,
               COUNT(*) AS total
             FROM student_attendance sa
             JOIN student_periods sp ON sa.student_period_id = sp.id
             WHERE sp.period_id = ? AND sa.date = ?`,
            [activePeriodId, d]
          );
          present = att[0]?.present || 0;
          total = att[0]?.total || 0;
        }
        const percentage = total > 0 ? Math.round((present / total) * 100) : 100;
        const dateObj = new Date(d);
        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        return {
          day: days[dateObj.getDay()],
          percentage
        };
      })
    );

    // 6. Recent Activities
    let recentActivities: any[] = [];
    if (coachEmail) {
      const [recentStudents]: any = await db.query(
        `SELECT s.name, 'Terdaftar di Ekstrakurikuler Anda' AS activity, es.created_at AS time
         FROM extracurricular_students es
         JOIN student_periods sp ON es.student_period_id = sp.id
         JOIN students s ON sp.student_id = s.id
         JOIN extracurricular_periods ep ON es.extracurricular_period_id = ep.id
         JOIN extracurricular_coaches ec ON ep.id = ec.extracurricular_period_id
         JOIN coach_periods cp ON ec.coach_period_id = cp.id
         JOIN coaches c ON cp.coach_id = c.id
         WHERE ep.period_id = ? AND c.email = ?
         ORDER BY es.created_at DESC
         LIMIT 5`,
        [activePeriodId, coachEmail]
      );
      recentActivities = recentStudents.map((item: any) => {
        const formattedTime = new Date(item.time).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        });
        return {
          title: item.name,
          desc: item.activity,
          time: formattedTime
        };
      });
    } else {
      const [recentStudents]: any = await db.query(
        `SELECT s.name, 'Siswa Baru Terdaftar' AS activity, sp.created_at AS time
         FROM student_periods sp
         JOIN students s ON sp.student_id = s.id
         WHERE sp.period_id = ?
         ORDER BY sp.id DESC
         LIMIT 4`,
        [activePeriodId]
      );
      const [recentTeachers]: any = await db.query(
        `SELECT t.name, 'Guru Baru Ditugaskan' AS activity, tp.created_at AS time
         FROM teacher_periods tp
         JOIN teachers t ON tp.teacher_id = t.id
         WHERE tp.period_id = ?
         ORDER BY tp.id DESC
         LIMIT 4`,
        [activePeriodId]
      );
      recentActivities = [...recentStudents, ...recentTeachers]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5)
        .map((item) => {
          const formattedTime = new Date(item.time).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          });
          return {
            title: item.name,
            desc: item.activity,
            time: formattedTime
          };
        });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalClasses,
        attendanceRate,
        weeklyTrend,
        recentActivities
      }
    });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
