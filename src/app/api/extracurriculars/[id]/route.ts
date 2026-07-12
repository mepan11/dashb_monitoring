import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows]: any = await db.query(
      `SELECT e.id, e.name, e.category, e.coach_id AS coachId, c.name AS coachName,
              e.schedule, e.location, e.contact,
              (SELECT COUNT(*) FROM extracurricular_students WHERE extracurricular_id = e.id) AS membersCount
       FROM extracurriculars e
       LEFT JOIN coaches c ON e.coach_id = c.id
       WHERE e.id = ?`,
      [id]
    );

    const ekskul = rows[0];
    if (!ekskul) {
      return NextResponse.json(
        { success: false, message: "Ekstrakurikuler tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: ekskul });
  } catch (error: any) {
    console.error("Extracurricular Detail GET Error:", error);
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
    const { name, category, coachId, schedule, location, contact } = await request.json();

    if (!name || !category || !schedule || !location || !contact) {
      return NextResponse.json(
        { success: false, message: "Seluruh parameter wajib diisi (kecuali Coach)" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `UPDATE extracurriculars 
       SET name = ?, category = ?, coach_id = ?, schedule = ?, location = ?, contact = ?
       WHERE id = ?`,
      [name, category, coachId || null, schedule, location, contact, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Ekstrakurikuler tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ekstrakurikuler berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("Extracurricular Detail PUT Error:", error);
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

    // Delete student memberships first to satisfy foreign keys
    await db.query("DELETE FROM extracurricular_students WHERE extracurricular_id = ?", [id]);

    const [result]: any = await db.query("DELETE FROM extracurriculars WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Ekstrakurikuler tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ekstrakurikuler berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Extracurricular Detail DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
