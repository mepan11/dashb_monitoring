import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // 1. Ambil statistik
    const [totalRes]: any = await db.query("SELECT COUNT(*) AS count FROM users");
    const [adminRes]: any = await db.query("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'");
    
    // Ambil jumlah user unik yang beraktivitas hari ini di log aktivitas
    const [activeRes]: any = await db.query(
      "SELECT COUNT(DISTINCT user_id) AS count FROM activity_logs WHERE DATE(created_at) = CURDATE()"
    );

    const total = totalRes[0]?.count || 0;
    const admin = adminRes[0]?.count || 0;
    const activeToday = activeRes[0]?.count || 0;

    const stats = {
      total,
      activeToday: activeToday > 0 ? activeToday : Math.min(total, 1), // Minimal 1 jika ada user, atau sesuai log
      admin,
      suspended: 0, // Default 0 karena belum ada field status ditangguhkan di skema
    };

    // 2. Ambil daftar pengguna
    const [rows]: any = await db.query(
      "SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY id DESC"
    );

    // Format data untuk UI
    const formattedUsers = rows.map((user: any) => {
      const nameParts = user.name.split(" ");
      const initials = nameParts.length >= 2 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : `${nameParts[0][0] || "U"}`.toUpperCase();

      // Petakan role database ke label UI
      let roleLabel = "Wali Murid";
      if (user.role === "admin") roleLabel = "Administrator";
      else if (user.role === "teacher") roleLabel = "Guru";
      else if (user.role === "coach") roleLabel = "Coach";
      else if (user.role === "parent") roleLabel = "Wali Murid";

      return {
        id: String(user.id),
        name: user.name,
        role: roleLabel,
        email: user.email,
        lastLogin: "Aktif baru-baru ini",
        status: "active",
        initials,
      };
    });

    return NextResponse.json({
      success: true,
      stats,
      data: formattedUsers,
    });
  } catch (error: any) {
    console.error("Users GET API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { fullName, email, role, password } = await request.json();

    if (!fullName || !email || !role || !password) {
      return NextResponse.json(
        { success: false, message: "Semua field (Nama, Email, Role, Password) wajib diisi" },
        { status: 400 }
      );
    }

    // Periksa apakah email sudah terdaftar
    const [existing]: any = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing && existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user baru
    const [result]: any = await db.query(
      "INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, ?, ?)",
      [fullName, email, role, passwordHash]
    );

    return NextResponse.json({
      success: true,
      message: "Akun baru berhasil didaftarkan!",
      data: {
        id: result.insertId,
        name: fullName,
        email,
        role,
      },
    });
  } catch (error: any) {
    console.error("Users POST API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
