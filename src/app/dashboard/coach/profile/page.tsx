"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Dumbbell,
  Clock,
  Star,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CoachProfilePage() {
  const days = ["Selasa", "Kamis"];
  const locations = ["Lab Komputer 2", "Ruang Robotik"];

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-[#1e293b]">Profil & Manajemen Coach</h1>
        
        {/* Add Coach Button */}
        <Link href="/dashboard/coach/tambah">
          <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
            <Plus className="w-4 h-4" />
            Tambah Coach
          </Button>
        </Link>
      </div>

      {/* Main split-pane content */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left main Profile Card */}
        <div className="flex-1 bg-white border border-slate-100/80 rounded-3xl p-8 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col gap-8 justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            
            {/* Avatar & Name details */}
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-md flex items-center justify-center font-extrabold text-2xl">
                  AS
                </div>
                <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full border-2 border-white shadow-sm">
                  Aktif
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <h2 className="text-xl font-extrabold text-slate-800">
                  Ahmad Subardjo
                </h2>
                <span className="text-xs font-bold text-emerald-600">
                  ID Number: LC-2024-001
                </span>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <Link href="/dashboard/coach/edit" className="flex-1 sm:flex-initial">
                <button className="w-full py-2 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Profil
                </button>
              </Link>
              <button className="flex-1 sm:flex-initial py-2 px-4 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-100/50 text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            </div>

          </div>

          {/* Info Details 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100/80 pt-6 mt-2">
            
            {/* Email */}
            <div className="flex gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">EMAIL</span>
                <span className="text-xs font-semibold text-slate-700 mt-1">ahmad.s@lumina.sch.id</span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">NOMOR TELEPON</span>
                <span className="text-xs font-semibold text-slate-700 mt-1">+62 812-3456-7890</span>
              </div>
            </div>

            {/* Join date */}
            <div className="flex gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">BERGABUNG SEJAK</span>
                <span className="text-xs font-semibold text-slate-700 mt-1">12 Februari 2024</span>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">ALAMAT</span>
                <span className="text-xs font-semibold text-slate-700 mt-1 leading-relaxed">
                  Jl. Flamboyan No. 12, Kebayoran Lama, Jakarta Selatan
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right side Panels (Bidang spesialisasi & Jadwal latihan) */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6 shrink-0 justify-between">
          
          {/* Top emerald card: Spesialisasi */}
          <div className="bg-[#059669] rounded-2xl p-6 text-white shadow-[0_8px_30px_rgb(5,150,105,0.15)] flex flex-col justify-between gap-5 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/5 shadow-inner">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Spesialisasi Utama</span>
                <span className="text-base font-extrabold">Robotik & Coding</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2">
              <span className="text-xs font-medium text-emerald-100">Melatih 20 siswa di program Robotik</span>
              <a href="#" className="text-xs font-bold text-white flex items-center gap-1.5">
                Lihat Program
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Bottom white card: Jadwal Latihan & Aktivitas */}
          <div className="bg-white border border-slate-100/85 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            
            {/* Hari Latihan */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                Hari Latihan
              </h3>

              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <button
                    key={day}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold text-emerald-600 transition-all"
                  >
                    {day}
                    <ExternalLink className="w-3 h-3 text-emerald-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Lokasi Latihan */}
            <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                Lokasi Latihan
              </h3>

              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <span
                    key={loc}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Performance Summary */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-800">Ringkasan Kinerja Latihan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Tingkat Kehadiran */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between gap-6">
            <div className="flex justify-between items-center">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                +1.8% bln ini
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">Tingkat Kehadiran</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-2">96.5%</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div style={{ width: "96.5%" }} className="h-full bg-emerald-500 rounded-full"></div>
            </div>
          </div>

          {/* Card 2: Kepuasan Siswa */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between gap-6">
            <div className="flex justify-between items-center">
              <div className="p-2.5 rounded-lg bg-blue-50 text-[#2563eb]">
                <Star className="w-5 h-5 fill-blue-500 text-blue-500" />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 text-[#2563eb]">
                Sangat Baik
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">Kepuasan Siswa</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-2">4.8 / 5.0</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div style={{ width: "96%" }} className="h-full bg-[#2563eb] rounded-full"></div>
            </div>
          </div>

          {/* Card 3: Tambah Widget Analisis (Dotted Card) */}
          <div className="bg-[#f4f7fc]/30 border-2 border-dashed border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:bg-slate-100/30 transition-all min-h-[180px]">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-[#2563eb] shadow-sm shrink-0">
              <LayoutGrid className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500">Tambah Widget Analisis</span>
              <button className="text-xs font-extrabold text-[#2563eb] hover:text-blue-700 mt-2">
                Konfigurasi
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
