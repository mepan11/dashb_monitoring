"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Info, GraduationCap, ChevronDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TeacherOption {
  id: number;
  name: string;
}

export default function TambahKelasPage() {
  const router = useRouter();
  const [className, setClassName] = useState("");
  const [homeroomTeacherId, setHomeroomTeacherId] = useState("");
  const [capacity, setCapacity] = useState(32);

  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [periodId, setPeriodId] = useState("");
  const [periodName, setPeriodName] = useState("Memuat...");

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

  // Fetch data guru & periode setiap kali periodId berubah
  useEffect(() => {
    if (!periodId) return;

    async function fetchTeachersAndPeriod() {
      try {
        const [teachRes, periodRes] = await Promise.all([
          fetch(`/api/teachers?period_id=${periodId}&available_homeroom=true`),
          fetch("/api/periods")
        ]);
        const teachJson = await teachRes.json();
        const periodJson = await periodRes.json();

        if (teachJson.success) {
          setTeachers(teachJson.data);
        }

        if (periodJson.success) {
          const current = periodJson.data.find((p: any) => String(p.id) === String(periodId));
          if (current) {
            setPeriodName(`${current.academic_year} - ${current.semester}`);
          }
        }
      } catch (err) {
        console.error("Failed to fetch page data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeachersAndPeriod();
  }, [periodId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className) {
      alert("Nama kelas wajib diisi!");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className,
          homeroomTeacherId: homeroomTeacherId ? Number(homeroomTeacherId) : null,
          capacity,
          periodId, // Kirim periodId aktif
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Kelas baru berhasil dibuat!");
        router.push("/dashboard/kelas");
      } else {
        alert(data.message || "Gagal membuat kelas");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold">
        Memuat data pengajar...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Tambah Kelas Baru</h1>
          <p className="text-sm text-slate-400 mt-1">
            Lengkapi data kelas di bawah ini untuk mendaftarkan rombongan belajar baru.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3 self-stretch xl:self-auto">
          <Link href="/dashboard/kelas" className="flex-1 xl:flex-initial">
            <Button variant="secondary" className="!py-2.5 !px-5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg w-full">
              Batalkan
            </Button>
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 xl:flex-initial py-2.5 px-6 rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] text-xs font-bold flex items-center justify-center shadow-sm transition-all whitespace-nowrap disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Kelas"}
          </button>
        </div>
      </div>

      {/* Main split-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Left Column Form */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col gap-6 w-full">

          {/* Card 1: Data Rombongan Belajar */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563eb]">
                <GraduationCap className="w-4 h-4" />
              </div>
              1. Detail Rombongan Belajar
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Kelas</label>
              <input
                type="text"
                placeholder="Contoh: Kelas 4-C"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Guru Wali Kelas</label>
                <div className="relative">
                  <select
                    value={homeroomTeacherId}
                    onChange={(e) => setHomeroomTeacherId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm appearance-none"
                  >
                    <option value="">-- Pilih Wali Kelas (Opsional) --</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kapasitas Maksimal</label>
                <input
                  type="number"
                  placeholder="Kapasitas ideal 30/32"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Periode Akademik Aktif</span>
                <span className="text-sm font-bold text-slate-800">{periodName}</span>
              </div>
            </div>
          </div>
        </form>

        {/* Right Column Tips */}
        <div className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0">

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-4">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500" />
              Wali Kelas & Kurikulum
            </h4>
            <ul className="text-[10px] font-semibold text-slate-500 flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                Setiap kelas direkomendasikan memiliki 1 guru wali kelas aktif.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                Nama kelas akan terhubung langsung dengan absensi, nilai, serta pembagian jadwal mata pelajaran.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                Kapasitas rombongan belajar ideal diisi sebanyak 30 hingga 32 siswa.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
