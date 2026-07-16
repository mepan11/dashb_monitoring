"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle,
  Shapes,
  Ban,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Copy,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/lib/useRole";

interface Coach {
  id: string;
  name: string;
  email: string;
  idNumber: string;
  specialization: string;
  specializationType: string;
  contact: string;
  status: "Aktif" | "Non-Aktif" | string;
  initials: string;
}

export default function CoachPage() {
  const { isReadOnly } = useRole();
  const [selectedBidang, setSelectedBidang] = useState("Semua Bidang");
  const [selectedStatus, setSelectedStatus] = useState("Status: Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [statsData, setStatsData] = useState({ total: 0, active: 0, specializationCount: 0, nonActive: 0 });
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [periodId, setPeriodId] = useState<string>("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Mendengarkan perubahan periode akademik
  useEffect(() => {
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

  useEffect(() => {
    async function fetchCoaches() {
      if (!periodId) return;
      setLoading(true);
      try {
        const cleanStatus = selectedStatus === "Status: Aktif" ? "Aktif" : selectedStatus === "Status: Non-Aktif" ? "Non-Aktif" : "Semua";
        const queryParams = new URLSearchParams({
          page: String(currentPage),
          limit: String(limit),
          status: cleanStatus,
          specialization: selectedBidang,
          search: searchQuery,
          period_id: periodId,
        });
        const res = await fetch(`/api/coaches?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setCoaches(data.data);
          setStatsData(data.stats);
          setFilteredTotal(data.filteredTotal || 0);
        }
      } catch (err) {
        console.error("Failed to fetch coaches:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCoaches();
  }, [selectedBidang, selectedStatus, searchQuery, currentPage, limit, periodId, refetchTrigger]);

  const [copying, setCopying] = useState(false);

  const handleCopyPrevious = async () => {
    if (!periodId) {
      alert("Periode akademik aktif belum terdeteksi!");
      return;
    }
    if (!confirm("Apakah Anda yakin ingin menyalin semua data coach dari periode sebelumnya ke periode aktif saat ini? ID Number yang sudah ada di periode aktif tidak akan disalin ganda.")) {
      return;
    }
    setCopying(true);
    try {
      const res = await fetch("/api/coaches", {
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
        alert(data.message || "Gagal menyalin data coach");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setCopying(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedBidang("Semua Bidang");
    setSelectedStatus("Status: Semua");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data coach ini?")) {
      return;
    }
    try {
      const response = await fetch(`/api/coaches/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Data coach berhasil dihapus");
        // Reload page
        setCurrentPage(1);
        // Trigger refetch by resetting search/filters slightly or just re-running query
        setSearchQuery((q) => q + " ");
        setTimeout(() => setSearchQuery((q) => q.trim()), 50);
      } else {
        alert(data.message || "Gagal menghapus coach");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    }
  };

  const getSpecializationBadgeStyles = (spec: string) => {
    const s = spec.toLowerCase();
    if (s.includes("robotik") || s.includes("coding")) {
      return "bg-blue-50 text-blue-600 border border-blue-100";
    } else if (s.includes("tari") || s.includes("lukis") || s.includes("seni")) {
      return "bg-amber-50 text-amber-600 border border-amber-100";
    } else if (s.includes("futsal") || s.includes("bola") || s.includes("basket") || s.includes("olahraga")) {
      return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    } else {
      return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  // KPI Card Config
  const stats = [
    {
      title: "Total Coach",
      value: statsData.total,
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
      title: "Spesialisasi",
      value: `${statsData.specializationCount} Bidang`,
      icon: Shapes,
      iconBg: "bg-amber-50/70",
      iconColor: "text-amber-600",
    },
    {
      title: "Non-Aktif",
      value: statsData.nonActive,
      icon: Ban,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  const totalPages = Math.ceil(filteredTotal / limit) || 1;
  const startEntry = filteredTotal > 0 ? (currentPage - 1) * limit + 1 : 0;
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
            <span className="text-[#2563eb]">Daftar Coach</span>
          </div>
          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-800">Daftar Coach</h1>
          <p className="text-sm text-slate-400 mt-1">
            Mengelola data profesional pendidik ekstrakurikuler dan klub sekolah.
          </p>
        </div>

        {/* Action Buttons */}
        {!isReadOnly && (
          <div className="flex items-center gap-3 w-full md:w-auto self-stretch md:self-auto">
            <Button
              onClick={handleCopyPrevious}
              disabled={copying}
              className="!w-auto !py-2.5 !px-5 bg-white border border-slate-200 !text-black hover:bg-slate-50 hover:text-slate-900 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Copy className="w-4 h-4" />
              {copying ? "Menyalin..." : "Salin Data Coach Periode Sebelumnya"}
            </Button>

            <Link href="/dashboard/coach/tambah" className="flex-1 md:flex-initial">
              <Button className="!w-full md:!w-auto !py-2.5 !px-5 flex items-center justify-center gap-2 rounded-lg font-semibold text-xs shadow-sm bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4" />
                Tambah Coach Baru
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Filter & Table Container */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">

        {/* Filter Controls Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter icon label */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#f4f7fc] text-slate-600 rounded-lg text-xs font-semibold border border-slate-100">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter:
            </div>

            {/* Search query input */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari coach..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200/80 rounded-lg pl-9 pr-4 py-2 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-400 w-52"
              />
            </div>

            {/* Dropdown 1 */}
            <div className="relative">
              <select
                value={selectedBidang}
                onChange={(e) => {
                  setSelectedBidang(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white border border-slate-200/80 rounded-lg px-4 py-2 pr-10 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option>Semua Bidang</option>
                <option>Robotik</option>
                <option>Sepak Bola</option>
                <option>Seni Lukis</option>
                <option>Basket</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Dropdown 2 */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white border border-slate-200/80 rounded-lg px-4 py-2 pr-10 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option>Status: Semua</option>
                <option>Status: Aktif</option>
                <option>Status: Non-Aktif</option>
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
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-bold">
              Memuat data coach...
            </div>
          ) : coaches.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-bold">
              Tidak ada data coach ditemukan.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">NAMA COACH</th>
                  <th className="py-4 px-6">ID NUMBER</th>
                  <th className="py-4 px-6">SPESIALISASI</th>
                  <th className="py-4 px-6">KONTAK</th>
                  <th className="py-4 px-6">STATUS</th>
                  <th className="py-4 px-6 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {coaches.map((coach) => (
                  <tr key={coach.id} className="hover:bg-slate-50/50 transition-all">

                    {/* Name and Email */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      {/* Initials Avatar */}
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                        {coach.initials}
                      </div>
                      <div className="flex flex-col">
                        <Link href={`/dashboard/coach/profile?id=${coach.id}`} className="font-bold text-slate-800 hover:text-[#2563eb] transition-all">
                          {coach.name}
                        </Link>
                        <span className="text-[10px] text-slate-400 mt-0.5">{coach.email}</span>
                      </div>
                    </td>

                    {/* ID Number */}
                    <td className="py-4 px-6 font-medium text-slate-500">
                      {coach.idNumber}
                    </td>

                    {/* Specialization Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${getSpecializationBadgeStyles(
                          coach.specialization
                        )}`}
                      >
                        {coach.specialization}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {coach.contact || "—"}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      {coach.status === "Aktif" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-[10px] font-bold text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {coach.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-rose-100 bg-rose-50 text-[10px] font-bold text-rose-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          {coach.status}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Link href={`/dashboard/coach/profile?id=${coach.id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-all">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {!isReadOnly && (
                          <>
                            <Link href={`/dashboard/coach/edit?id=${coach.id}`} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-all">
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(coach.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && coaches.length > 0 && (
          <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-400">
              Menampilkan {startEntry} - {endEntry} dari {filteredTotal} Coach
            </span>

            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Buttons */}
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${currentPage === pageNum
                      ? "bg-blue-600 text-white shadow-sm"
                      : "hover:bg-slate-50 text-slate-600 font-semibold"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
