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

    const [rows]: any = await db.query(
      "SELECT id, name, email, id_number AS idNumber, specialization, contact, status, schedule, location FROM coaches WHERE id = ?",
      [id]
    );

    const coach = rows[0];
    if (!coach) {
      return NextResponse.json(
        { success: false, message: "Coach tidak ditemukan" },
        { status: 404 }
      );
    }

    // Fetch and calculate coach attendance percentage filtered by period_id
    const [attRows]: any = await db.query(
      `
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status IN ('Hadir', 'Terlambat') THEN 1 ELSE 0 END) AS present
      FROM coach_attendance 
      WHERE coach_id = ? AND period_id = ?
      `,
      [id, activePeriodId]
    );
    const attTotal = attRows[0]?.total || 0;
    const attPresent = attRows[0]?.present || 0;
    const attendanceRate = attTotal > 0 ? ((attPresent / attTotal) * 100).toFixed(1) : "95.0";

    const nameParts = coach.name.split(" ");
    const initials = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : `${nameParts[0][0] || "C"}`.toUpperCase();

    return NextResponse.json({
      success: true,
      data: {
        id: String(coach.id),
        name: coach.name,
        email: coach.email,
        idNumber: coach.idNumber,
        specialization: coach.specialization,
        contact: coach.contact,
        status: coach.status,
        schedule: coach.schedule,
        location: coach.location,
        attendanceRate,
        initials,
      },
    });
  } catch (error: any) {
    console.error("Coach Detail API GET Error:", error);
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
    const { name, email, idNumber, specialization, contact, status, schedule, location } = await request.json();

    if (!name || !email || !idNumber) {
      return NextResponse.json(
        { success: false, message: "Nama, Email, dan ID Number wajib diisi" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `
      UPDATE coaches 
      SET name = ?, email = ?, id_number = ?, specialization = ?, contact = ?, status = ?, schedule = ?, location = ?
      WHERE id = ?
      `,
      [name, email, idNumber, specialization, contact, status, schedule, location, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Coach tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data coach berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("Coach Detail API PUT Error:", error);
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

    const [result]: any = await db.query("DELETE FROM coaches WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Coach tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data coach berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Coach Detail API DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
