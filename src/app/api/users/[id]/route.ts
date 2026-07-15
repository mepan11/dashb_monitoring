import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [rows]: any = await db.query(
      "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    const user = rows[0];

    // Petakan role database ke label UI
    let roleLabel = "Wali Murid";
    if (user.role === "admin") roleLabel = "Administrator";
    else if (user.role === "teacher") roleLabel = "Guru";
    else if (user.role === "coach") roleLabel = "Coach";
    else if (user.role === "parent") roleLabel = "Wali Murid";

    return NextResponse.json({
      success: true,
      data: {
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: roleLabel,
        rawRole: user.role,
      },
    });
  } catch (error: any) {
    console.error("Users ID GET API Error:", error);
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
    const body = await request.json();
    
    // Periksa apakah user ada
    const [rows]: any = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    // Kasus 1: Ganti password
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(body.password, salt);
      
      await db.query(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        [passwordHash, id]
      );
      
      return NextResponse.json({
        success: true,
        message: "Kata sandi berhasil diubah!",
      });
    }

    // Kasus 2: Update data profil (nama, email, role)
    const { fullName, email, role } = body;
    if (!fullName || !email || !role) {
      return NextResponse.json(
        { success: false, message: "Nama, email, dan role wajib diisi" },
        { status: 400 }
      );
    }

    await db.query(
      "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
      [fullName, email, role, id]
    );

    return NextResponse.json({
      success: true,
      message: "Profil pengguna berhasil diperbarui!",
    });

  } catch (error: any) {
    console.error("Users ID PUT API Error:", error);
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

    // Periksa apakah user ada
    const [rows]: any = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus user
    await db.query("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Akun berhasil dihapus!",
    });
  } catch (error: any) {
    console.error("Users ID DELETE API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
