"use client";

import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Successful login
        router.push("/dashboard");
      } else {
        setError(data.message || "Email atau kata sandi salah");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Koneksi gagal, silakan coba beberapa saat lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f7fc] p-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
        
        {/* Left Side: Brand info */}
        <div className="flex-1 flex flex-col items-start text-left max-w-lg">
          {/* Logo Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2563eb] flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-800">
              SD Islam Baiturrachman
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-4xl md:text-5xl font-extrabold tracking-tight text-[#1d4ed8] leading-tight">
            Sistem Dashboard Monitoring Sekolah Dasar
          </h1>

          {/* Description */}
          <p className="mt-6 text-slate-500 leading-relaxed text-sm md:text-base">
            Solusi digital terintegrasi untuk memantau kehadiran, pencapaian akademik,
            dan log kegiatan harian sekolah tingkat dasar (SD) secara real-time dan efisien.
          </p>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-[420px] bg-white rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80">
          <h2 className="text-2xl font-bold text-slate-900">
            Selamat Datang
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 mb-8">
            Masuk untuk mengakses monitoring sekolah Anda.
          </p>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="email"
              label="Alamat Email"
              type="email"
              placeholder="nama@sekolah.sch.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              label="Kata Sandi"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? "Memproses..." : "Masuk Sekarang"}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
