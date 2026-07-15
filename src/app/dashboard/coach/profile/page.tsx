"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Dumbbell,
  Clock,
  ExternalLink,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Coach {
  id: string;
  name: string;
  email: string;
  idNumber: string;
  specialization: string;
  contact: string;
  status: string;
  attendanceRate: string;
  schedule?: string;
  location?: string;
  initials: string;
}

function CoachProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "1";

  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodId, setPeriodId] = useState<string>("");

  const days = coach?.schedule ? coach.schedule.split(",").map(d => d.trim()).filter(Boolean) : [];
  const locations = coach?.location ? coach.location.split(",").map(l => l.trim()).filter(Boolean) : [];

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
    if (!periodId) return;
    async function fetchCoach() {
      setLoading(true);
      try {
        const res = await fetch(`/api/coaches/${id}?period_id=${periodId}`);
        const json = await res.json();
        if (json.success) {
          setCoach(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch coach details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCoach();
  }, [id, periodId]);

  const handleDelete = async () => {
    if (!coach) return;
    if (!confirm("Apakah Anda yakin ingin menghapus data coach ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/coaches/${coach.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert("Data coach berhasil dihapus");
        router.push("/dashboard/coach");
      } else {
        alert(data.message || "Gagal menghapus coach");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold">
        Memuat data coach...
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold">
        Coach tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-[#1e293b]">Profil & Manajemen Coach</h1>
        
        {/* Add Coach Button */}
        <Link href="/dashboard/coach/tambah">
          <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
            <Plus className="w-4 h-4" />
            Tambah Coach
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
                <div className="w-24 h-24 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-md flex items-center justify-center font-extrabold text-2xl">
                  {coach.initials}
                </div>
                <span className={`absolute -bottom-2 -right-2 font-bold text-[10px] px-2.5 py-0.5 rounded-full border-2 border-white shadow-sm ${
                  coach.status === "Aktif" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                }`}>
                  {coach.status}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <h2 className="text-xl font-extrabold text-slate-800">
                  {coach.name}
                </h2>
                <span className="text-xs font-bold text-emerald-600">
                  ID Number: {coach.idNumber}
                </span>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <Link href={`/dashboard/coach/edit?id=${coach.id}`} className="flex-1 sm:flex-initial">
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
                <span className="text-xs font-semibold text-slate-700 mt-1">{coach.email}</span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">NOMOR TELEPON</span>
                <span className="text-xs font-semibold text-slate-700 mt-1">{coach.contact || "—"}</span>
              </div>
            </div>

            {/* Join date */}
            <div className="flex gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">BERGABUNG SEJAK</span>
                <span className="text-xs font-semibold text-slate-700 mt-1">12 Februari 2024</span>
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
                  Jl. Flamboyan No. 12, Kebayoran Lama, Jakarta Selatan
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right side Panels (Bidang spesialisasi & Jadwal latihan) */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6 shrink-0 justify-between">
          
          {/* Top emerald card: Spesialisasi */}
          <div className="bg-[#059669] rounded-2xl p-6 text-white shadow-[0_8px_30px_rgb(5,150,105,0.15)] flex flex-col justify-between gap-5 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/5 shadow-inner">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Spesialisasi Utama</span>
                <span className="text-base font-extrabold">{coach.specialization}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2">
              <span className="text-xs font-medium text-emerald-100">Melatih program {coach.specialization}</span>
              <a href="#" className="text-xs font-bold text-white flex items-center gap-1.5">
                Lihat Program
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Bottom white card: Jadwal Latihan & Aktivitas */}
          <div className="bg-white border border-slate-100/85 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            
            {/* Hari Latihan */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                Hari Latihan
              </h3>

              <div className="flex flex-wrap gap-2">
                {days.length > 0 ? (
                  days.map((day) => (
                    <button
                      key={day}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold text-emerald-600 transition-all"
                    >
                      {day}
                      <ExternalLink className="w-3 h-3 text-emerald-400" />
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">Belum ada jadwal latihan</span>
                )}
              </div>
            </div>

            {/* Lokasi Latihan */}
            <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                Lokasi Latihan
              </h3>

              <div className="flex flex-wrap gap-2">
                {locations.length > 0 ? (
                  locations.map((loc) => (
                    <span
                      key={loc}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600"
                    >
                      {loc}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">Belum ada lokasi latihan</span>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Performance Summary */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-800">Ringkasan Kinerja Latihan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Tingkat Kehadiran */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between gap-6">
            <div className="flex justify-between items-center">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                +1.8% bln ini
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">Tingkat Kehadiran</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-2">{coach.attendanceRate}%</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div style={{ width: `${coach.attendanceRate}%` }} className="h-full bg-emerald-500 rounded-full"></div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default function CoachProfilePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400 font-bold">Memuat Halaman...</div>}>
      <CoachProfileContent />
    </Suspense>
  );
}
