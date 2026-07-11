"use client";

import React from "react";
import { SlidersHorizontal, TrendingUp, Award, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface GradeClassItem {
  id: string;
  classCode: string;
  className: string;
  characterName: string;
  averageScore: number;
  homeroomTeacher: string;
  teacherInitials: string;
  studentsCount: number;
}

export default function NilaiPage() {
  const classesData: GradeClassItem[] = [
    {
      id: "1",
      classCode: "1A",
      className: "Kelas 1",
      characterName: "Abu Bakar",
      averageScore: 88.5,
      homeroomTeacher: "Sarah Wijaya, M.Pd",
      teacherInitials: "SW",
      studentsCount: 28,
    },
    {
      id: "2",
      classCode: "1B",
      className: "Kelas 1",
      characterName: "Umar Bin Khattab",
      averageScore: 86.2,
      homeroomTeacher: "Budi Santoso, S.Pd",
      teacherInitials: "BS",
      studentsCount: 30,
    },
    {
      id: "3",
      classCode: "2A",
      className: "Kelas 2",
      characterName: "Utsman Bin Affan",
      averageScore: 84.9,
      homeroomTeacher: "Anita Sari, S.Pd",
      teacherInitials: "AS",
      studentsCount: 26,
    },
    {
      id: "4",
      classCode: "2B",
      className: "Kelas 2",
      characterName: "Ali Bin Abi Thalib",
      averageScore: 82.1,
      homeroomTeacher: "Ahmad Rifai, M.T",
      teacherInitials: "AR",
      studentsCount: 29,
    },
    {
      id: "5",
      classCode: "3A",
      className: "Kelas 3",
      characterName: "Khalid Bin Walid",
      averageScore: 89.0,
      homeroomTeacher: "Maria Ulfa, S.Ag",
      teacherInitials: "MU",
      studentsCount: 32,
    },
    {
      id: "6",
      classCode: "3B",
      className: "Kelas 3",
      characterName: "Hamzah Bin Abdul M.",
      averageScore: 85.4,
      homeroomTeacher: "Rizky Pratama, S.Kom",
      teacherInitials: "RP",
      studentsCount: 31,
    },
    {
      id: "7",
      classCode: "4A",
      className: "Kelas 4",
      characterName: "Bilal Bin Rabbah",
      averageScore: 87.1,
      homeroomTeacher: "Siti Aminah, M.Pd",
      teacherInitials: "SA",
      studentsCount: 30,
    },
    {
      id: "8",
      classCode: "4B",
      className: "Kelas 4",
      characterName: "Sa'ad Bin Abi Waqqash",
      averageScore: 83.8,
      homeroomTeacher: "Hendra Gunawan, S.Pd",
      teacherInitials: "HG",
      studentsCount: 27,
    },
    {
      id: "9",
      classCode: "5A",
      className: "Kelas 5",
      characterName: "Zaid Bin Tsabit",
      averageScore: 90.2,
      homeroomTeacher: "Laila Fitri, M.Ed",
      teacherInitials: "LF",
      studentsCount: 25,
    },
    {
      id: "10",
      classCode: "5B",
      className: "Kelas 5",
      characterName: "Thariq Bin Ziyad",
      averageScore: 86.7,
      homeroomTeacher: "Farhan Kamil, S.T",
      teacherInitials: "FK",
      studentsCount: 28,
    },
    {
      id: "11",
      classCode: "6A",
      className: "Kelas 6",
      characterName: "Shalahuddin Al-A.",
      averageScore: 91.5,
      homeroomTeacher: "Dra. Hj. Rahayu",
      teacherInitials: "DR",
      studentsCount: 24,
    },
    {
      id: "12",
      classCode: "6B",
      className: "Kelas 6",
      characterName: "Muhammad Al-Fatih",
      averageScore: 88.9,
      homeroomTeacher: "Irwan Syahputra, S.Pd",
      teacherInitials: "IS",
      studentsCount: 26,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <span>Manajemen Nilai</span>
            <span>&gt;</span>
            <span className="text-[#2563eb]">Pilih Kelas</span>
          </div>
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Manajemen Nilai: Pilih Kelas</h1>
          <p className="text-sm text-slate-400 mt-1">
            Pilih kelas untuk mengelola nilai siswa secara detail. Pantau perkembangan akademik harian secara efisien.
          </p>
        </div>

        {/* Filter Tahun Ajaran Button */}
        <Button variant="secondary" className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-xl font-bold text-xs bg-blue-50 border-none text-[#2563eb] hover:bg-blue-100/70">
          <SlidersHorizontal className="w-4 h-4" />
          Filter Tahun Ajaran
        </Button>
      </div>

      {/* Grid of Class Grade Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {classesData.map((cls) => (
          <div
            key={cls.id}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6"
          >
            {/* Top row: Code badge & Average */}
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2563eb] font-extrabold text-xs flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                {cls.classCode}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-extrabold text-slate-400 tracking-wider">AVERAGE</span>
                <span className="text-base font-extrabold text-emerald-600 mt-0.5">
                  {cls.averageScore}
                </span>
              </div>
            </div>

            {/* Title & Homeroom teacher */}
            <div className="flex flex-col gap-2.5">
              <h2 className="text-sm font-extrabold text-slate-700">
                {cls.className} – {cls.characterName}
              </h2>
              
              <div className="flex items-center gap-2">
                {/* Initials Avatar */}
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-[9px] flex items-center justify-center border border-slate-200 shrink-0">
                  {cls.teacherInitials}
                </div>
                <span className="text-[10px] font-medium text-slate-400 leading-tight">
                  Wali: {cls.homeroomTeacher}
                </span>
              </div>
            </div>

            {/* Footer row: Students count & Button */}
            <div className="flex justify-between items-center border-t border-slate-100/80 pt-4 mt-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-extrabold text-slate-400 tracking-wider">STUDENTS</span>
                <span className="text-xs font-bold text-slate-600 mt-0.5">
                  {cls.studentsCount} Siswa
                </span>
              </div>

              <button className="py-2 px-4 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-[10px] shadow-sm transition-all">
                Lihat Nilai
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Bottom Card: Statistik Akademik Sekolah */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_4px_25px_rgb(0,0,0,0.02)] border-t-[3px] border-t-amber-500 flex flex-col lg:flex-row gap-8 items-center justify-between">
        
        {/* Left Side Info */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Statistik Akademik Sekolah</h2>
            <p className="text-xs text-slate-400 mt-1">Analisis performa rata-rata seluruh kelas pada semester ini.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Box 1 */}
            <div className="bg-[#f4f7fc] p-5 rounded-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[9px] font-extrabold tracking-wider uppercase">Rata-rata Sekolah</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl font-extrabold text-[#2563eb]">87.2</span>
              <span className="text-[10px] font-bold text-emerald-600">+2.4% vs Smt Lalu</span>
            </div>

            {/* Box 2 */}
            <div className="bg-[#f4f7fc] p-5 rounded-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[9px] font-extrabold tracking-wider uppercase">Kenaikan Tertinggi</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-2xl font-extrabold text-slate-800">Kelas 5A</span>
              <span className="text-[10px] text-slate-400 font-semibold">Zaid Bin Tsabit</span>
            </div>

            {/* Box 3 */}
            <div className="bg-[#f4f7fc] p-5 rounded-2xl flex flex-col justify-between gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[9px] font-extrabold tracking-wider uppercase">Total Input Nilai</span>
                <CheckSquare className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-2xl font-extrabold text-slate-800">94%</span>
              
              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div style={{ width: "94%" }} className="h-full bg-amber-500 rounded-full"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side SVG Graphic Vector */}
        <div className="w-full lg:w-[260px] h-[160px] bg-[#f4f7fc] rounded-2xl flex items-center justify-center shrink-0 border border-slate-100/50 p-6">
          <svg className="w-full h-full text-blue-600" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="25" width="8" height="30" rx="4" fill="#2563eb" />
            <rect x="25" y="10" width="8" height="45" rx="4" fill="#2563eb" />
            <rect x="40" y="30" width="8" height="25" rx="4" fill="#2563eb" opacity="0.6" />
            <rect x="55" y="5" width="8" height="50" rx="4" fill="#2563eb" />
            <rect x="70" y="20" width="8" height="35" rx="4" fill="#2563eb" opacity="0.4" />
            <rect x="85" y="15" width="8" height="40" rx="4" fill="#2563eb" />
          </svg>
        </div>

      </div>

    </div>
  );
}
