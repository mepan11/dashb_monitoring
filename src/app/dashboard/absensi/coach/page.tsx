"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Download,
  Calendar,
  Users,
  UserCheck,
  Clock,
  UserX,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Palette,
  Cpu,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CoachAttendanceRow {
  id: string;
  name: string;
  coachIdCode: string;
  ekskulField: string;
  ekskulIcon: React.ComponentType<any>;
  time: string;
  status: "Hadir" | "Terlambat" | "Izin" | "Absen";
  initials: string;
}

export default function CoachAttendancePage() {
  const [selectedEkskulFilter, setSelectedEkskulFilter] = useState("Semua Ekstrakurikuler");

  const stats = [
    {
      title: "Total Coach",
      value: 24,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      desc: "Aktif Semester Ini",
      descColor: "text-emerald-600",
    },
    {
      title: "Hadir Hari Ini",
      value: 21,
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      desc: "87.5% Persentase",
    },
    {
      title: "Terlambat",
      value: 2,
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      desc: "Perlu Tindakan",
      descColor: "text-rose-500",
    },
    {
      title: "Absen / Izin",
      value: 1,
      icon: UserX,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      desc: "1 Pengajuan Izin",
    },
  ];

  const coachAttendanceList: CoachAttendanceRow[] = [
    {
      id: "1",
      name: "Agung Setiawan",
      coachIdCode: "Coach ID: C-0012",
      ekskulField: "Sepak Bola",
      ekskulIcon: Trophy,
      time: "15:10 WIB",
      status: "Hadir",
      initials: "AS",
    },
    {
      id: "2",
      name: "Maya Putri",
      coachIdCode: "Coach ID: C-0025",
      ekskulField: "Seni Lukis",
      ekskulIcon: Palette,
      time: "15:45 WIB",
      status: "Terlambat",
      initials: "MP",
    },
    {
      id: "3",
      name: "Rizky Kurniawan",
      coachIdCode: "Coach ID: C-0031",
      ekskulField: "Robotik",
      ekskulIcon: Cpu,
      time: "-- : --",
      status: "Izin",
      initials: "RK",
    },
    {
      id: "4",
      name: "Budi Santoso",
      coachIdCode: "Coach ID: C-0008",
      ekskulField: "Basket",
      ekskulIcon: Trophy,
      time: "-- : --",
      status: "Absen",
      initials: "BS",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Presensi Coach</h1>
          <p className="text-sm text-slate-400 mt-1">
            Pantau kehadiran dan kedisiplinan coach ekstrakurikuler hari ini.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3 self-stretch xl:self-auto">
          {/* Date Picker Dummy */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>07/11/2026</span>
          </div>

          <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
            <Download className="w-4 h-4" />
            Download Rekap
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
              <div className={`p-2.5 rounded-lg ${stat.iconBg} ${stat.iconColor} shrink-0`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-3xl font-extrabold text-slate-800">{stat.value}</span>
              {stat.desc && (
                <span className={`text-[10px] font-bold mt-1.5 ${stat.descColor || "text-slate-400"}`}>
                  {stat.desc}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
        
        {/* Search & Filter Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-slate-800">Data Kehadiran Coach</h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Ekskul */}
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#f4f7fc] text-slate-600 rounded-lg text-xs font-semibold border border-slate-100/50">
                <span>{selectedEkskulFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Config Sliders */}
            <button className="p-2 bg-[#f4f7fc] hover:bg-slate-100 rounded-lg border border-slate-100/50 transition-all text-slate-500">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                <th className="py-4 px-6">NAMA COACH</th>
                <th className="py-4 px-6">BIDANG EKSTRAKURIKULER</th>
                <th className="py-4 px-6">WAKTU PRESENSI</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
              {coachAttendanceList.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-all">
                  
                  {/* Name and ID with Avatar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                        {row.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{row.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium mt-0.5">{row.coachIdCode}</span>
                      </div>
                    </div>
                  </td>

                  {/* Ekskul field with Icon */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <row.ekskulIcon className="w-4 h-4 text-emerald-600" />
                      <span>{row.ekskulField}</span>
                    </div>
                  </td>

                  {/* Clock time */}
                  <td className="py-4 px-6 font-medium text-slate-500">
                    {row.time}
                  </td>

                  {/* Status badge */}
                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                        row.status === "Hadir"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : row.status === "Terlambat"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : row.status === "Izin"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "bg-rose-50 text-rose-600 border border-rose-100"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>

                  {/* Action link */}
                  <td className="py-4 px-6 text-center">
                    <Link
                      href="/dashboard/coach/profile"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Detail
                    </Link>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-400">
            Menampilkan 4 dari 24 Coach
          </span>
          
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400">
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Pages */}
            <button className="w-8 h-8 rounded-lg bg-[#2563eb] text-white text-xs font-bold flex items-center justify-center shadow-sm">
              1
            </button>
            <button className="w-8 h-8 rounded-lg hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center">
              2
            </button>

            {/* Next */}
            <button className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
