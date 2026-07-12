import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const statusFilter = url.searchParams.get("status") || "";
    const specFilter = url.searchParams.get("specialization") || "";

    // 1. Fetch counts/statistics
    const [totalRes]: any = await db.query("SELECT COUNT(*) AS count FROM coaches");
    const [activeRes]: any = await db.query("SELECT COUNT(*) AS count FROM coaches WHERE status = 'Aktif'");
    const [specCountRes]: any = await db.query("SELECT COUNT(DISTINCT specialization) AS count FROM coaches");
    const [nonActiveRes]: any = await db.query("SELECT COUNT(*) AS count FROM coaches WHERE status = 'Non-Aktif'");

    const stats = {
      total: totalRes[0]?.count || 0,
      active: activeRes[0]?.count || 0,
      specializationCount: specCountRes[0]?.count || 0,
      nonActive: nonActiveRes[0]?.count || 0,
    };

    // 2. Fetch list of coaches with pagination
    let query = "SELECT id, name, email, id_number AS idNumber, specialization, contact, status, schedule, location FROM coaches";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const queryParams: any[] = [];
    const conditions: string[] = [];

    if (search) {
      conditions.push("(name LIKE ? OR id_number LIKE ? OR email LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (statusFilter && statusFilter !== "Semua") {
      conditions.push("status = ?");
      queryParams.push(statusFilter);
    }

    if (specFilter && specFilter !== "Semua Bidang") {
      conditions.push("specialization = ?");
      queryParams.push(specFilter);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Get total count of filtered records for pagination calculation
    let countQuery = "SELECT COUNT(*) AS count FROM coaches";
    if (conditions.length > 0) {
      countQuery += " WHERE " + conditions.join(" AND ");
    }
    const [countRes]: any = await db.query(countQuery, queryParams);
    const filteredTotal = countRes[0]?.count || 0;

    query += " ORDER BY id DESC LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    const [rows]: any = await db.query(query, queryParams);

    const formattedCoaches = rows.map((r: any) => {
      const nameParts = r.name.split(" ");
      const initials = nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0] || "C"}`.toUpperCase();

      return {
        id: String(r.id),
        name: r.name,
        email: r.email,
        idNumber: r.idNumber,
        specialization: r.specialization,
        specializationType: r.specialization.toLowerCase(),
        contact: r.contact,
        status: r.status,
        schedule: r.schedule,
        location: r.location,
        initials,
      };
    });

    return NextResponse.json({
      success: true,
      stats,
      data: formattedCoaches,
      filteredTotal,
    });
  } catch (error: any) {
    console.error("Coaches API GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, idNumber, specialization, contact, status, schedule, location } = await request.json();

    if (!name || !email || !idNumber) {
      return NextResponse.json(
        { success: false, message: "Nama, Email, dan ID Number wajib diisi" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `
      INSERT INTO coaches (name, email, id_number, specialization, contact, status, schedule, location)
      VALUES (?, ?, ?, ?, ?, COALESCE(?, 'Aktif'), ?, ?)
      `,
      [name, email, idNumber, specialization || "Sains", contact || "", status || "Aktif", schedule || "", location || ""]
    );

    return NextResponse.json({
      success: true,
      message: "Data coach berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error: any) {
    console.error("Coaches API POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
