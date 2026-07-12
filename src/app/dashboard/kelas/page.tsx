"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  LineChart,
  Plus,
  Download,
  Printer,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ClassItem {
  id: string;
  name: string;
  homeroomTeacher: string;
  teacherInitials: string;
  studentsCount: number;
  capacity: number;
  status: "AKTIF" | "PENUH";
}

export default function KelasPage() {
  const [selectedGradeFilter, setSelectedGradeFilter] = useState("All Classes");

  const gradeFilters = [
    "All Classes",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
  ];

  const classesData: ClassItem[] = [
    {
      id: "1",
      name: "Kelas 1-A",
      homeroomTeacher: "Subandi, S.Pd.",
      teacherInitials: "SS",
      studentsCount: 28,
      capacity: 30,
      status: "AKTIF",
    },
    {
      id: "2",
      name: "Kelas 1-B",
      homeroomTeacher: "Bpk. Ahmad Fauzi",
      teacherInitials: "AF",
      studentsCount: 28,
      capacity: 30,
      status: "AKTIF",
    },
    {
      id: "3",
      name: "Kelas 2-A",
      homeroomTeacher: "Ibu Siti Aminah",
      teacherInitials: "SA",
      studentsCount: 28,
      capacity: 30,
      status: "AKTIF",
    },
    {
      id: "4",
      name: "Kelas 2-B",
      homeroomTeacher: "Ibu Dini Aminarti",
      teacherInitials: "DA",
      studentsCount: 28,
      capacity: 30,
      status: "AKTIF",
    },
    {
      id: "5",
      name: "Kelas 3-A",
      homeroomTeacher: "Bpk. Eko Prasetyo",
      teacherInitials: "EP",
      studentsCount: 28,
      capacity: 30,
      status: "AKTIF",
    },
    {
      id: "6",
      name: "Kelas 3-B",
      homeroomTeacher: "Ibu Farida Utami",
      teacherInitials: "FU",
      studentsCount: 30,
      capacity: 30,
      status: "PENUH",
    },
    {
      id: "7",
      name: "Kelas 4-A",
      homeroomTeacher: "Subandi, S.Pd.",
      teacherInitials: "SS",
      studentsCount: 28,
      capacity: 30,
      status: "AKTIF",
    },
    {
      id: "8",
      name: "Kelas 4-B",
      homeroomTeacher: "Ibu Hana Pertiwi",
      teacherInitials: "HP",
      studentsCount: 28,
      capacity: 30,
      status: "AKTIF",
    },
    {
      id: "9",
      name: "Kelas 5-A",
      homeroomTeacher: "Bpk. Slamet",
      teacherInitials: "BS",
      studentsCount: 28,
      capacity: 30,
      status: "AKTIF",
    },
    {
      id: "10",
      name: "Kelas 5-B",
      homeroomTeacher: "Ibu Ratna",
      teacherInitials: "IR",
      studentsCount: 27,
      capacity: 30,
      status: "AKTIF",
    },
    {
      id: "11",
      name: "Kelas 6-A",
      homeroomTeacher: "Bpk. Wahyu",
      teacherInitials: "BW",
      studentsCount: 29,
      capacity: 30,
      status: "AKTIF",
    },
    {
      id: "12",
      name: "Kelas 6-B",
      homeroomTeacher: "Ibu Maya",
      teacherInitials: "IM",
      studentsCount: 30,
      capacity: 30,
      status: "PENUH",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Manajemen Kelas</h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola dan pantau aktivitas seluruh jenjang kelas di SD Maju Jaya.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
            <Plus className="w-4 h-4" />
            Tambah Kelas Baru
          </Button>

          <Button variant="secondary" className="!w-auto !py-2.5 !px-4 flex items-center gap-2 rounded-lg font-bold text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
            <Download className="w-4 h-4 text-slate-400" />
            Ekspor CSV
          </Button>

          <Button variant="secondary" className="!w-auto !py-2.5 !px-4 flex items-center gap-2 rounded-lg font-bold text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
            <Printer className="w-4 h-4 text-slate-400" />
            Cetak PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border-l-4 border-l-[#2563eb] flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#2563eb]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">TOTAL KELAS</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1">13</span>
            <span className="text-[10px] text-slate-400 mt-0.5">aktif di sekolah</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border-l-4 border-l-[#10b981] flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10b981]">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">TOTAL SISWA TERDAFTAR</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1">370</span>
            <span className="text-[10px] text-slate-400 mt-0.5">siswa aktif</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border-l-4 border-l-[#8b5cf6] flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-[#8b5cf6]">
            <LineChart className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">RATA-RATA SISWA / KELAS</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1">28</span>
            <span className="text-[10px] text-amber-500 font-bold mt-0.5">kapasitas ideal 30</span>
          </div>
        </div>
      </div>

      {/* Filter Grade bar */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold text-slate-400">Filter Tingkat:</span>
        <div className="flex flex-wrap gap-2">
          {gradeFilters.map((grade) => {
            const isActive = selectedGradeFilter === grade;
            return (
              <button
                key={grade}
                onClick={() => setSelectedGradeFilter(grade)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-100/50"
                }`}
              >
                {grade}
              </button>
            );
          })}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classesData.map((cls) => {
          const isFull = cls.status === "PENUH";
          const progressPercentage = (cls.studentsCount / cls.capacity) * 100;
          
          return (
            <div
              key={cls.id}
              className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between gap-6"
            >
              {/* Card Top */}
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-700 text-base">{cls.name}</span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                    isFull
                      ? "bg-orange-50 text-orange-500"
                      : "bg-emerald-50 text-emerald-500"
                  }`}
                >
                  {cls.status}
                </span>
              </div>

              {/* Homeroom teacher */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {cls.teacherInitials}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WALI KELAS</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5">{cls.homeroomTeacher}</span>
                </div>
              </div>

              {/* Progress bar info */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>{cls.studentsCount} Siswa</span>
                  <span>{cls.studentsCount}/{cls.capacity} Kapasitas</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    style={{ width: `${progressPercentage}%` }}
                    className={`h-full rounded-full transition-all ${
                      isFull ? "bg-orange-500" : "bg-[#2563eb]"
                    }`}
                  ></div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-between items-center border-t border-slate-100/80 pt-4 mt-2">
                <Link href="/dashboard/kelas/detail">
                  <button className="text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50 transition-all">
                    Detail Kelas
                  </button>
                </Link>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg border border-slate-100 transition-all">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg border border-slate-100 transition-all">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
