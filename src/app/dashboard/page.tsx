"use client";

import React from "react";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  DoorOpen,
  ChevronDown,
  SlidersHorizontal,
  Clock,
} from "lucide-react";

import { StatCard } from "@/components/ui/StatCard";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Siswa",
      value: "—",
      badge: "+12 bln ini",
      badgeType: "success" as const,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Guru",
      value: "—",
      badge: "Aktif",
      badgeType: "neutral" as const,
      icon: GraduationCap,
      iconBg: "bg-amber-50/70",
      iconColor: "text-amber-600",
    },
    {
      title: "Kehadiran Hari Ini",
      value: "—",
      badge: "Sangat Baik",
      badgeType: "success" as const,
      icon: CalendarCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Ruang Kelas",
      value: "—",
      badge: "Penuh",
      badgeType: "neutral" as const,
      icon: DoorOpen,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="flex flex-col gap-8 min-h-full justify-between">
      
      {/* Welcome Heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Selamat Malam, Admin
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Berikut adalah ringkasan operasional SD Maju Jaya hari ini.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            badge={stat.badge}
            badgeType={stat.badgeType}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
            showLine={true}
          />
        ))}
      </div>

      {/* Weekly Trend Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Tren Kehadiran Mingguan
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Persentase kehadiran siswa per hari
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all">
            Minggu Ini
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dummy Chart Grid */}
        <div className="h-48 flex flex-col justify-between relative mt-8">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
            <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
            <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
            <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
          </div>
          <div className="mt-auto w-full flex justify-between px-4 text-xs font-medium text-slate-400 z-10">
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
          </div>
        </div>
      </div>

      {/* Recent Activities Empty State Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Aktivitas Terbaru
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Log riwayat pengelolaan data sekolah
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4 border border-slate-100/50">
            <Clock className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">
            Aktivitas Terbaru Kosong
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Log riwayat pengelolaan data akan muncul di sini.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 border-t border-slate-100/60 pt-6 mt-8 gap-4">
        <span>© 2024 SD Maju Jaya Admin System</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-600 font-medium">Bantuan</a>
          <a href="#" className="hover:text-slate-600 font-medium">Kebijakan Privasi</a>
        </div>
      </footer>

    </div>
  );
}
