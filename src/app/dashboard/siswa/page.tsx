"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Student {
  id: string;
  name: string;
  genderText: string;
  nisn: string;
  classLabel: string;
  genderCode: "L" | "P";
  status: "Aktif" | "Nonaktif";
  initials: string;
}

export default function SiswaPage() {
  const [selectedClassFilter, setSelectedClassFilter] = useState("Semua");

  const classFilters = [
    "Semua",
    "Kelas 1",
    "Kelas 2",
    "Kelas 3",
    "Kelas 4",
    "Kelas 5",
    "Kelas 6",
  ];

  const students: Student[] = [
    {
      id: "1",
      name: "Andi Wijaya",
      genderText: "Laki-laki",
      nisn: "0012938475",
      classLabel: "4-A",
      genderCode: "L",
      status: "Aktif",
      initials: "AW",
    },
    {
      id: "2",
      name: "Siti Aminah",
      genderText: "Perempuan",
      nisn: "0012938482",
      classLabel: "4-A",
      genderCode: "P",
      status: "Aktif",
      initials: "SA",
    },
    {
      id: "3",
      name: "Budi Santoso",
      genderText: "Laki-laki",
      nisn: "0012938491",
      classLabel: "4-B",
      genderCode: "L",
      status: "Aktif",
      initials: "BS",
    },
    {
      id: "4",
      name: "Dewi Lestari",
      genderText: "Perempuan",
      nisn: "0012938499",
      classLabel: "4-C",
      genderCode: "P",
      status: "Aktif",
      initials: "DL",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Daftar Siswa</h1>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mt-2">
            <span>Manajemen Data</span>
            <span>&gt;</span>
            <span className="text-[#2563eb]">Siswa</span>
          </div>
        </div>

        {/* Add Student Button */}
        <Link href="/dashboard/siswa/tambah">
          <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
            <UserPlus className="w-4 h-4" />
            Tambah Siswa
          </Button>
        </Link>
      </div>

      {/* Top Filter & Card Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Left Filter Kelas Card */}
        <div className="flex-1 bg-white border border-slate-100/80 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between gap-5">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-700">Filter Kelas</h2>
            <button
              onClick={() => setSelectedClassFilter("Semua")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Reset
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {classFilters.map((cls) => {
              const isActive = selectedClassFilter === cls;
              return (
                <button
                  key={cls}
                  onClick={() => setSelectedClassFilter(cls)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-[#f4f7fc] text-slate-500 hover:bg-slate-200/50"
                  }`}
                >
                  {cls}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Blue KPI Card */}
        <div className="w-full lg:w-[320px] bg-[#2563eb] rounded-2xl p-6 shadow-[0_8px_30px_rgb(37,99,235,0.15)] flex justify-between items-center text-white shrink-0 relative overflow-hidden">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-blue-100">
              Total Siswa Aktif
            </span>
            <span className="text-3xl font-extrabold tracking-tight">
              1,248
            </span>
          </div>
          
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/5 shadow-inner">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>

      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
        
        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#fafbfc] text-xs font-extrabold text-slate-500 tracking-wider">
                <th className="py-4.5 px-6">Siswa</th>
                <th className="py-4.5 px-6">NISN</th>
                <th className="py-4.5 px-6">Kelas</th>
                <th className="py-4.5 px-6">Gender</th>
                <th className="py-4.5 px-6">Status</th>
                <th className="py-4.5 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-all">
                  
                  {/* Name and Gender text */}
                  <td className="py-4 px-6 flex items-center gap-3">
                    {/* Initials Avatar */}
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                      {student.initials}
                    </div>
                    <div className="flex flex-col">
                      <Link href="/dashboard/siswa/profile" className="font-bold text-slate-800 hover:text-[#2563eb] transition-all">
                        {student.name}
                      </Link>
                      <span className="text-[10px] text-slate-400 mt-0.5">{student.genderText}</span>
                    </div>
                  </td>

                  {/* NISN */}
                  <td className="py-4 px-6 font-semibold text-slate-600">
                    {student.nisn}
                  </td>

                  {/* Kelas Badge */}
                  <td className="py-4 px-6">
                    <span className="text-[10px] font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                      {student.classLabel}
                    </span>
                  </td>

                  {/* Gender Code */}
                  <td className="py-4 px-6 font-medium text-slate-500">
                    {student.genderCode}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-[10px] font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {student.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link href="/dashboard/siswa/profile" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-all">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href="/dashboard/siswa/edit" className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-all">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-400">
            Showing 1 - 4 of 1,248 students
          </span>
          
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400">
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
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
              312
            </button>

            <button className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
