"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle,
  BookOpen,
  Palette,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";

interface Teacher {
  id: string;
  name: string;
  email: string;
  nip: string;
  specialization: "Akademik" | "Non-Akademik";
  subjects: string;
  classes: string;
  status: "Aktif" | "Nonaktif";
  avatarUrl?: string;
  initials: string;
}

export default function GuruPage() {
  const [selectedJenjang, setSelectedJenjang] = useState("Semua Jenjang");
  const [selectedMapel, setSelectedMapel] = useState("Semua Mata Pelajaran");
  const [selectedStatus, setSelectedStatus] = useState("Status: Aktif");

  // KPI Data
  const stats = [
    {
      title: "Total Guru",
      value: 42,
      badge: "+4 MoM",
      badgeType: "success" as const,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Aktif",
      value: 38,
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Akademik",
      value: 30,
      icon: BookOpen,
      iconBg: "bg-amber-50/70",
      iconColor: "text-amber-600",
    },
    {
      title: "Non-Akademik",
      value: 12,
      icon: Palette,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
    },
  ];

  // Dummy Teachers Data
  const teachers: Teacher[] = [
    {
      id: "1",
      name: "Budi Santoso, S.Pd.",
      email: "budi.santoso@lumina.sch.id",
      nip: "198501012010011002",
      specialization: "Akademik",
      subjects: "Matematika, IPA",
      classes: "4A, 4B, 4C",
      status: "Aktif",
      initials: "BS",
    },
    {
      id: "2",
      name: "Siti Aminah, M.Pd.",
      email: "siti.aminah@lumina.sch.id",
      nip: "198812152015032001",
      specialization: "Akademik",
      subjects: "Bahasa Indonesia",
      classes: "1A, 1B",
      status: "Aktif",
      initials: "SA",
    },
    {
      id: "3",
      name: "Rian Hidayat, S.Or.",
      email: "rian.hidayat@lumina.sch.id",
      nip: "199205202018021005",
      specialization: "Non-Akademik",
      subjects: "PJOK (Olahraga)",
      classes: "All Grades",
      status: "Aktif",
      initials: "RH",
    },
    {
      id: "4",
      name: "Dewi Lestari, S.Sn.",
      email: "dewi.lestari@lumina.sch.id",
      nip: "199008122016012003",
      specialization: "Non-Akademik",
      subjects: "Seni Budaya",
      classes: "3, 4, 5",
      status: "Aktif",
      initials: "DL",
    },
  ];

  const handleResetFilters = () => {
    setSelectedJenjang("Semua Jenjang");
    setSelectedMapel("Semua Mata Pelajaran");
    setSelectedStatus("Status: Aktif");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#2563eb]">Daftar Guru</span>
          </div>
          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-800">Daftar Guru</h1>
          <p className="text-sm text-slate-400 mt-1">
            Mengelola data tenaga pendidik Lumina Scholastica.
          </p>
        </div>

        {/* Add Teacher Button */}
        <Link href="/dashboard/guru/tambah">
          <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-semibold text-xs shadow-sm">
            <Plus className="w-4 h-4" />
            Tambah Guru
          </Button>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            badge={stat.badge}
            badgeType={stat.badgeType}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Filter & Table Container */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
        
        {/* Filter Controls Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter icon label */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#f4f7fc] text-slate-600 rounded-lg text-xs font-semibold border border-slate-100">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter:
            </div>

            {/* Dropdown 1 */}
            <div className="relative">
              <select
                value={selectedJenjang}
                onChange={(e) => setSelectedJenjang(e.target.value)}
                className="appearance-none bg-white border border-slate-200/80 rounded-lg px-4 py-2 pr-10 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option>Semua Jenjang</option>
                <option>SD</option>
                <option>SMP</option>
                <option>SMA</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Dropdown 2 */}
            <div className="relative">
              <select
                value={selectedMapel}
                onChange={(e) => setSelectedMapel(e.target.value)}
                className="appearance-none bg-white border border-slate-200/80 rounded-lg px-4 py-2 pr-10 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option>Semua Mata Pelajaran</option>
                <option>Matematika</option>
                <option>Bahasa Indonesia</option>
                <option>IPA</option>
                <option>Seni Budaya</option>
                <option>PJOK</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Dropdown 3 */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-white border border-slate-200/80 rounded-lg px-4 py-2 pr-10 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option>Status: Aktif</option>
                <option>Status: Nonaktif</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-all text-left"
          >
            Reset All Filters
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                <th className="py-4 px-6">NAMA GURU</th>
                <th className="py-4 px-6">NIP</th>
                <th className="py-4 px-6">SPESIALISASI</th>
                <th className="py-4 px-6">MATA PELAJARAN</th>
                <th className="py-4 px-6">KELAS</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-slate-50/50 transition-all">
                  
                  {/* Name and Email */}
                  <td className="py-4 px-6 flex items-center gap-3">
                    {/* Initials Avatar */}
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                      {teacher.initials}
                    </div>
                    <div className="flex flex-col">
                      <Link href="/dashboard/guru/profile" className="font-bold text-slate-800 hover:text-[#2563eb] transition-all">
                        {teacher.name}
                      </Link>
                      <span className="text-[10px] text-slate-400 mt-0.5">{teacher.email}</span>
                    </div>
                  </td>

                  {/* NIP */}
                  <td className="py-4 px-6 font-medium text-slate-500">
                    {teacher.nip}
                  </td>

                  {/* Specialization */}
                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                        teacher.specialization === "Akademik"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {teacher.specialization}
                    </span>
                  </td>

                  {/* Subjects */}
                  <td className="py-4 px-6 font-medium text-slate-600">
                    {teacher.subjects}
                  </td>

                  {/* Classes */}
                  <td className="py-4 px-6 font-semibold text-slate-600">
                    {teacher.classes}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-[10px] font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {teacher.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link href="/dashboard/guru/profile" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-all">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href="/dashboard/guru/edit" className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-all">
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
            Showing 1 to 4 of 42 entries
          </span>
          
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400">
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Page Buttons */}
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
              11
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
