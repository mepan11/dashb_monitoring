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

    const [rows]: any = await db.query(
      "SELECT id, name, email, id_number AS idNumber, specialization, status FROM coaches WHERE id = ?",
      [id]
    );

    const coach = rows[0];
    if (!coach) {
      return NextResponse.json(
        { success: false, message: "Coach tidak ditemukan" },
        { status: 404 }
      );
    }

    // Find coach_period_id
    const [cpRows]: any = await db.query(
      "SELECT id FROM coach_periods WHERE coach_id = ? AND period_id = ?",
      [id, activePeriodId]
    );
    const coachPeriodId = cpRows[0]?.id;

    let attendanceRate = "0.0";
    if (coachPeriodId) {
      // Fetch and calculate coach attendance percentage filtered by period_id
      const [attRows]: any = await db.query(
        `
        SELECT 
          COUNT(*) AS total,
          SUM(CASE WHEN status IN ('Hadir', 'Terlambat') THEN 1 ELSE 0 END) AS present
        FROM coach_attendance 
        WHERE coach_period_id = ?
        `,
        [coachPeriodId]
      );
      const attTotal = attRows[0]?.total || 0;
      const attPresent = attRows[0]?.present || 0;
      attendanceRate = attTotal > 0 ? ((attPresent / attTotal) * 100).toFixed(1) : "0.0";
    }

    const nameParts = coach.name.split(" ");
    const initials = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : `${nameParts[0][0] || "C"}`.toUpperCase();

    // Mock additional details
    const additionalDetails = {
      contact: "+62 899-8877-6655",
      schedule: "Senin & Rabu, 15:00 - 17:00",
      location: "Lapangan Olahraga",
    };

    return NextResponse.json({
      success: true,
      data: {
        id: String(coach.id),
        name: coach.name,
        email: coach.email,
        idNumber: coach.idNumber,
        specialization: coach.specialization,
        status: coach.status,
        attendanceRate,
        initials,
        ...additionalDetails,
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
    const { name, email, idNumber, specialization, status, periodId } = await request.json();

    if (!name || !email || !idNumber) {
      return NextResponse.json(
        { success: false, message: "Nama, Email, dan ID Number wajib diisi" },
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

    // Fetch old email first
    const [current]: any = await db.query("SELECT email FROM coaches WHERE id = ?", [id]);
    const oldEmail = current[0]?.email;

    // 1. Update coach master data
    const [result]: any = await db.query(
      `
      UPDATE coaches 
      SET name = ?, email = ?, id_number = ?, specialization = ?, status = ?
      WHERE id = ?
      `,
      [name, email, idNumber, specialization || "Sains", status || "Aktif", id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Coach tidak ditemukan" },
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
            "INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, 'coach', ?)",
            [name, email, defaultHash]
          );
        }
      }
    }

    // 2. Ensure linked to the academic period
    await db.query(
      `INSERT IGNORE INTO coach_periods (coach_id, period_id, is_active)
       VALUES (?, ?, 1)`,
      [id, activePeriodId]
    );

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
