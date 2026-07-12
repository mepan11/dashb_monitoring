import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan kata sandi wajib diisi" },
        { status: 400 }
      );
    }

    // Query user by email from MySQL database
    const [rows]: any = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Email atau kata sandi salah" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Verify hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Email atau kata sandi salah" },
        { status: 401 }
      );
    }

    // Return success response with user profile details
    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
