"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/lib/useRole";

interface Student {
  id: string;
  name: string;
  genderText: string;
  nisn: string;
  classLabel: string;
  genderCode: string;
  status: string;
  initials: string;
}

interface Stats {
  total: number;
  active: number;
  male: number;
  female: number;
}

const LIMIT = 15;

export default function SiswaPage() {
  const { role } = useRole();
  const isReadOnly = role !== "admin";
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, male: 0, female: 0 });
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [periodId, setPeriodId] = useState<string>("");

  const [selectedClassFilter, setSelectedClassFilter] = useState("Semua");
  const [selectedGender, setSelectedGender] = useState("Semua");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const classFilters = ["Semua", "Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"];

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

  const fetchStudents = useCallback(async () => {
    if (!periodId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedClassFilter !== "Semua") params.set("class", selectedClassFilter);
      if (selectedGender !== "Semua") params.set("gender", selectedGender);
      params.set("page", String(currentPage));
      params.set("limit", String(LIMIT));
      params.set("period_id", periodId);

      const res = await fetch(`/api/students?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setStudents(json.data);
        setStats(json.stats);
        setFilteredTotal(json.filteredTotal);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedClassFilter, selectedGender, currentPage, periodId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedClassFilter, selectedGender, periodId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus data siswa "${name}"?`)) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchStudents();
      } else {
        alert(json.message || "Gagal menghapus data");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    }
  };

  const totalPages = Math.ceil(filteredTotal / LIMIT);

  const getPaginationPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Daftar Siswa</h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mt-2">
            <span>Manajemen Data</span>
            <span>&gt;</span>
            <span className="text-[#2563eb]">Siswa</span>
          </div>
        </div>

        {!isReadOnly && (
          <Link href="/dashboard/siswa/tambah">
            <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
              <UserPlus className="w-4 h-4" />
              Tambah Siswa
            </Button>
          </Link>
        )}
      </div>

      {/* Stats + Filter Row */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">

        {/* Filter Kelas */}
        <div className="flex-1 bg-white border border-slate-100/80 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-700">Filter Kelas</h2>
            <button
              onClick={() => { setSelectedClassFilter("Semua"); setSelectedGender("Semua"); }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Reset
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {classFilters.map((cls) => {
              const isActive = selectedClassFilter === cls;
              return (
                <button
                  key={cls}
                  onClick={() => setSelectedClassFilter(cls)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-[#f4f7fc] text-slate-500 hover:bg-slate-200/50"
                  }`}
                >
                  {cls}
                </button>
              );
            })}
          </div>

          {/* Gender filter */}
          <div className="flex gap-2 pt-1 border-t border-slate-50">
            {["Semua", "L", "P"].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedGender === g
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {g === "Semua" ? "Semua Gender" : g === "L" ? "Laki-laki" : "Perempuan"}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Card */}
        <div className="w-full lg:w-[320px] bg-[#2563eb] rounded-2xl p-6 shadow-[0_8px_30px_rgb(37,99,235,0.15)] flex justify-between items-center text-white shrink-0 relative overflow-hidden">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-blue-100">Total Siswa Aktif</span>
            <span className="text-3xl font-extrabold tracking-tight">
              {loading ? "..." : stats.active.toLocaleString("id-ID")}
            </span>
            <div className="flex gap-3 mt-1">
              <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full">
                ♂ {stats.male} L
              </span>
              <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full">
                ♀ {stats.female} P
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/5 shadow-inner">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau NISN siswa..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 text-xs font-bold bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8] transition-all"
        >
          Cari
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); setSearchInput(""); }}
            className="px-4 py-2.5 text-xs font-bold bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"
          >
            Reset
          </button>
        )}
      </form>

      {/* Main Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#fafbfc] text-xs font-extrabold text-slate-500 tracking-wider">
                <th className="py-4 px-6">Siswa</th>
                <th className="py-4 px-6">NISN</th>
                <th className="py-4 px-6">Kelas</th>
                <th className="py-4 px-6">Gender</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 font-semibold">
                    Memuat data siswa...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 font-semibold">
                    Tidak ada data siswa ditemukan.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-all">

                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center border shadow-sm shrink-0 text-xs ${
                        student.genderCode === "P"
                          ? "bg-pink-50 text-pink-600 border-pink-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                      }`}>
                        {student.initials}
                      </div>
                      <div className="flex flex-col">
                        <Link
                          href={`/dashboard/siswa/profile?id=${student.id}`}
                          className="font-bold text-slate-800 hover:text-[#2563eb] transition-all"
                        >
                          {student.name}
                        </Link>
                        <span className="text-[10px] text-slate-400 mt-0.5">{student.genderText}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-600">{student.nisn}</td>

                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                        {student.classLabel}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-medium text-slate-500">{student.genderCode}</td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${
                        student.status === "Aktif"
                          ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                          : "border-slate-100 bg-slate-50 text-slate-500"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${student.status === "Aktif" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                        {student.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Link
                          href={`/dashboard/siswa/profile?id=${student.id}`}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {!isReadOnly && (
                          <>
                            <Link
                              href={`/dashboard/siswa/edit?id=${student.id}`}
                              className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-all"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(student.id, student.name)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-400">
            Showing {filteredTotal === 0 ? 0 : (currentPage - 1) * LIMIT + 1} -{" "}
            {Math.min(currentPage * LIMIT, filteredTotal)} of {filteredTotal} siswa
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPaginationPages().map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="text-xs text-slate-400 px-1">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p as number)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                    currentPage === p
                      ? "bg-blue-600 text-white shadow-sm"
                      : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
