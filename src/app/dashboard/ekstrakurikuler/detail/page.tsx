"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Users,
  Download,
  UserPlus,
  Pencil,
  Calendar,
  MapPin,
  Mail,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ParticipationRow {
  id: string;
  name: string;
  className: string;
  nisn: string;
  status: "Aktif" | "Izin" | "Nonaktif";
  initials: string;
}

export default function ExtracurricularDetailPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const studentParticipationList: ParticipationRow[] = [
    {
      id: "1",
      name: "Aditya Saputra",
      className: "5-B",
      nisn: "0092813341",
      status: "Aktif",
      initials: "AS",
    },
    {
      id: "2",
      name: "Bella Nurhaliza",
      className: "6-A",
      nisn: "0084551229",
      status: "Aktif",
      initials: "BN",
    },
    {
      id: "3",
      name: "Christian Davin",
      className: "4-C",
      nisn: "0104432991",
      status: "Izin",
      initials: "CD",
    },
    {
      id: "4",
      name: "Dian Pratama",
      className: "5-B",
      nisn: "0091222847",
      status: "Aktif",
      initials: "DP",
    },
    {
      id: "5",
      name: "Eka Kusuma",
      className: "6-B",
      nisn: "0087762110",
      status: "Nonaktif",
      initials: "EK",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Cpu className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-extrabold text-slate-800">Robotik</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                Sains & Teknologi
              </span>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                24 Siswa Terdaftar
              </span>
            </div>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3 self-stretch md:self-auto w-full md:w-auto">
          <Button variant="secondary" className="flex-1 md:flex-initial !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm">
            <Download className="w-4 h-4 text-slate-400" />
            Unduh Daftar Siswa
          </Button>
          <Link href="/dashboard/ekstrakurikuler/tambah" className="flex-1 md:flex-initial">
            <Button className="w-full !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
              <UserPlus className="w-4 h-4" />
              Tambah Siswa
            </Button>
          </Link>
        </div>
      </div>

      {/* Main split-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left Column: Pelatih Utama */}
        <div className="w-full lg:w-[320px] bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col gap-6 shrink-0 relative">
          <div className="flex justify-between items-center border-b border-slate-100/50 pb-4">
            <h3 className="text-base font-extrabold text-slate-800">Pelatih Utama</h3>
            <Link href="/dashboard/coach/edit">
              <button className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-all border border-slate-100/50">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          {/* Coach Avatar/Photo and badge */}
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="relative">
              {/* Initials fallback styled like photo or initials badge */}
              <div className="w-28 h-28 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-3xl border border-blue-100 shadow-md flex items-center justify-center">
                RK
              </div>
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <span className="font-extrabold text-slate-800 text-lg">Rizky Kurniawan</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Coach ID: #RCT-2023-042</span>
            </div>
          </div>

          <div className="border-t border-slate-100/80 pt-4 flex flex-col gap-4.5">
            {/* Jadwal */}
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Jadwal Latihan</span>
                <span className="text-xs font-bold text-slate-700">Selasa & Kamis, 15:30</span>
              </div>
            </div>

            {/* Lokasi */}
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lokasi</span>
                <span className="text-xs font-bold text-slate-700">Lab Komputer & Robotik</span>
              </div>
            </div>

            {/* Kontak */}
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Kontak</span>
                <span className="text-xs font-bold text-slate-700 break-all">r.kurniawan@lumina.sch.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Daftar Partisipasi Siswa */}
        <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col gap-6 justify-between">
          
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100/50 pb-4">
            <h3 className="text-base font-extrabold text-slate-800">Daftar Partisipasi Siswa</h3>

            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Cari nama atau NISN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#f4f7fc] border border-slate-100/50 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Nama Siswa</th>
                  <th className="py-4 px-6">Kelas</th>
                  <th className="py-4 px-6">NISN</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                {studentParticipationList.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-all">
                    
                    {/* Student Name with Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                          {row.initials}
                        </div>
                        <span className="font-bold text-slate-800">{row.name}</span>
                      </div>
                    </td>

                    {/* Kelas */}
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {row.className}
                    </td>

                    {/* NISN */}
                    <td className="py-4 px-6 font-medium text-slate-500">
                      {row.nisn}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                          row.status === "Aktif"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : row.status === "Izin"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* Empty action column */}
                    <td className="py-4 px-6 text-right">
                      {/* Empty for placeholder */}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-400">
              Menampilkan 1-5 dari 24 siswa
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

    </div>
  );
}
