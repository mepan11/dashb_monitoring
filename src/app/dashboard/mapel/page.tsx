"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Users, Calendar, ArrowRight } from "lucide-react";

interface SubjectClassCard {
  id: string;
  className: string;
  subjectsCount: number;
  syllabusCompleteness: number;
}

export default function MapelPage() {
  const [selectedFilter, setSelectedFilter] = useState("Semua");
  const [classes, setClasses] = useState<SubjectClassCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/classes");
        const json = await res.json();
        if (json.success) {
          setClasses(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

  const filters = ["Semua", "Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"];

  const filteredClasses = classes.filter((card) => {
    if (selectedFilter === "Semua") return true;
    return card.className.startsWith(selectedFilter);
  });

  const totalMapel = classes.reduce((sum, c) => sum + Number(c.subjectsCount), 0);

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
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#2563eb]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">TOTAL DISTRIBUSI MAPEL</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1">
              {loading ? "..." : totalMapel}
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10b981]">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">STATUS MONITORING</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1">Aktif</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">TAHUN AJARAN</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1">2025/2026</span>
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
                  : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-100/50"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold">
            Memuat daftar kelas...
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold">
            Tidak ada kelas ditemukan.
          </div>
        ) : (
          filteredClasses.map((card) => (
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
              <Link href={`/dashboard/mapel/detail?class_id=${card.id}`} className="w-full">
                <span className="w-full py-2.5 px-4 rounded-xl border border-blue-200 text-[#2563eb] hover:bg-blue-50/50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                  Lihat Mata Pelajaran
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
