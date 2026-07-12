"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface GradeClassCard {
  id: string;
  classCode: string;
  className: string;
  homeroomTeacher: string;
  teacherInitials: string;
  studentsCount: number;
}

export default function NilaiPage() {
  const classesData: GradeClassCard[] = [
    { id: "1", classCode: "1A", className: "Kelas 1 A", homeroomTeacher: "Sarah Wijaya, M.Pd", teacherInitials: "SW", studentsCount: 28 },
    { id: "2", classCode: "1B", className: "Kelas 1 B", homeroomTeacher: "Budi Santoso, S.Pd", teacherInitials: "BS", studentsCount: 30 },
    { id: "3", classCode: "2A", className: "Kelas 2 A", homeroomTeacher: "Anita Sari, S.Pd", teacherInitials: "AS", studentsCount: 26 },
    { id: "4", classCode: "2B", className: "Kelas 2 B", homeroomTeacher: "Ahmad Rifai, M.T", teacherInitials: "AR", studentsCount: 29 },
    { id: "5", classCode: "3A", className: "Kelas 3 A", homeroomTeacher: "Maria Ulfa, S.Ag", teacherInitials: "MU", studentsCount: 32 },
    { id: "6", classCode: "3B", className: "Kelas 3", homeroomTeacher: "Rizky Pratama, S.Kom", teacherInitials: "RP", studentsCount: 31 },
    { id: "7", classCode: "4A", className: "Kelas 4A", homeroomTeacher: "Siti Aminah, M.Pd", teacherInitials: "SA", studentsCount: 30 },
    { id: "8", classCode: "4B", className: "Kelas 4B", homeroomTeacher: "Hendra Gunawan, S.Pd", teacherInitials: "HG", studentsCount: 27 },
    { id: "9", classCode: "5A", className: "Kelas 5A", homeroomTeacher: "Laila Fitri, M.Ed", teacherInitials: "LF", studentsCount: 25 },
    { id: "10", classCode: "5B", className: "Kelas 5B", homeroomTeacher: "Farhan Kamil, S.T", teacherInitials: "FK", studentsCount: 28 },
    { id: "11", classCode: "6A", className: "Kelas 6A", homeroomTeacher: "Dra. Hj. Rahayu", teacherInitials: "DR", studentsCount: 24 },
    { id: "12", classCode: "6B", className: "Kelas 6B", homeroomTeacher: "Irwan Syahputra, S.Pd", teacherInitials: "IS", studentsCount: 26 },
  ];

  return (
    <div className="flex flex-col gap-8">

      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Manajemen Nilai: Pilih Kelas</h1>
          <p className="text-sm text-slate-400 mt-1">
            Pilih kelas untuk mengelola nilai siswa secara detail. Pantau perkembangan akademik harian secara efisien.
          </p>
        </div>

        {/* Action Button */}
        <div className="self-stretch xl:self-auto">
          <Button variant="secondary" className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-xl font-bold text-xs bg-blue-50 border-none text-[#2563eb] hover:bg-blue-100/70 shadow-sm">
            <SlidersHorizontal className="w-4 h-4" />
            Filter Tahun Ajaran
          </Button>
        </div>
      </div>

      {/* Grid of Class Grade Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {classesData.map((cls) => (
          <div
            key={cls.id}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_25px_rgb(0,0,0,0.01)] flex flex-col gap-6 justify-between relative overflow-hidden"
          >
            {/* Top row: Code badge & card design element */}
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563eb] font-extrabold text-sm flex items-center justify-center border border-blue-100/50">
                {cls.classCode}
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#2563eb]/5 rounded-bl-full pointer-events-none"></div>
            </div>

            {/* Title & Homeroom teacher */}
            <div className="flex flex-col gap-3">
              <h2 className="text-base font-extrabold text-slate-800">
                {cls.className}
              </h2>

              <div className="flex items-center gap-2.5">
                {/* Initials Avatar */}
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-[9px] flex items-center justify-center border border-slate-200 shrink-0">
                  {cls.teacherInitials}
                </div>
                <span className="text-[10px] font-bold text-slate-400 leading-tight">
                  Wali: {cls.homeroomTeacher}
                </span>
              </div>
            </div>

            {/* Footer row: Students count & Button */}
            <div className="flex justify-between items-center border-t border-slate-100/80 pt-4 mt-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Students</span>
                <span className="text-xs font-extrabold text-slate-700 mt-0.5">
                  {cls.studentsCount} Siswa
                </span>
              </div>

              <Link href={`/dashboard/nilai/lihat`}>
                <button className="py-2.5 px-4 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-[10px] shadow-sm transition-all">
                  Lihat Nilai
                </button>
              </Link>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
