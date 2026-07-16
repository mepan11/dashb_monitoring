"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, ChevronDown, Eye, EyeOff, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RegisterNewAccountPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    // Map UI role values to database role values
    let dbRole = formData.role;
    if (formData.role === "guru") dbRole = "teacher";
    else if (formData.role === "wali") dbRole = "parent";

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          role: dbRole,
          password: formData.password,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Akun baru berhasil didaftarkan!");
        router.push("/dashboard/kelola-akun");
      } else {
        setErrorMsg(result.message || "Gagal mendaftarkan akun baru");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorMsg("Terjadi kesalahan koneksi ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">

      {/* Title block */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1e293b]">Pendaftaran Akun Baru</h1>
        <p className="text-sm text-slate-400 mt-1">
          Lengkapi data di bawah ini untuk membuat akses pengguna baru ke sistem.
        </p>
      </div>

      {/* Main Form container */}
      <form onSubmit={handleSave} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_4px_30px_rgb(0,0,0,0.02)] flex flex-col gap-8">

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Left Column: Avatar upload */}
          <div className="w-full md:w-[260px] flex flex-col items-center gap-4 shrink-0 p-4 border-r border-slate-100/80">
            <div className="w-40 h-40 rounded-full bg-blue-50/50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-inner relative overflow-hidden">
              <User className="w-16 h-16 stroke-[1.25]" />
            </div>

            <div className="flex flex-col items-center text-center gap-1.5">
              <span className="text-xs font-bold text-slate-700">Foto Profil</span>
              <span className="text-[10px] text-slate-400 font-semibold">Maksimal 2MB (JPG, PNG)</span>
            </div>

            <button
              type="button"
              className="mt-2 py-2 px-5 rounded-lg border border-blue-200 text-[#2563eb] text-xs font-bold hover:bg-blue-50/30 transition-all shadow-sm"
            >
              Pilih Foto Profil
            </button>
          </div>

          {/* Right Column: Input Fields */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Nama Lengkap */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Masukkan nama lengkap"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Email Instansi */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700">
                Email Instansi <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="contoh@edumanage.sch.id"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Pilih Role */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700">
                Pilih Role <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full appearance-none px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="">Pilih peran...</option>
                  <option value="admin">Administrator</option>
                  <option value="guru">Guru</option>
                  <option value="coach">Coach</option>
                  <option value="kepala_sekolah">Kepala Sekolah</option>
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Password Awal */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700">
                Password Awal <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Min. 8 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-all"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Info Alert Banner */}
            <div className="col-span-1 sm:col-span-2 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 mt-2">
              <div className="p-1 rounded bg-white text-blue-600 shrink-0 h-fit shadow-sm">
                <Info className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] text-slate-600 font-bold leading-normal">
                Password awal akan digunakan untuk login pertama kali. Pengguna wajib mengganti password saat pertama kali login untuk keamanan akun.
              </p>
            </div>

          </div>

        </div>

        {/* Buttons footer */}
        <div className="border-t border-slate-100 pt-6 flex items-center justify-end gap-3">
          <Link href="/dashboard/kelola-akun">
            <Button variant="secondary" className="!py-2.5 !px-5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg" disabled={loading}>
              Batalkan
            </Button>
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-6 rounded-lg bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-bold flex items-center justify-center shadow-sm transition-all disabled:bg-slate-400"
          >
            {loading ? "Menyimpan..." : "Simpan Akun"}
          </button>
        </div>

      </form>

    </div>
  );
}
