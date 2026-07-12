"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Download,
  UserPlus,
  Users,
  CheckCircle,
  SlidersHorizontal,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";

interface StudentRow {
  id: string;
  name: string;
  absenNumber: string;
  nisn: string;
  gender: "Laki-laki" | "Perempuan";
  status: "Aktif" | "Non-Aktif";
  initials: string;
}

export default function ClassDetailPage() {
  const [selectedGender, setSelectedGender] = useState("Semua Gender");
  const [selectedStatus, setSelectedStatus] = useState("Status: Aktif");

  const stats = [
    {
      title: "Total Siswa",
      value: 32,
      badge: "+2 Smt Ini",
      badgeType: "success" as const,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Laki-laki",
      value: 14,
      icon: User,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Perempuan",
      value: 18,
      icon: User,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Kehadiran Hari Ini",
      value: "98%",
      icon: CheckCircle,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  const studentsList: StudentRow[] = [
    {
      id: "1",
      name: "Aditya Pratama",
      absenNumber: "Absen #01",
      nisn: "0123456789",
      gender: "Laki-laki",
      status: "Aktif",
      initials: "AP",
    },
    {
      id: "2",
      name: "Bunga Lestari",
      absenNumber: "Absen #02",
      nisn: "0123456790",
      gender: "Perempuan",
      status: "Aktif",
      initials: "BL",
    },
    {
      id: "3",
      name: "Candra Wijaya",
      absenNumber: "Absen #03",
      nisn: "0123456791",
      gender: "Laki-laki",
      status: "Aktif",
      initials: "CW",
    },
    {
      id: "4",
      name: "Dinda Kirana",
      absenNumber: "Absen #04",
      nisn: "0123456792",
      gender: "Perempuan",
      status: "Aktif",
      initials: "DK",
    },
    {
      id: "5",
      name: "Eka Saputra",
      absenNumber: "Absen #05",
      nisn: "0123456793",
      gender: "Laki-laki",
      status: "Aktif",
      initials: "ES",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Kelas 4-C</h1>
          <p className="text-sm text-slate-400 mt-1">
            Wali Kelas: Ibu Sarah Wijaya, S.Pd.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3 self-stretch xl:self-auto">
          <Button variant="secondary" className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm">
            <Download className="w-4 h-4 text-slate-400" />
            Export Data
          </Button>
          <Link href="/dashboard/siswa/tambah">
            <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
              <UserPlus className="w-4 h-4" />
              Tambah Siswa
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            badge={stat.hasOwnProperty("badge") ? (stat as any).badge : undefined}
            badgeType={stat.hasOwnProperty("badgeType") ? (stat as any).badgeType : undefined}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Main Table Container: Daftar Siswa */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
        
        {/* Table Filter Controls Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-slate-800">Daftar Siswa</h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Gender */}
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#f4f7fc] text-slate-600 rounded-lg text-xs font-semibold border border-slate-100/50">
                <span>{selectedGender}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Filter Status */}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#f4f7fc] text-slate-600 rounded-lg text-xs font-semibold border border-slate-100/50">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedStatus}</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                <th className="py-4 px-6">PHOTO</th>
                <th className="py-4 px-6">NAMA LENGKAP</th>
                <th className="py-4 px-6">NISN</th>
                <th className="py-4 px-6">GENDER</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {studentsList.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-all">
                  
                  {/* Photo avatar */}
                  <td className="py-4 px-6">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                      {student.initials}
                    </div>
                  </td>

                  {/* Nama Lengkap & Absen */}
                  <td className="py-4 px-6 font-bold text-slate-800">
                    <div className="flex flex-col">
                      <span>{student.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{student.absenNumber}</span>
                    </div>
                  </td>

                  {/* NISN */}
                  <td className="py-4 px-6 font-medium text-slate-500">
                    {student.nisn}
                  </td>

                  {/* Gender badge */}
                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-md ${
                        student.gender === "Laki-laki"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}
                    >
                      {student.gender}
                    </span>
                  </td>

                  {/* Status dot */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-[10px] font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {student.status}
                    </span>
                  </td>

                  {/* Action 3-dots */}
                  <td className="py-4 px-6 text-center">
                    <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-400">
            Showing 5 of 32 students
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
            <span className="text-xs text-slate-400 px-1">...</span>
            <button className="w-8 h-8 rounded-lg hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center">
              7
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
