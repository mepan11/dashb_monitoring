"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Info, GraduationCap, ChevronDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TeacherOption {
  id: number;
  name: string;
}

function EditKelasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "1";

  const [className, setClassName] = useState("");
  const [homeroomTeacherId, setHomeroomTeacherId] = useState("");
  const [capacity, setCapacity] = useState(32);
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [semester, setSemester] = useState("Ganjil");

  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [teachRes, classRes] = await Promise.all([
          fetch("/api/teachers"),
          fetch(`/api/classes/${id}`),
        ]);
        const teachJson = await teachRes.json();
        const classJson = await classRes.json();

        if (teachJson.success) setTeachers(teachJson.data);
        if (classJson.success && classJson.data) {
          const c = classJson.data;
          setClassName(c.className);
          setHomeroomTeacherId(c.homeroomTeacherId ? String(c.homeroomTeacherId) : "");
          setCapacity(c.capacity);
          setAcademicYear(c.academicYear);
          setSemester(c.semester);
        }
      } catch (err) {
        console.error("Failed to load edit kelas data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className) {
      alert("Nama kelas wajib diisi!");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`/api/classes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className,
          homeroomTeacherId: homeroomTeacherId ? Number(homeroomTeacherId) : null,
          capacity,
          academicYear,
          semester,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Perubahan kelas berhasil disimpan!");
        router.push("/dashboard/kelas");
      } else {
        alert(data.message || "Gagal menyimpan perubahan");
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
        Memuat data kelas...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Edit Data Kelas</h1>
          <p className="text-sm text-slate-400 mt-1">
            Ubah informasi rombongan belajar di bawah ini.
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
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
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

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun Ajaran</label>
                <input
                  type="text"
                  placeholder="2025/2026"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
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

export default function EditKelasPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400 font-bold">Memuat Halaman...</div>}>
      <EditKelasContent />
    </Suspense>
  );
}
