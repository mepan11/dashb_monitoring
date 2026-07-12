"use client";

import React from "react";
import Link from "next/link";
import {
  Trash2,
  Printer,
  Pencil,
  User,
  MapPin,
  Phone,
  GraduationCap,
  Star,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function StudentProfilePage() {
  const scores = [
    { subject: "Matematika", score: 92 },
    { subject: "Bahasa Indonesia", score: 85 },
    { subject: "Ilmu Pengetahuan Alam", score: 89 },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Top Student Overview Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          {/* Student photo with blue camera icon */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 text-[#2563eb] border border-blue-100 shadow-md flex items-center justify-center font-extrabold text-xl">
              AS
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 bg-[#2563eb] text-white p-1.5 rounded-lg border-2 border-white shadow-sm hover:bg-blue-700 transition-all">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-extrabold text-slate-800">Aris Setiawan</h1>
            <span className="text-xs font-bold text-blue-600">
              NISN: 0098223145
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                Aktif
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                Tahun Ajaran 2023/2024
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 self-stretch md:self-auto w-full md:w-auto">
          <button className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </button>
          <button className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
            <Printer className="w-3.5 h-3.5" />
            Cetak
          </button>
          <Link href="/dashboard/siswa/edit" className="flex-1 md:flex-initial">
            <button className="w-full py-2.5 px-4 rounded-xl bg-[#2563eb] text-white hover:bg-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm">
              <Pencil className="w-3.5 h-3.5" />
              Edit Profil
            </button>
          </Link>
        </div>
      </div>

      {/* Two columns: Info & Akademik */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left Card: Informasi Pribadi */}
        <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col gap-6">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100/50 pb-4">
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563eb]">
              <User className="w-4 h-4" />
            </div>
            Informasi Pribadi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Tempat, Tanggal Lahir</span>
              <span className="text-xs font-semibold text-slate-700 mt-1">Jakarta, 14 Mei 2012</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Jenis Kelamin</span>
              <span className="text-xs font-semibold text-slate-700 mt-1">Laki-laki</span>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Alamat Lengkap</span>
              <span className="text-xs font-semibold text-slate-700 mt-1 leading-relaxed">
                Jl. Mawar Melati No. 45, Kebayoran Baru, Jakarta Selatan, 12150
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Nama Wali</span>
              <span className="text-xs font-semibold text-slate-700 mt-1">Bp. Hendra Setiawan</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Kontak Wali</span>
              <span className="text-xs font-semibold text-slate-700 mt-1">+62 812-3456-7890</span>
            </div>
          </div>
        </div>

        {/* Right Card: Akademik */}
        <div className="w-full lg:w-[380px] bg-[#2563eb] rounded-3xl p-6 text-white shadow-[0_8px_30px_rgb(37,99,235,0.15)] flex flex-col justify-between gap-6 shrink-0">
          <h3 className="text-sm font-bold flex items-center gap-2 border-b border-white/10 pb-4 text-blue-50">
            <GraduationCap className="w-5 h-5 text-blue-100" />
            Akademik
          </h3>

          <div className="flex flex-col gap-4">
            {/* Box 1 */}
            <div className="bg-white/10 border border-white/5 rounded-2xl p-4 flex flex-col gap-1 shadow-inner">
              <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Kelas Saat Ini</span>
              <span className="text-lg font-extrabold">Kelas 5-B</span>
            </div>

            {/* Box 2 */}
            <div className="bg-white/10 border border-white/5 rounded-2xl p-4 flex items-center gap-3 shadow-inner">
              <div className="w-10 h-10 rounded-full bg-white/10 text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                SW
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Wali Kelas</span>
                <span className="text-xs font-extrabold">Ibu Sarah Wijaya, M.Pd</span>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-white text-[#2563eb] font-bold text-xs rounded-xl shadow hover:bg-slate-50 transition-all">
            Lihat Jadwal Kelas
          </button>
        </div>

      </div>

      {/* Bottom Row: Kehadiran & Rangkuman Nilai */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Attendance Card */}
        <div className="w-full lg:w-[240px] bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center gap-4 shrink-0 text-center">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Kehadiran</span>
          
          {/* Progress Circle SVG */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-emerald-600"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="289"
                strokeDashoffset="14" /* 95% filled */
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xl font-extrabold text-slate-800">95%</span>
          </div>

          <span className="text-xs font-extrabold text-emerald-600 mt-1">Sangat Baik</span>
        </div>

        {/* Grades Card */}
        <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col gap-6 justify-between">
          <div className="flex justify-between items-center border-b border-slate-100/50 pb-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-500" />
              Rangkuman Nilai
            </h3>
            <span className="text-[10px] font-extrabold px-3 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
              Rata-rata: 88.5
            </span>
          </div>

          {/* Scores list */}
          <div className="flex flex-col gap-5">
            {scores.map((scoreItem) => (
              <div key={scoreItem.subject} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{scoreItem.subject}</span>
                  <span className="text-emerald-600">{scoreItem.score}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div style={{ width: `${scoreItem.score}%` }} className="h-full bg-emerald-600 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
