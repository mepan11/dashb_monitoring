"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Download,
  GraduationCap,
  Users,
  User,
  Info,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RecentAttendance {
  id: string;
  name: string;
  role: string;
  time: string;
  status: "Hadir" | "Terlambat" | "Absen";
  initials: string;
}

export default function AbsensiPage() {
  const [semesterFilter, setSemesterFilter] = useState("Semester Ganjil 2023");

  const recentAttendanceData: RecentAttendance[] = [
    {
      id: "1",
      name: "Ahmad Subarkah",
      role: "Guru Matematika",
      time: "07:05 WIB",
      status: "Hadir",
      initials: "AS",
    },
    {
      id: "2",
      name: "Budi Raharjo",
      role: "Coach Renang",
      time: "07:45 WIB",
      status: "Terlambat",
      initials: "BR",
    },
    {
      id: "3",
      name: "Citra Putri",
      role: "Siswa Kelas 4A",
      time: "—",
      status: "Absen",
      initials: "CP",
    },
  ];

  // Bar height percentages for mockup chart
  const chartData = [
    { month: "Jul", studentHeight: "72%", staffHeight: "78%" },
    { month: "Agu", studentHeight: "82%", staffHeight: "85%" },
    { month: "Sep", studentHeight: "68%", staffHeight: "78%" },
    { month: "Okt", studentHeight: "86%", staffHeight: "84%" },
    { month: "Nov", studentHeight: "72%", staffHeight: "76%" },
    { month: "Des", studentHeight: "89%", staffHeight: "88%" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#2563eb]">Monitoring Absensi</span>
          </div>
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Monitoring Kehadiran</h1>
          <p className="text-sm text-slate-400 mt-1">
            Ringkasan data kehadiran harian dan tren akademik.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-[#2563eb] rounded-xl text-xs font-bold border border-blue-100 shadow-sm">
            <Calendar className="w-4 h-4" />
            12 Okt 2023 - Hari Ini
          </div>
          <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
            <Download className="w-4 h-4" />
            Download Rekapitulasi
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Presensi Guru */}
        <Link href="/dashboard/absensi/guru" className="block hover:opacity-95 transition-all">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] h-full">
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-lg bg-blue-50 text-[#2563eb]">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">Presensi Guru</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-2">98.2%</span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-3">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+1.5% dari bulan lalu</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Presensi Coach */}
        <Link href="/dashboard/absensi/coach" className="block hover:opacity-95 transition-all">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] h-full">
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-lg bg-emerald-50 text-[#10b981]">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">Presensi Coach</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-2">94.8%</span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-3">
                <span>— Stabil dalam 7 hari</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Presensi Siswa */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
              <User className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-400">Presensi Siswa</span>
            <span className="text-3xl font-extrabold text-slate-800 mt-2">96.5%</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-rose-500 mt-3">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-0.8% karena musim flu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Attendance Trend Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Tren Kehadiran Bulanan</h2>
            <p className="text-xs text-slate-400 mt-1">Data kumulatif seluruh entitas akademik</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-6">
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span>
                Siswa
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                Staf/Guru
              </div>
            </div>
            {/* Filter Dropdown */}
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option>Semester Ganjil 2023</option>
              <option>Semester Genap 2024</option>
            </select>
          </div>
        </div>

        {/* Custom Styled Bar Chart */}
        <div className="h-64 flex items-end justify-between px-4 sm:px-12 border-b border-slate-100 pb-2 relative mt-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center gap-3 w-16">
              <div className="h-48 flex items-end gap-2 justify-center w-full">
                {/* Student Bar (Blue) */}
                <div
                  style={{ height: data.studentHeight }}
                  className="w-3.5 bg-[#2563eb] rounded-full hover:opacity-90 transition-all cursor-pointer"
                ></div>
                {/* Staff Bar (Green) */}
                <div
                  style={{ height: data.staffHeight }}
                  className="w-3.5 bg-[#10b981] rounded-full hover:opacity-90 transition-all cursor-pointer"
                ></div>
              </div>
              <span className="text-xs font-semibold text-slate-400">{data.month}</span>
            </div>
          ))}
        </div>

        {/* Alert banner/info box */}
        <div className="bg-blue-50/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-50">
          <div className="flex items-center gap-3 text-xs text-slate-600 leading-relaxed">
            <Info className="w-5 h-5 text-[#2563eb] shrink-0" />
            <span>
              Rata-rata kehadiran tertinggi terjadi pada bulan <strong>Desember (97.5%)</strong>.
              Persiapkan strategi untuk menjaga tren ini.
            </span>
          </div>
          <button className="text-xs font-extrabold text-[#2563eb] hover:text-blue-700 whitespace-nowrap">
            Lihat Detail Analitik
          </button>
        </div>
      </div>

      {/* Recent Attendance Status Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Status Kehadiran Terbaru</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafbfc] border-b border-slate-100 text-[10px] font-extrabold text-slate-400 tracking-wider">
                <th className="py-4.5 px-6">Nama</th>
                <th className="py-4.5 px-6">Peran</th>
                <th className="py-4.5 px-6">Waktu Absen</th>
                <th className="py-4.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {recentAttendanceData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-all">
                  
                  {/* Initials Avatar and Name */}
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-[#2563eb] font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                      {row.initials}
                    </div>
                    <span className="font-bold text-slate-800">{row.name}</span>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6 font-semibold text-slate-500">
                    {row.role}
                  </td>

                  {/* Time */}
                  <td className="py-4 px-6 font-semibold text-slate-500">
                    {row.time}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    {row.status === "Hadir" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-[10px] font-bold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {row.status}
                      </span>
                    )}
                    {row.status === "Terlambat" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-100 bg-amber-50 text-[10px] font-bold text-amber-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        {row.status}
                      </span>
                    )}
                    {row.status === "Absen" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-rose-100 bg-rose-50 text-[10px] font-bold text-rose-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        {row.status}
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Link */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-center">
          <button className="text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-6 py-2.5 hover:bg-slate-50 transition-all">
            Lihat Semua Riwayat
          </button>
        </div>
      </div>

    </div>
  );
}
