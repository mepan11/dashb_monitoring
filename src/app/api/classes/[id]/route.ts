import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const periodIdParam = url.searchParams.get("period_id");

    let activePeriodId = periodIdParam;
    if (!activePeriodId || activePeriodId === "undefined") {
      const [activePeriod]: any = await db.query(
        "SELECT id FROM academic_periods WHERE is_active = TRUE LIMIT 1"
      );
      activePeriodId = activePeriod[0]?.id || 1;
    }

    const [rows]: any = await db.query(
      `SELECT c.id, c.class_name AS className, 
              c.capacity,
              tp.teacher_id AS homeroomTeacherId,
              ap.academic_year AS academicYear,
              ap.semester,
              clp.period_id AS periodId
       FROM classes c
       JOIN class_periods clp ON c.id = clp.class_id
       JOIN academic_periods ap ON clp.period_id = ap.id
       LEFT JOIN teacher_periods tp ON clp.homeroom_teacher_id = tp.id
       WHERE c.id = ? AND clp.period_id = ?`,
      [id, activePeriodId]
    );

    const cls = rows[0];
    if (!cls) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan untuk periode akademik ini" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: cls });
  } catch (error: any) {
    console.error("Class detail GET error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
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
    const { className, homeroomTeacherId, capacity, periodId } = await request.json();

    if (!className) {
      return NextResponse.json(
        { success: false, message: "Nama kelas wajib diisi" },
        { status: 400 }
      );
    }

    // Resolusi period_id saat ini jika tidak disediakan
    let targetPeriodId = periodId;
    if (!targetPeriodId) {
      const [current]: any = await db.query(
        "SELECT period_id FROM class_periods WHERE class_id = ? LIMIT 1",
        [id]
      );
      targetPeriodId = current[0]?.period_id || 1;
    }

    // 1. Update class master
    const [result]: any = await db.query(
      `UPDATE classes SET class_name = ?, capacity = ? WHERE id = ?`,
      [className, capacity || 32, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    // 2. Resolve homeroom teacher_period_id
    let homeroomTeacherPeriodId = null;
    if (homeroomTeacherId) {
      const [tpRows]: any = await db.query(
        "SELECT id FROM teacher_periods WHERE teacher_id = ? AND period_id = ?",
        [homeroomTeacherId, targetPeriodId]
      );
      if (tpRows.length > 0) {
        homeroomTeacherPeriodId = tpRows[0].id;
      }
    }

    // 3. Link or update in class_periods
    await db.query(
      `INSERT INTO class_periods (class_id, period_id, homeroom_teacher_id)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE homeroom_teacher_id = ?`,
      [id, targetPeriodId, homeroomTeacherPeriodId, homeroomTeacherPeriodId]
    );

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("Class detail PUT error:", error);
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
    const { id } = await params;
    const [result]: any = await db.query("DELETE FROM classes WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Class detail DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
