"use client";

import React, { useState } from "react";
import {
  Plus,
  ArrowRight,
  TrendingUp,
  Calendar,
  ExternalLink,
  Cpu,
  Dumbbell,
  Palette,
  Activity,
  Smile,
} from "lucide-react";

interface ProgramItem {
  id: string;
  title: string;
  coach: string;
  category: "Sains" | "Olahraga" | "Seni";
  categoryType: string;
  studentsCount: number;
  capacity: number;
  completenessText: string;
  completenessType: "normal" | "full" | "almost-full";
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

export default function EkstrakurikulerPage() {
  const [selectedFilter, setSelectedFilter] = useState("Semua");

  const filters = ["Semua", "Olahraga", "Seni & Sains"];

  const programsData: ProgramItem[] = [
    {
      id: "1",
      title: "Robotik",
      coach: "Mr. Budi Santoso",
      category: "Sains",
      categoryType: "sains",
      studentsCount: 17,
      capacity: 20,
      completenessText: "85% Terisi",
      completenessType: "normal",
      icon: Cpu,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "2",
      title: "Sepak Bola",
      coach: "Coach Andi Wijaya",
      category: "Olahraga",
      categoryType: "olahraga",
      studentsCount: 30,
      capacity: 30,
      completenessText: "Penuh",
      completenessType: "full",
      icon: Dumbbell,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: "3",
      title: "Basket",
      coach: "Ms. Sarah Kim",
      category: "Olahraga",
      categoryType: "olahraga",
      studentsCount: 12,
      capacity: 20,
      completenessText: "60% Terisi",
      completenessType: "normal",
      icon: Activity,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      id: "4",
      title: "Seni Lukis",
      coach: "Ibu Ratna Kartika",
      category: "Seni",
      categoryType: "seni",
      studentsCount: 6,
      capacity: 15,
      completenessText: "40% Terisi",
      completenessType: "normal",
      icon: Palette,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      id: "5",
      title: "Tari Tradisional",
      coach: "Ibu Shinta Dewi",
      category: "Seni",
      categoryType: "seni",
      studentsCount: 23,
      capacity: 25,
      completenessText: "Hampir Penuh",
      completenessType: "almost-full",
      icon: Smile,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ];

  const getCategoryBadgeStyles = (cat: string) => {
    switch (cat) {
      case "Sains":
        return "bg-emerald-50 text-emerald-600";
      case "Olahraga":
        return "bg-blue-50 text-blue-600";
      case "Seni":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Katalog Ekstrakurikuler</h1>
          <p className="text-sm text-slate-400 mt-1">
            Temukan dan kelola program minat bakat siswa Lumina Academy untuk periode akademik 2023/2024.
          </p>
        </div>

        {/* Filter Tabs top right */}
        <div className="flex bg-[#f4f7fc] border border-slate-100/50 p-1.5 rounded-xl gap-1.5 shrink-0 self-stretch md:self-auto">
          {filters.map((f) => {
            const isActive = selectedFilter === f;
            return (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programsData.map((prog) => {
          const ProgramIcon = prog.icon;
          const progressPercentage = (prog.studentsCount / prog.capacity) * 100;

          return (
            <div
              key={prog.id}
              className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between gap-6"
            >
              {/* Card Top: Icon & Category */}
              <div className="flex justify-between items-center">
                <div className={`p-3 rounded-xl ${prog.iconBg} ${prog.iconColor} border border-slate-100/30 shadow-sm`}>
                  <ProgramIcon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md ${getCategoryBadgeStyles(prog.category)}`}>
                  {prog.category}
                </span>
              </div>

              {/* Title & Coach */}
              <div className="flex flex-col">
                <h2 className="text-lg font-extrabold text-slate-800">{prog.title}</h2>
                <span className="text-xs font-medium text-slate-400 mt-1">
                  Coach: {prog.coach}
                </span>
              </div>

              {/* Progress bar and quota label */}
              <div className="flex flex-col gap-2">
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div style={{ width: `${progressPercentage}%` }} className="h-full bg-emerald-500 rounded-full"></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-extrabold">
                  <span className="text-slate-400">Kuota: {prog.studentsCount}/{prog.capacity} Siswa</span>
                  {prog.completenessType === "full" ? (
                    <span className="text-rose-500">{prog.completenessText}</span>
                  ) : prog.completenessType === "almost-full" ? (
                    <span className="text-amber-500">{prog.completenessText}</span>
                  ) : (
                    <span className="text-slate-400">{prog.completenessText}</span>
                  )}
                </div>
              </div>

              {/* Detail button */}
              <button className="w-full py-2.5 px-4 rounded-xl border border-blue-200 text-[#2563eb] hover:bg-blue-50/50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                Lihat Detail
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {/* Add Program Dotted Card */}
        <div className="bg-[#f4f7fc]/50 border-2 border-dashed border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:bg-slate-100/30 transition-all min-h-[220px]">
          <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563eb] shadow-sm">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-slate-700">Tambah Program</span>
            <span className="text-xs text-slate-400 font-medium mt-1">Buat kurikulum ekstrakurikuler baru</span>
          </div>
        </div>
      </div>

      {/* Bottom section summary cards (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Card 1: Total Partisipasi (Solid blue) */}
        <div className="bg-[#0284c7] rounded-2xl p-6 text-white shadow-[0_8px_30px_rgb(2,132,199,0.15)] flex flex-col justify-between gap-5 relative overflow-hidden">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-sky-100">Total Partisipasi</span>
            <span className="text-3xl font-extrabold">428 Siswa</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-sky-100">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% dari semester lalu</span>
          </div>
        </div>

        {/* Card 2: Program Terpopuler (Light blue) */}
        <div className="bg-sky-50 border border-sky-100/50 rounded-2xl p-6 flex flex-col justify-between gap-5 shadow-[0_4px_20px_rgb(0,0,0,0.01)]">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400">Program Terpopuler</span>
            <span className="text-3xl font-extrabold text-slate-800">Sepak Bola</span>
          </div>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Konsisten memiliki antrean pendaftar terbanyak.
          </p>
        </div>

        {/* Card 3: Jadwal Terdekat (White) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between gap-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/30 shadow-sm shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">Jadwal Terdekat</span>
              <span className="text-sm font-extrabold text-slate-800 mt-1">Latihan Robotik - 14:00</span>
            </div>
          </div>
          <a href="#" className="text-xs font-extrabold text-[#2563eb] hover:text-blue-700 flex items-center gap-1">
            Lihat semua jadwal
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
}
