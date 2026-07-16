"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  DoorOpen,
  SlidersHorizontal,
  Clock,
  ChevronDown
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

export default function DashboardPage() {
  const [periodId, setPeriodId] = useState("");
  const [periodName, setPeriodName] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mendengarkan perubahan periode akademik
  useEffect(() => {
    const cached = localStorage.getItem("active_period_id") || "";
    const cachedName = localStorage.getItem("active_period_name") || "";
    setPeriodId(cached);
    setPeriodName(cachedName);

    const handlePeriodChange = (e: any) => {
      setPeriodId(e.detail.periodId || "");
      setPeriodName(e.detail.periodName || "");
    };

    window.addEventListener("academic_period_changed", handlePeriodChange);
    return () => {
      window.removeEventListener("academic_period_changed", handlePeriodChange);
    };
  }, []);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const queryParam = periodId ? `?period_id=${periodId}` : "";
        const res = await fetch(`/api/dashboard/stats${queryParam}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [periodId]);

  const stats = [
    {
      title: "Total Siswa",
      value: loading ? "—" : String(data?.totalStudents || 0),
      badge: "Aktif",
      badgeType: "success" as const,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Guru",
      value: loading ? "—" : String(data?.totalTeachers || 0),
      badge: "Aktif",
      badgeType: "neutral" as const,
      icon: GraduationCap,
      iconBg: "bg-amber-50/70",
      iconColor: "text-amber-600",
    },
    {
      title: "Kehadiran Hari Ini",
      value: loading ? "—" : `${data?.attendanceRate || 0}%`,
      badge: data?.attendanceRate && data.attendanceRate >= 90 ? "Sangat Baik" : "Perlu Pantauan",
      badgeType: data?.attendanceRate && data.attendanceRate >= 90 ? ("success" as const) : ("neutral" as const),
      icon: CalendarCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Ruang Kelas",
      value: loading ? "—" : String(data?.totalClasses || 0),
      badge: "Tersedia",
      badgeType: "neutral" as const,
      icon: DoorOpen,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="flex flex-col gap-8 min-h-full justify-between">
      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Selamat Datang, Admin
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Berikut adalah ringkasan operasional SD Islam Baiturrachman hari ini.
          </p>
        </div>
        {periodName && (
          <span className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-xs font-bold text-blue-600 shadow-sm shrink-0">
            Periode: {periodName}
          </span>
        )}
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
              Tren Kehadiran Siswa
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Persentase rata-rata kehadiran siswa per hariaktif
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all">
            Hari Aktif Terbaru
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Chart Grid */}
        <div className="h-60 flex flex-col justify-between relative mt-8">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none h-48 border-b border-slate-100">
            <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
            <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
            <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
            <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
          </div>

          <div className="h-48 flex items-end justify-around w-full z-10 px-4">
            {loading ? (
              <div className="w-full text-center text-slate-400 text-xs font-bold py-12">
                Memuat tren kehadiran...
              </div>
            ) : data?.weeklyTrend && data.weeklyTrend.length > 0 ? (
              data.weeklyTrend.map((t: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center gap-2 group relative">
                  <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold pointer-events-none">
                    {t.percentage}%
                  </div>
                  <div
                    style={{ height: `${(t.percentage / 100) * 120}px` }}
                    className="w-10 bg-[#2563eb] rounded-t-lg hover:opacity-90 transition-all cursor-pointer shadow-sm"
                  ></div>
                  <span className="text-xs font-semibold text-slate-500 mt-2">{t.day}</span>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-slate-400 text-xs font-bold py-12">
                Tidak ada data kehadiran mingguan untuk periode ini.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Aktivitas Terbaru
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Log riwayat pendaftaran siswa dan penugasan guru di periode akademik aktif
            </p>
          </div>
        </div>

        {/* Dynamic Activity List */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-semibold text-xs">
            Memuat aktivitas terbaru...
          </div>
        ) : data?.recentActivities && data.recentActivities.length > 0 ? (
          <div className="flex flex-col gap-4">
            {data.recentActivities.map((act: any, idx: number) => (
              <div key={idx} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100 shadow-sm">
                  {act.title.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-bold text-slate-700">{act.title}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">{act.desc}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{act.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4 border border-slate-100/50">
              <Clock className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">
              Aktivitas Terbaru Kosong
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Belum ada aktivitas terekam untuk periode akademik aktif.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 border-t border-slate-100/60 pt-6 mt-8 gap-4">
        <span>© 2024 SD Islam Baiturrachman Admin System</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-600 font-medium">Bantuan</a>
          <a href="#" className="hover:text-slate-600 font-medium">Kebijakan Privasi</a>
        </div>
      </footer>
    </div>
  );
}
