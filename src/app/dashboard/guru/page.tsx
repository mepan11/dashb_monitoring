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
  Copy,
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
  const [selectedMapel, setSelectedMapel] = useState("Semua Mata Pelajaran");
  const [selectedStatus, setSelectedStatus] = useState("Status: Aktif");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [statsData, setStatsData] = useState({ total: 0, active: 0, akademik: 0, nonAkademik: 0 });
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [periodId, setPeriodId] = useState<string>("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Mendengarkan perubahan periode akademik
  React.useEffect(() => {
    const cached = localStorage.getItem("active_period_id") || "";
    setPeriodId(cached);

    const handlePeriodChange = (e: any) => {
      setPeriodId(e.detail.periodId || "");
    };

    window.addEventListener("academic_period_changed", handlePeriodChange);
    return () => {
      window.removeEventListener("academic_period_changed", handlePeriodChange);
    };
  }, []);

  React.useEffect(() => {
    async function fetchTeachers() {
      if (!periodId) return;
      setLoading(true);
      try {
        const cleanStatus = selectedStatus === "Status: Aktif" ? "Aktif" : "Nonaktif";
        const mapelQuery = selectedMapel === "Semua Mata Pelajaran" ? "" : `&subject=${encodeURIComponent(selectedMapel)}`;
        const res = await fetch(`/api/teachers?status=${cleanStatus}&page=${currentPage}&limit=${limit}&period_id=${periodId}${mapelQuery}`);
        const data = await res.json();
        if (data.success) {
          setTeachers(data.data);
          setStatsData(data.stats);
          setFilteredTotal(data.filteredTotal || 0);
        }
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, [selectedStatus, currentPage, limit, selectedMapel, periodId, refetchTrigger]);

  // KPI Data
  const stats = [
    {
      title: "Total Guru",
      value: statsData.total,
      badge: "+4 MoM",
      badgeType: "success" as const,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Aktif",
      value: statsData.active,
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Akademik",
      value: statsData.akademik,
      icon: BookOpen,
      iconBg: "bg-amber-50/70",
      iconColor: "text-amber-600",
    },
    {
      title: "Non-Akademik",
      value: statsData.nonAkademik,
      icon: Palette,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
    },
  ];

  const [copying, setCopying] = useState(false);

  const handleCopyPrevious = async () => {
    if (!periodId) {
      alert("Periode akademik aktif belum terdeteksi!");
      return;
    }
    if (!confirm("Apakah Anda yakin ingin menyalin semua data guru dari periode sebelumnya ke periode aktif saat ini? NIP yang sudah ada di periode aktif tidak akan disalin ganda.")) {
      return;
    }
    setCopying(true);
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "copy_previous",
          periodId,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        setCurrentPage(1);
        setRefetchTrigger((p) => p + 1);
      } else {
        alert(data.message || "Gagal menyalin data guru");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setCopying(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedMapel("Semua Mata Pelajaran");
    setSelectedStatus("Status: Aktif");
  };

  const handleDelete = async (teacherId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/teachers/${teacherId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert("Data guru berhasil dihapus!");
        setTeachers(teachers.filter((t) => t.id !== teacherId));
        setStatsData((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          active: prev.active - 1,
        }));
      } else {
        alert(data.message || "Gagal menghapus data guru");
      }
    } catch (err) {
      console.error("Failed to delete teacher:", err);
      alert("Terjadi kesalahan koneksi");
    }
  };

  const totalPages = Math.ceil(filteredTotal / limit);
  const startEntry = filteredTotal === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endEntry = Math.min(currentPage * limit, filteredTotal);

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

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto self-stretch md:self-auto">
          <Button
            onClick={handleCopyPrevious}
            disabled={copying}
            className="!w-auto !py-2.5 !px-5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Copy className="w-4 h-4" />
            {copying ? "Menyalin..." : "Salin Data Guru Periode Sebelumnya"}
          </Button>

          <Link href="/dashboard/guru/tambah" className="flex-1 md:flex-initial">
            <Button className="!w-full md:!w-auto !py-2.5 !px-5 flex items-center justify-center gap-2 rounded-lg font-semibold text-xs shadow-sm bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4" />
              Tambah Guru
            </Button>
          </Link>
        </div>
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

            {/* Dropdown 2 */}
            <div className="relative">
              <select
                value={selectedMapel}
                onChange={(e) => setSelectedMapel(e.target.value)}
                className="appearance-none bg-white border border-slate-200/80 rounded-lg px-4 py-2 pr-10 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option>Semua Mata Pelajaran</option>
                <option>Matematika</option>
                <option>Bahasa Inggris</option>
                <option>Ilmu Pengetahuan Alam</option>
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                    Memuat data guru...
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                    Tidak ada data guru yang ditemukan.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 transition-all">
                    
                    {/* Name and Email */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      {/* Initials Avatar */}
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                        {teacher.initials}
                      </div>
                      <div className="flex flex-col">
                        <Link href={`/dashboard/guru/profile?id=${teacher.id}`} className="font-bold text-slate-800 hover:text-[#2563eb] transition-all">
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
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {teacher.classes}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          teacher.status === "Aktif"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {teacher.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Link href={`/dashboard/guru/profile?id=${teacher.id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-all">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/dashboard/guru/edit?id=${teacher.id}`} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-all">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(teacher.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-400">
            Menampilkan {startEntry} sampai {endEntry} dari {filteredTotal} data guru
          </span>
          
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className={`p-1.5 rounded-lg border border-slate-100 text-slate-400 transition-all ${
                currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Page Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                  currentPage === p
                    ? "bg-blue-600 text-white shadow-sm"
                    : "hover:bg-slate-50 text-slate-600 font-semibold"
                }`}
              >
                {p}
              </button>
            ))}

            {/* Next */}
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className={`p-1.5 rounded-lg border border-slate-100 text-slate-400 transition-all ${
                currentPage === totalPages || totalPages === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-50"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
