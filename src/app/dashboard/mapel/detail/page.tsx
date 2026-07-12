"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  BookOpen,
  Palette,
  Eye,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";

interface SubjectRow {
  id: string;
  name: string;
  category: "AKADEMIK" | "NON-AKADEMIK";
  teacher: string;
  teacherInitials: string;
  schedule: string;
  progress: number;
}

export default function SubjectDetailPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Urutkan: Nama (A-Z)");

  const stats = [
    {
      title: "Total Mata Pelajaran",
      value: 12,
      icon: BookOpen,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Mata Pelajaran Akademik",
      value: 8,
      icon: GraduationCap,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Non-Akademik / Ekskul",
      value: 4,
      icon: Palette,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  const subjectsList: SubjectRow[] = [
    {
      id: "1",
      name: "Matematika",
      category: "AKADEMIK",
      teacher: "Bpk. Aris Setiawan",
      teacherInitials: "AS",
      schedule: "Senin, 08:00 - 09:30",
      progress: 75,
    },
    {
      id: "2",
      name: "Bahasa Inggris",
      category: "AKADEMIK",
      teacher: "Ibu Sarah Wijaya",
      teacherInitials: "SW",
      schedule: "Selasa, 10:00 - 11:30",
      progress: 40,
    },
    {
      id: "3",
      name: "Seni Budaya",
      category: "NON-AKADEMIK",
      teacher: "Bpk. Danu Pratama",
      teacherInitials: "DP",
      schedule: "Rabu, 13:00 - 14:30",
      progress: 90,
    },
    {
      id: "4",
      name: "Pendidikan Jasmani",
      category: "NON-AKADEMIK",
      teacher: "Coach Hendra",
      teacherInitials: "CH",
      schedule: "Kamis, 07:30 - 09:00",
      progress: 15,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/dashboard" className="hover:text-slate-600">Dashboard</Link>
        <span>&gt;</span>
        <Link href="/dashboard/mapel" className="hover:text-slate-600">Mata Pelajaran</Link>
        <span>&gt;</span>
        <span className="text-[#2563eb]">Daftar Mata Pelajaran (Kelas 4-C)</span>
      </div>

      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Daftar Mata Pelajaran - Kelas 4-C</h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola kurikulum dan pembagian tugas pengajar untuk semester ganjil.
          </p>
        </div>

        {/* Top actions */}
        <div className="self-stretch xl:self-auto">
          <Link href="/dashboard/mapel/tambah">
            <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
              <Plus className="w-4 h-4" />
              Tambah Mata Pelajaran
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
        
        {/* Search & Sort Controls Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari mata pelajaran atau..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f4f7fc] border border-slate-100/50 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#f4f7fc] text-slate-600 rounded-lg text-xs font-semibold border border-slate-100/50">
              <span>{sortOption}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                <th className="py-4 px-6">Mata Pelajaran</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6">Guru Pengajar</th>
                <th className="py-4 px-6">Jadwal</th>
                <th className="py-4 px-6">Progres Silabus</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
              {subjectsList.map((subject) => (
                <tr key={subject.id} className="hover:bg-slate-50/50 transition-all">
                  
                  {/* Subject Name and Icon */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-800">{subject.name}</span>
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="py-4 px-6">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                        subject.category === "AKADEMIK"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}
                    >
                      {subject.category}
                    </span>
                  </td>

                  {/* Guru Pengajar with Avatar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px] shadow-sm shrink-0 border border-slate-200">
                        {subject.teacherInitials}
                      </div>
                      <span className="text-slate-700 font-bold">{subject.teacher}</span>
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="py-4 px-6 text-slate-500 font-medium">
                    {subject.schedule}
                  </td>

                  {/* Progress Silabus */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1.5 max-w-[120px]">
                      <span className="text-[10px] font-bold text-emerald-600">{subject.progress}%</span>
                      <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                        <div style={{ width: `${subject.progress}%` }} className="h-full bg-emerald-600 rounded-full"></div>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2.5">
                      <button className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link href="/dashboard/mapel/edit" className="p-1 text-amber-600 hover:bg-amber-50 rounded transition-all">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button className="p-1 text-red-500 hover:bg-red-50 rounded transition-all">
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
            Menampilkan 4 dari 12 mata pelajaran
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
