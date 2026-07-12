"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Plus,
  Home,
} from "lucide-react";

interface ClassAttendanceCard {
  id: string;
  className: string;
  homeroomTeacher: string;
  attendanceRate: number;
  studentsCount: number;
  barColorClass: string;
  textColorClass: string;
}

export default function StudentAttendancePage() {
  const [selectedDate, setSelectedDate] = useState("2023-10-27");

  const stats = [
    {
      title: "Total Siswa Hadir",
      value: "312 / 320",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Rata-rata Kehadiran",
      value: "97.5%",
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Siswa Alpha Hari Ini",
      value: "3 Siswa",
      icon: AlertTriangle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  const classesData: ClassAttendanceCard[] = [
    { id: "1", className: "Kelas 1A", homeroomTeacher: "Bu Sarah Aminah", attendanceRate: 98, studentsCount: 28, barColorClass: "bg-emerald-600", textColorClass: "text-emerald-600" },
    { id: "2", className: "Kelas 1B", homeroomTeacher: "Pak Budi Santoso", attendanceRate: 96, studentsCount: 27, barColorClass: "bg-emerald-600", textColorClass: "text-emerald-600" },
    { id: "3", className: "Kelas 2A", homeroomTeacher: "Bu Rina Wati", attendanceRate: 100, studentsCount: 30, barColorClass: "bg-emerald-600", textColorClass: "text-emerald-600" },
    { id: "4", className: "Kelas 2B", homeroomTeacher: "Pak Agus Salim", attendanceRate: 92, studentsCount: 26, barColorClass: "bg-amber-600", textColorClass: "text-amber-600" },
    { id: "5", className: "Kelas 3A", homeroomTeacher: "Bu Siti Hajar", attendanceRate: 95, studentsCount: 29, barColorClass: "bg-emerald-600", textColorClass: "text-emerald-600" },
    { id: "6", className: "Kelas 3B", homeroomTeacher: "Pak Dedi Kurnia", attendanceRate: 88, studentsCount: 28, barColorClass: "bg-rose-500", textColorClass: "text-rose-500" },
    { id: "7", className: "Kelas 4A", homeroomTeacher: "Bu Maria Ulfa", attendanceRate: 97, studentsCount: 31, barColorClass: "bg-emerald-600", textColorClass: "text-emerald-600" },
    { id: "8", className: "Kelas 4B", homeroomTeacher: "Pak Hendra Jaya", attendanceRate: 94, studentsCount: 30, barColorClass: "bg-amber-600", textColorClass: "text-amber-600" },
    { id: "9", className: "Kelas 5A", homeroomTeacher: "Bu Ani Suryani", attendanceRate: 99, studentsCount: 28, barColorClass: "bg-emerald-600", textColorClass: "text-emerald-600" },
    { id: "10", className: "Kelas 5B", homeroomTeacher: "Pak Yusuf Mansur", attendanceRate: 96, studentsCount: 29, barColorClass: "bg-emerald-600", textColorClass: "text-emerald-600" },
    { id: "11", className: "Kelas 6A", homeroomTeacher: "Bu Dewi Sartika", attendanceRate: 93, studentsCount: 32, barColorClass: "bg-amber-600", textColorClass: "text-amber-600" },
    { id: "12", className: "Kelas 6B", homeroomTeacher: "Pak Ahmad Dhani", attendanceRate: 91, studentsCount: 31, barColorClass: "bg-amber-600", textColorClass: "text-amber-600" },
  ];

  return (
    <div className="flex flex-col gap-8 relative pb-20">
      
      {/* Header section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Presensi Siswa</h1>
          <p className="text-sm text-slate-400 mt-1">
            Pilih kelas untuk melihat detail kehadiran siswa.
          </p>
        </div>

        {/* Date picker */}
        <div className="flex flex-col gap-1.5 self-stretch xl:self-auto min-w-[200px]">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Filter Tanggal</span>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-slate-100 p-6 rounded-2xl flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.02)]"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1.5">{stat.value}</span>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.iconBg} ${stat.iconColor} flex items-center justify-center shrink-0 border border-slate-100/50 shadow-inner`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid of Class Attendance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {classesData.map((cls) => (
          <div
            key={cls.id}
            className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col justify-between"
          >
            {/* Top content */}
            <div className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-[#2563eb] flex items-center justify-center">
                  <Home className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-base font-extrabold ${cls.textColorClass}`}>{cls.attendanceRate}%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Kehadiran</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-800">{cls.className}</h3>
                <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                  👤 {cls.homeroomTeacher}
                </span>
              </div>

              {/* Progress bar info */}
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>Progres Hari Ini</span>
                  <span>{cls.studentsCount} Siswa</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    style={{ width: `${cls.attendanceRate}%` }}
                    className={`h-full rounded-full ${cls.barColorClass}`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Bottom link */}
            <Link
              href="/dashboard/kelas/detail"
              className="border-t border-slate-100/80 p-4 hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-600 transition-all"
            >
              <span>Lihat Detail</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

          </div>
        ))}
      </div>

      {/* Floating Add/Plus Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-[#2563eb] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-105 transition-all">
        <Plus className="w-6 h-6" />
      </button>

    </div>
  );
}
