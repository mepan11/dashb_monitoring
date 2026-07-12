"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Users, Calendar, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SubjectClassCard {
  id: string;
  className: string;
  subjectsCount: number;
  syllabusCompleteness: number;
}

export default function MapelPage() {
  const [selectedFilter, setSelectedFilter] = useState("Semua");

  const filters = ["Semua", "Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"];

  const cardsData: SubjectClassCard[] = [
    { id: "1", className: "Kelas 1-A", subjectsCount: 10, syllabusCompleteness: 85 },
    { id: "2", className: "Kelas 1-B", subjectsCount: 10, syllabusCompleteness: 85 },
    { id: "3", className: "Kelas 2-A", subjectsCount: 11, syllabusCompleteness: 85 },
    { id: "4", className: "Kelas 2-B", subjectsCount: 11, syllabusCompleteness: 85 },
    { id: "5", className: "Kelas 3-A", subjectsCount: 12, syllabusCompleteness: 85 },
    { id: "6", className: "Kelas 3-B", subjectsCount: 12, syllabusCompleteness: 85 },
    { id: "7", className: "Kelas 4-A", subjectsCount: 13, syllabusCompleteness: 85 },
    { id: "8", className: "Kelas 4-B", subjectsCount: 13, syllabusCompleteness: 85 },
    { id: "9", className: "Kelas 5-A", subjectsCount: 14, syllabusCompleteness: 85 },
    { id: "10", className: "Kelas 5-B", subjectsCount: 14, syllabusCompleteness: 85 },
    { id: "11", className: "Kelas 6-A", subjectsCount: 14, syllabusCompleteness: 85 },
    { id: "12", className: "Kelas 6-B", subjectsCount: 14, syllabusCompleteness: 85 },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb & Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <span>Mata Pelajaran</span>
            <span>&gt;</span>
            <span className="text-[#2563eb]">Daftar Kelas</span>
          </div>
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Mata Pelajaran per Kelas</h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola dan lihat kurikulum mata pelajaran untuk setiap tingkat kelas.
          </p>
        </div>

        {/* Add Subject Button */}
        <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
          <Plus className="w-4 h-4" />
          Tambah Mata Pelajaran
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#2563eb]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">TOTAL MAPEL</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1">124</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10b981]">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">TOTAL GURU</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1">42</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">TAHUN AJARAN</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1">2023/2024</span>
          </div>
        </div>
      </div>

      {/* Class Pills Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = selectedFilter === f;
          return (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "bg-white border border-slate-100 text-slate-505 hover:bg-slate-100/50"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cardsData.map((card) => (
          <div
            key={card.id}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center text-center gap-5"
          >
            {/* Round Icon */}
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#2563eb] border border-blue-100/50 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>

            {/* Class Title & Subjects count */}
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-slate-800">{card.className}</span>
              <span className="text-xs text-slate-400 font-bold mt-1">
                {card.subjectsCount} Mata Pelajaran
              </span>
            </div>

            {/* Progress Completeness */}
            <div className="w-full flex flex-col gap-1.5 text-left">
              <div className="flex justify-between text-[10px] font-extrabold text-slate-400">
                <span>KELENGKAPAN SILABUS:</span>
                <span>{card.syllabusCompleteness}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  style={{ width: `${card.syllabusCompleteness}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                ></div>
              </div>
            </div>

            {/* Detail Button */}
            <Link href="/dashboard/mapel/detail" className="w-full">
              <button className="w-full py-2.5 px-4 rounded-xl border border-blue-200 text-[#2563eb] hover:bg-blue-50/50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                Lihat Mata Pelajaran
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
