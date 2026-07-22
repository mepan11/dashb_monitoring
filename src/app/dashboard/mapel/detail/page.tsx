"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  BookOpen,
  Palette,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/lib/useRole";

interface SubjectRow {
  id: string;
  name: string;
  category: string;
  teacher: string;
  teacherInitials: string;
  schedule: string;
  progress: number;
}

function SubjectDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get("class_id") || "1";

  const { role, isAdmin, isTeacher } = useRole();
  const [isHomeroomClass, setIsHomeroomClass] = useState(false);
  const canCRUD = isAdmin || (isTeacher && isHomeroomClass);

  const [className, setClassName] = useState("Kelas ...");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [ekskulCount, setEkskulCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Urutkan: Nama (A-Z)");

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem("user");
      let teacherEmailParam = "";
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.role === "guru" && u.email) {
          teacherEmailParam = `?teacher_email=${encodeURIComponent(u.email)}`;
        }
      }
      const separator = teacherEmailParam ? "&" : "?";
      const cachedPeriodId = localStorage.getItem("active_period_id") || "";
      const periodParam = cachedPeriodId ? `${separator}period_id=${cachedPeriodId}` : "";

      const res = await fetch(`/api/classes/${classId}/subjects${teacherEmailParam}${periodParam}`);
      const json = await res.json();
      if (json.success) {
        setClassName(json.className);
        setAcademicYear(json.academicYear);
        setSubjects(json.data);
        setIsHomeroomClass(!!json.isHomeroomClass);
      }

      const ekskulRes = await fetch(`/api/extracurriculars?period_id=${cachedPeriodId}`);
      const ekskulJson = await ekskulRes.json();
      if (ekskulJson.success) {
        setEkskulCount(ekskulJson.data?.length || 0);
      }
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleDelete = async (subjectId: string, name: string) => {
    if (!confirm(`Hapus mata pelajaran "${name}" dari kurikulum kelas ${className}?`)) return;
    try {
      const userStr = localStorage.getItem("user");
      const headers: Record<string, string> = {};
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.role) headers["x-user-role"] = u.role;
        if (u.email) headers["x-user-email"] = u.email;
      }
      const cachedPeriodId = localStorage.getItem("active_period_id") || "";
      const periodParam = cachedPeriodId ? `&period_id=${cachedPeriodId}` : "";

      const res = await fetch(`/api/classes/${classId}/subjects?subjectId=${subjectId}${periodParam}`, {
        method: "DELETE",
        headers,
      });
      const json = await res.json();
      if (json.success) {
        fetchSubjects();
      } else {
        alert(json.message || "Gagal menghapus mata pelajaran");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    }
  };

  // Stats calculation
  const totalSubjects = subjects.length;
  const akademikCount = subjects.filter((s) => s.category === "AKADEMIK").length;

  const stats = [
    {
      title: "Total Mata Pelajaran",
      value: totalSubjects,
      icon: BookOpen,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Mata Pelajaran (Akademik)",
      value: akademikCount,
      icon: GraduationCap,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Ekstrakurikuler (Non-Akademik)",
      value: ekskulCount,
      icon: Palette,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  const filteredSubjects = subjects
    .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOption.includes("A-Z")) return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/dashboard" className="hover:text-slate-600">Dashboard</Link>
        <span>&gt;</span>
        <Link href="/dashboard/mapel" className="hover:text-slate-600">Mata Pelajaran</Link>
        <span>&gt;</span>
        <span className="text-[#2563eb]">Daftar Mata Pelajaran ({className})</span>
      </div>

      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Kurikulum - {className}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola kurikulum dan pembagian tugas pengajar untuk tahun ajaran {academicYear}.
          </p>
        </div>

        {/* Top actions */}
        {canCRUD && (
          <div className="self-stretch xl:self-auto">
            <Link href={`/dashboard/mapel/tambah?class_id=${classId}`}>
              <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
                <Plus className="w-4 h-4" />
                Tambah Mata Pelajaran
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
              <div className={`w-12 h-12 rounded-lg ${stat.iconBg} flex items-center justify-center ${stat.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">{stat.title}</span>
                <span className="text-2xl font-extrabold text-slate-800 mt-1">{loading ? "..." : stat.value}</span>
              </div>
            </div>
          );
        })}
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
              placeholder="Cari mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#f4f7fc] border border-slate-100/50 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setSortOption(sortOption === "Urutkan: Nama (A-Z)" ? "Urutkan: Nama (Z-A)" : "Urutkan: Nama (A-Z)")}
              className="flex items-center gap-2 px-4 py-2 bg-[#f4f7fc] text-slate-600 rounded-lg text-xs font-semibold border border-slate-100/50"
            >
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 font-bold">
                    Memuat mata pelajaran kelas...
                  </td>
                </tr>
              ) : filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 font-bold">
                    Belum ada mata pelajaran ditambahkan ke kelas ini.
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-slate-50/50 transition-all">
                    
                    {/* Subject Name */}
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

                    {/* Guru Pengajar */}
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
                      {canCRUD && (
                        <div className="flex items-center justify-center gap-2.5">
                          <Link
                            href={`/dashboard/mapel/edit?class_id=${classId}&subject_id=${subject.id}`}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(subject.id, subject.name)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function SubjectDetailPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400 font-bold">Memuat Halaman...</div>}>
      <SubjectDetailContent />
    </Suspense>
  );
}
