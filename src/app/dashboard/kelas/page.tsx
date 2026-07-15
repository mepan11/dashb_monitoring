"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  LineChart,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ClassItem {
  id: string;
  name: string;
  homeroomTeacher: string | null;
  homeroomTeacherId: number | null;
  capacity: number;
  academicYear: string;
  semester: string;
  studentsCount: number;
}

export default function KelasPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState("Semua Kelas");
  const [periodId, setPeriodId] = useState<string>("");

  const gradeFilters = [
    "Semua Kelas",
    "Kelas 1",
    "Kelas 2",
    "Kelas 3",
    "Kelas 4",
    "Kelas 5",
    "Kelas 6",
  ];

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

  async function fetchClasses(pid: string) {
    if (!pid) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/classes?period_id=${pid}`);
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

  useEffect(() => {
    if (periodId) {
      fetchClasses(periodId);
    }
  }, [periodId]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kelas "${name}"? Tindakan ini juga akan menghapus data terkait.`)) return;
    try {
      const res = await fetch(`/api/classes/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchClasses(periodId);
      } else {
        alert(json.message || "Gagal menghapus kelas");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    }
  };

  const filteredClasses = classes.filter((cls) => {
    if (selectedGradeFilter === "Semua Kelas") return true;
    return cls.name.startsWith(selectedGradeFilter);
  });

  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const avgStudents = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Manajemen Kelas</h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola dan pantau aktivitas seluruh jenjang kelas di sekolah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/kelas/tambah">
            <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
              <Plus className="w-4 h-4" />
              Tambah Kelas Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border-l-4 border-l-[#2563eb] flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#2563eb]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">TOTAL KELAS</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1">
              {loading ? "..." : totalClasses}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">aktif di sekolah</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border-l-4 border-l-[#10b981] flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10b981]">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">TOTAL SISWA TERDAFTAR</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1">
              {loading ? "..." : totalStudents}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">siswa aktif</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border-l-4 border-l-[#8b5cf6] flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-[#8b5cf6]">
            <LineChart className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">RATA-RATA SISWA / KELAS</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1">
              {loading ? "..." : avgStudents}
            </span>
            <span className="text-[10px] text-amber-500 font-bold mt-0.5">kapasitas ideal 32</span>
          </div>
        </div>
      </div>

      {/* Filter Grade bar */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold text-slate-400">Filter Tingkat:</span>
        <div className="flex flex-wrap gap-2">
          {gradeFilters.map((grade) => {
            const isActive = selectedGradeFilter === grade;
            return (
              <button
                key={grade}
                onClick={() => setSelectedGradeFilter(grade)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "bg-white border border-slate-100 text-slate-505 hover:bg-slate-100/50"
                }`}
              >
                {grade}
              </button>
            );
          })}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold">
            Memuat daftar kelas...
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold">
            Tidak ada rombongan belajar ditemukan.
          </div>
        ) : (
          filteredClasses.map((cls) => {
            const isFull = cls.studentsCount >= cls.capacity;
            const progressPercentage = Math.min((cls.studentsCount / cls.capacity) * 100, 100);
            
            const nameParts = (cls.homeroomTeacher || "Wali Kelas").trim().split(" ");
            const initials = nameParts.length >= 2
              ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
              : `${nameParts[0][0] || "W"}`.toUpperCase();

            return (
              <div
                key={cls.id}
                className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between gap-6"
              >
                {/* Card Top */}
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-700 text-base">{cls.name}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                      isFull
                        ? "bg-orange-50 text-orange-500"
                        : "bg-emerald-50 text-emerald-505"
                    }`}
                  >
                    {isFull ? "PENUH" : "AKTIF"}
                  </span>
                </div>

                {/* Homeroom teacher */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WALI KELAS</span>
                    <span className="text-sm font-bold text-slate-800 mt-0.5">
                      {cls.homeroomTeacher || "Belum ditentukan"}
                    </span>
                  </div>
                </div>

                {/* Progress bar info */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>{cls.studentsCount} Siswa</span>
                    <span>{cls.studentsCount}/{cls.capacity} Kapasitas</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${progressPercentage}%` }}
                      className={`h-full rounded-full transition-all ${
                        isFull ? "bg-orange-500" : "bg-[#2563eb]"
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex justify-between items-center border-t border-slate-100/80 pt-4 mt-2">
                  <Link href={`/dashboard/kelas/detail?id=${cls.id}`}>
                    <span className="text-xs font-bold text-slate-500 hover:text-slate-750 border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50 transition-all cursor-pointer">
                      Detail Kelas
                    </span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/kelas/edit?id=${cls.id}`}>
                      <span className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg border border-slate-100 transition-all block cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </span>
                    </Link>
                    <button
                      onClick={() => handleDelete(cls.id, cls.name)}
                      className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg border border-slate-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
