"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Upload,
  Download,
  Calendar,
  Layers,
  Users,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface StudentGradeRow {
  no: number;
  name: string;
  nisn: string;
  dailyAssignment: number;
  dailyStatus?: "BULK UPDATED" | "REQUIRES ACTION";
  ekskul: number;
  uts: number;
  uas: number;
  average: number;
  status: "Lulus" | "Remedial";
  initials: string;
}

export default function ViewGradesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    {
      title: "Tahun Akademik",
      value: "2023/2024",
      icon: Calendar,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Semester",
      value: "Ganjil (1)",
      icon: Layers,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Siswa",
      value: "32",
      icon: Users,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Di Bawah KKM",
      value: "4",
      icon: AlertTriangle,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  const gradesList: StudentGradeRow[] = [
    {
      no: 1,
      name: "Aditya Pratama",
      nisn: "0123984712",
      dailyAssignment: 85.4,
      dailyStatus: "BULK UPDATED",
      ekskul: 80.0,
      uts: 88.0,
      uas: 92.0,
      average: 86.3,
      status: "Lulus",
      initials: "AP",
    },
    {
      no: 2,
      name: "Bunga Safitri",
      nisn: "0123984713",
      dailyAssignment: 65.0,
      dailyStatus: "REQUIRES ACTION",
      ekskul: 70.0,
      uts: 62.0,
      uas: 68.0,
      average: 66.2,
      status: "Remedial",
      initials: "BS",
    },
    {
      no: 3,
      name: "Candra Kusuma",
      nisn: "0123984714",
      dailyAssignment: 92.1,
      dailyStatus: "BULK UPDATED",
      ekskul: 85.0,
      uts: 90.0,
      uas: 88.0,
      average: 88.7,
      status: "Lulus",
      initials: "CK",
    },
    {
      no: 4,
      name: "Dewi Anggraini",
      nisn: "0123984715",
      dailyAssignment: 78.5,
      dailyStatus: "BULK UPDATED",
      ekskul: 75.0,
      uts: 80.0,
      uas: 82.0,
      average: 78.8,
      status: "Lulus",
      initials: "DA",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Input Nilai: Kelas 4-C</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manajemen nilai terintegrasi dengan dukungan bulk upload Excel.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3 self-stretch xl:self-auto">
          <Button variant="secondary" className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-xl font-bold text-xs bg-white border border-blue-200 text-[#2563eb] hover:bg-blue-50/50 shadow-sm whitespace-nowrap">
            <Upload className="w-4 h-4" />
            Upload Nilai Tugas (Excel)
          </Button>

          <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8] whitespace-nowrap">
            <Download className="w-4 h-4" />
            Download Rekap Nilai
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Main Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
        
        {/* Search Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-slate-800">Daftar Nilai Siswa</h2>

          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari Nama Siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f4f7fc] border border-slate-100/50 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                <th className="py-4 px-6 text-center">No</th>
                <th className="py-4 px-6">Nama Siswa</th>
                <th className="py-4 px-6">NISN</th>
                <th className="py-4 px-6">Tugas Harian</th>
                <th className="py-4 px-6">Ekstrakurikuler</th>
                <th className="py-4 px-6">UTS</th>
                <th className="py-4 px-6">UAS</th>
                <th className="py-4 px-6">Rata-rata</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
              {gradesList.map((row) => (
                <tr key={row.no} className="hover:bg-slate-50/50 transition-all">
                  
                  {/* Number */}
                  <td className="py-4 px-6 text-center text-slate-400">
                    {row.no}
                  </td>

                  {/* Student Name with Avatar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                        {row.initials}
                      </div>
                      <span className="font-bold text-slate-800">{row.name}</span>
                    </div>
                  </td>

                  {/* NISN */}
                  <td className="py-4 px-6 font-medium text-slate-500">
                    {row.nisn}
                  </td>

                  {/* Tugas Harian with badge status */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-800 font-bold">{row.dailyAssignment.toFixed(1)}</span>
                      {row.dailyStatus && (
                        <span
                          className={`text-[8px] font-bold tracking-wider ${
                            row.dailyStatus === "BULK UPDATED"
                              ? "text-blue-500"
                              : "text-rose-500"
                          }`}
                        >
                          {row.dailyStatus}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Ekskul */}
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {row.ekskul.toFixed(1)}
                  </td>

                  {/* UTS */}
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {row.uts.toFixed(1)}
                  </td>

                  {/* UAS */}
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {row.uas.toFixed(1)}
                  </td>

                  {/* Average score */}
                  <td className="py-4 px-6">
                    <span
                      className={`font-extrabold ${
                        row.status === "Lulus" ? "text-blue-600" : "text-rose-600"
                      }`}
                    >
                      {row.average.toFixed(1)}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                        row.status === "Lulus"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-rose-50 text-rose-600 border border-rose-100"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-400">
            Menampilkan 1-4 dari 32 Siswa
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
            <button className="w-8 h-8 rounded-lg hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center">
              3
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
