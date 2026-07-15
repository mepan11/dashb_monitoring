"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  ExternalLink,
  Layers,
  GraduationCap,
  TrendingUp,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

function TeacherProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "1";

  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [periodId, setPeriodId] = useState<string>("");

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

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/teachers/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert("Data guru berhasil dihapus!");
        router.push("/dashboard/guru");
      } else {
        alert(data.message || "Gagal menghapus data guru");
      }
    } catch (err) {
      console.error("Failed to delete teacher:", err);
      alert("Terjadi kesalahan koneksi");
    }
  };

  useEffect(() => {
    if (!periodId) return;
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch(`/api/teachers/${id}?period_id=${periodId}`);
        const json = await res.json();
        if (json.success) {
          setTeacher(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch teacher profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id, periodId]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold">
        Memuat profil guru...
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="py-20 text-center text-rose-500 font-bold">
        Guru tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-[#1e293b]">Profil & Manajemen Guru</h1>
        
        {/* Add Teacher Button */}
        <Link href="/dashboard/guru/tambah">
          <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
            <Plus className="w-4 h-4" />
            Tambah Guru
          </Button>
        </Link>
      </div>

      {/* Main split-pane content */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left main Profile Card */}
        <div className="flex-1 bg-white border border-slate-100/80 rounded-3xl p-8 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col gap-8 justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            
            {/* Avatar & Name details */}
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-blue-50 text-[#2563eb] border border-blue-100 shadow-md flex items-center justify-center font-extrabold text-2xl">
                  {teacher.initials}
                </div>
                <span className={`absolute -bottom-2 -right-2 font-bold text-[10px] px-2.5 py-0.5 rounded-full border-2 border-white shadow-sm ${
                  teacher.status === "Aktif" 
                    ? "bg-emerald-500 text-white" 
                    : "bg-rose-500 text-white"
                }`}>
                  {teacher.status}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <h2 className="text-xl font-extrabold text-slate-800">
                  {teacher.name}
                </h2>
                <span className="text-xs font-bold text-blue-600">
                  NIP: {teacher.nip}
                </span>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:sm:self-auto">
              <Link href={`/dashboard/guru/edit?id=${teacher.id}`} className="flex-1 sm:flex-initial">
                <button className="w-full py-2 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Profil
                </button>
              </Link>
              <button 
                onClick={handleDelete}
                className="flex-1 sm:flex-initial py-2 px-4 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-100/50 text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            </div>

          </div>

          {/* Info Details 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100/80 pt-6 mt-2">
            
            {/* Email */}
            <div className="flex gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">EMAIL</span>
                <span className="text-xs font-semibold text-slate-700 mt-1">{teacher.email}</span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">NOMOR TELEPON</span>
                <span className="text-xs font-semibold text-slate-700 mt-1">{teacher.phone}</span>
              </div>
            </div>

            {/* Join date */}
            <div className="flex gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">BERGABUNG SEJAK</span>
                <span className="text-xs font-semibold text-slate-700 mt-1">{teacher.joinDate}</span>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">ALAMAT</span>
                <span className="text-xs font-semibold text-slate-700 mt-1 leading-relaxed">
                  {teacher.address}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right side Panels (Wali kelas & Mapel diampu) */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6 shrink-0 justify-between">
          
          {/* Top blue card: Status Wali Kelas */}
          <div className="bg-[#2563eb] rounded-2xl p-6 text-white shadow-[0_8px_30px_rgb(37,99,235,0.15)] flex flex-col justify-between gap-5 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/5 shadow-inner">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Status Wali Kelas</span>
                <span className="text-base font-extrabold">
                  {teacher.homeroomClass ? `Wali Kelas: ${teacher.homeroomClass}` : "Bukan Wali Kelas"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2">
              <span className="text-xs font-medium text-blue-100">
                {teacher.homeroomClass ? "Bertanggung jawab atas kelas binaan" : "Tidak mengampu rombel khusus"}
              </span>
              {teacher.homeroomClass && (
                <Link href="/dashboard/kelas/detail" className="text-xs font-bold text-white flex items-center gap-1.5 hover:underline">
                  Lihat Kelas
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Bottom white card: Subjects & Classes Diampu */}
          <div className="bg-white border border-slate-100/85 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            
            {/* Subjects diampu */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Mata Pelajaran Diampu
              </h3>

              <div className="flex flex-wrap gap-2">
                {teacher.subjects && teacher.subjects.length > 0 ? (
                  teacher.subjects.map((sub: string) => (
                    <button
                      key={sub}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-blue-100 bg-blue-50/50 hover:bg-blue-50 text-xs font-bold text-[#2563eb] transition-all"
                    >
                      {sub}
                      <ExternalLink className="w-3 h-3 text-blue-400" />
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 font-semibold italic">Tidak ada mapel diampu</span>
                )}
              </div>
            </div>

            {/* Classes diampu */}
            <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                Kelas Diampu
              </h3>

              <div className="flex flex-wrap gap-2">
                {teacher.classes && teacher.classes.length > 0 ? (
                  teacher.classes.map((cls: string) => (
                    <span
                      key={cls}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600"
                    >
                      {cls}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 font-semibold italic">Tidak ada kelas diampu</span>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Performance & Attendance Summary */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-800">Ringkasan Kinerja & Kehadiran</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Kehadiran Mengajar */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between gap-6">
            <div className="flex justify-between items-center">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                +2.5% bln ini
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">Kehadiran Mengajar</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-2">{teacher.attendanceRate}%</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div style={{ width: `${teacher.attendanceRate}%` }} className="h-full bg-emerald-500 rounded-full"></div>
            </div>
          </div>

          {/* Card 2: Rata-rata Nilai Siswa */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between gap-6">
            <div className="flex justify-between items-center">
              <div className="p-2.5 rounded-lg bg-blue-50 text-[#2563eb]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 text-[#2563eb]">
                Unggul
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">Rata-rata Nilai Siswa</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-2">{teacher.averageScore}</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div style={{ width: `${teacher.averageScore}%` }} className="h-full bg-[#2563eb] rounded-full"></div>
            </div>
          </div>

          {/* Card 3: Tambah Widget Analisis (Dotted Card) */}
          <div className="bg-[#f4f7fc]/30 border-2 border-dashed border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:bg-slate-100/30 transition-all min-h-[180px]">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-[#2563eb] shadow-sm shrink-0">
              <LayoutGrid className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500">Tambah Widget Analisis</span>
              <button className="text-xs font-extrabold text-[#2563eb] hover:text-blue-700 mt-2">
                Konfigurasi
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default function TeacherProfilePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400 font-bold">Memuat halaman...</div>}>
      <TeacherProfileContent />
    </Suspense>
  );
}
