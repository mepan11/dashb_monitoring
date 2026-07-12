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
  GraduationCap,
  BookOpen,
  FlaskConical,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";

interface TeacherAttendanceRow {
  id: string;
  name: string;
  nip: string;
  subjectField: string;
  subjectIcon: React.ComponentType<any>;
  time: string;
  status: "Hadir" | "Terlambat" | "Izin" | "Absen";
  initials: string;
}

export default function TeacherAttendancePage() {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("Semua Mata Pelajaran");

  const stats = [
    {
      title: "Total Guru",
      value: 48,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      desc: "Aktif Semester Ini",
      descColor: "text-emerald-600",
    },
    {
      title: "Hadir Hari Ini",
      value: 42,
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      desc: "87.5% Persentase",
    },
    {
      title: "Terlambat",
      value: 4,
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      desc: "Perlu Tindakan",
      descColor: "text-rose-500",
    },
    {
      title: "Absen / Izin",
      value: 2,
      icon: UserX,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      desc: "2 Pengajuan Izin",
    },
  ];

  const teacherAttendanceList: TeacherAttendanceRow[] = [
    {
      id: "1",
      name: "Siti Aminah, S.Pd.",
      nip: "NIP: 19850312011012003",
      subjectField: "Guru Kelas 4A",
      subjectIcon: GraduationCap,
      time: "07:05 WIB",
      status: "Hadir",
      initials: "SA",
    },
    {
      id: "2",
      name: "Budi Darmawan, M.Pd.",
      nip: "NIP: 19920115022019001",
      subjectField: "Matematika",
      subjectIcon: BookOpen,
      time: "07:25 WIB",
      status: "Terlambat",
      initials: "BD",
    },
    {
      id: "3",
      name: "Rina Kartika, S.T.",
      nip: "NIP: 198805202015032001",
      subjectField: "Sains",
      subjectIcon: FlaskConical,
      time: "-- : --",
      status: "Izin",
      initials: "RK",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Presensi Guru</h1>
          <p className="text-sm text-slate-400 mt-1">
            Pantau kehadiran dan kedisiplinan guru hari ini.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3 self-stretch xl:self-auto">
          {/* Date Picker Dummy */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>10/12/2023</span>
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
          <h2 className="text-lg font-extrabold text-slate-800">Data Kehadiran Guru</h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Subject */}
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#f4f7fc] text-slate-600 rounded-lg text-xs font-semibold border border-slate-100/50">
                <span>{selectedSubjectFilter}</span>
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
                <th className="py-4 px-6">NAMA GURU</th>
                <th className="py-4 px-6">BIDANG MATA PELAJARAN</th>
                <th className="py-4 px-6">WAKTU PRESENSI</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
              {teacherAttendanceList.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-all">
                  
                  {/* Name and NIP with Avatar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                        {row.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{row.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium mt-0.5">{row.nip}</span>
                      </div>
                    </div>
                  </td>

                  {/* Subject field with Icon */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <row.subjectIcon className="w-4 h-4 text-blue-500" />
                      <span>{row.subjectField}</span>
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
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>

                  {/* Action link */}
                  <td className="py-4 px-6 text-center">
                    <Link
                      href="/dashboard/guru/profile"
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
            Menampilkan 3 dari 48 Guru
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
