"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Konfirmasi kata sandi tidak cocok!");
      return;
    }
    alert("Kata sandi berhasil diubah!");
    router.push("/dashboard/kelola-akun");
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_4px_30px_rgb(0,0,0,0.03)] flex flex-col gap-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-[#1e293b]">Ganti Password Baru</h1>
        <p className="text-xs text-slate-400 mt-1.5 leading-normal">
          Mengubah kata sandi untuk <strong className="text-slate-800 font-extrabold">Sarah Jenkins, M.Pd</strong>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        
        {/* Kata Sandi Baru */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700">Kata Sandi Baru</label>
          <div className="relative">
            <input
              type={showPass1 ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass1(!showPass1)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-all"
            >
              {showPass1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Konfirmasi Kata Sandi Baru */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700">Konfirmasi Kata Sandi Baru</label>
          <div className="relative">
            <input
              type={showPass2 ? "text" : "password"}
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass2(!showPass2)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-all"
            >
              {showPass2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Info label banner */}
        <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3 flex items-center gap-2 text-slate-400">
          <Info className="w-4 h-4 text-[#2563eb] shrink-0" />
          <span className="text-[10px] font-semibold text-slate-500">
            Minimal 8 karakter dengan kombinasi huruf dan angka
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <Link href="/dashboard/kelola-akun" className="flex-1">
            <Button type="button" variant="secondary" className="w-full !py-3 bg-blue-50 text-[#2563eb] border-none hover:bg-blue-100/50 text-xs font-bold rounded-xl">
              Batalkan
            </Button>
          </Link>
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-bold flex items-center justify-center shadow-sm transition-all"
          >
            Simpan Kata Sandi
          </button>
        </div>

      </form>

    </div>
  );
}
