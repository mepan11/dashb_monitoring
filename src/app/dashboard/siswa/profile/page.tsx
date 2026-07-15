"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Trash2,
  Printer,
  Pencil,
  User,
  GraduationCap,
  Star,
  Camera,
} from "lucide-react";

interface Grade {
  subject_name: string | null;
  daily_assignment: number | null;
  uts: number | null;
  uas: number | null;
  average: number | null;
}

interface Student {
  id: string;
  name: string;
  genderText: string;
  genderCode: string;
  nisn: string;
  classLabel: string;
  status: string;
  initials: string;
  attendanceRate: number | null;
  grades: Grade[];
  homeroomTeacher: string | null;
  academicYear: string;
}

function StudentProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "1";

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodId, setPeriodId] = useState<string>("");

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
    async function fetchStudent() {
      setLoading(true);
      try {
        const res = await fetch(`/api/students/${id}?period_id=${periodId}`);
        const json = await res.json();
        if (json.success) {
          setStudent(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch student:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [id, periodId]);

  const handleDelete = async () => {
    if (!student) return;
    if (!confirm(`Hapus data siswa "${student.name}"?`)) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        alert("Data siswa berhasil dihapus");
        router.push("/dashboard/siswa");
      } else {
        alert(json.message || "Gagal menghapus data");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold">
        Memuat data siswa...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold">
        Siswa tidak ditemukan.{" "}
        <Link href="/dashboard/siswa" className="text-blue-500 underline">
          Kembali
        </Link>
      </div>
    );
  }

  // Attendance circle
  const rate = student.attendanceRate ?? 0;
  const circumference = 2 * Math.PI * 46; // r=46
  const offset = circumference - (rate / 100) * circumference;
  const attendanceLabel =
    rate >= 90 ? "Sangat Baik" : rate >= 75 ? "Baik" : rate >= 60 ? "Cukup" : "Perlu Perhatian";

  // Average grade
  const validGrades = student.grades.filter((g) => g.average !== null);
  const avgGrade =
    validGrades.length > 0
      ? (validGrades.reduce((sum, g) => sum + (g.average || 0), 0) / validGrades.length).toFixed(1)
      : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Top Student Overview Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className={`w-20 h-20 rounded-2xl border shadow-md flex items-center justify-center font-extrabold text-xl ${
              student.genderCode === "P"
                ? "bg-pink-50 text-pink-600 border-pink-100"
                : "bg-blue-50 text-[#2563eb] border-blue-100"
            }`}>
              {student.initials}
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 bg-[#2563eb] text-white p-1.5 rounded-lg border-2 border-white shadow-sm hover:bg-blue-700 transition-all">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-extrabold text-slate-800">{student.name}</h1>
            <span className="text-xs font-bold text-blue-600">NISN: {student.nisn}</span>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                student.status === "Aktif"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-slate-50 text-slate-500 border-slate-100"
              }`}>
                <span className={`w-1 h-1 rounded-full ${student.status === "Aktif" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                {student.status}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                Tahun Ajaran {student.academicYear}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 self-stretch md:self-auto w-full md:w-auto">
          <button
            onClick={handleDelete}
            className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-100/50 text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </button>
          <button className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
            <Printer className="w-3.5 h-3.5" />
            Cetak
          </button>
          <Link href={`/dashboard/siswa/edit?id=${student.id}`} className="flex-1 md:flex-initial">
            <button className="w-full py-2.5 px-4 rounded-xl bg-[#2563eb] text-white hover:bg-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm">
              <Pencil className="w-3.5 h-3.5" />
              Edit Profil
            </button>
          </Link>
        </div>
      </div>

      {/* Two columns: Info & Akademik */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">

        {/* Left Card: Informasi Pribadi */}
        <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col gap-6">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100/50 pb-4">
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563eb]">
              <User className="w-4 h-4" />
            </div>
            Informasi Pribadi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Jenis Kelamin</span>
              <span className="text-xs font-semibold text-slate-700 mt-1">{student.genderText}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Kode Gender</span>
              <span className="text-xs font-semibold text-slate-700 mt-1">{student.genderCode}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">NISN</span>
              <span className="text-xs font-semibold text-slate-700 mt-1 font-mono">{student.nisn}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Status</span>
              <span className="text-xs font-semibold text-slate-700 mt-1">{student.status}</span>
            </div>
          </div>
        </div>

        {/* Right Card: Akademik */}
        <div className="w-full lg:w-[380px] bg-[#2563eb] rounded-3xl p-6 text-white shadow-[0_8px_30px_rgb(37,99,235,0.15)] flex flex-col justify-between gap-6 shrink-0">
          <h3 className="text-sm font-bold flex items-center gap-2 border-b border-white/10 pb-4 text-blue-50">
            <GraduationCap className="w-5 h-5 text-blue-100" />
            Akademik
          </h3>

          <div className="flex flex-col gap-4">
            {/* Kelas */}
            <div className="bg-white/10 border border-white/5 rounded-2xl p-4 flex flex-col gap-1 shadow-inner">
              <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Kelas Saat Ini</span>
              <span className="text-lg font-extrabold">{student.classLabel}</span>
            </div>

            {/* Wali Kelas */}
            <div className="bg-white/10 border border-white/5 rounded-2xl p-4 flex items-center gap-3 shadow-inner">
              <div className="w-10 h-10 rounded-full bg-white/10 text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                {student.homeroomTeacher
                  ? student.homeroomTeacher.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()
                  : "—"}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Wali Kelas</span>
                <span className="text-xs font-extrabold">
                  {student.homeroomTeacher || "Belum ditentukan"}
                </span>
              </div>
            </div>
          </div>

          <Link href="/dashboard/kelas">
            <button className="w-full py-3 bg-white text-[#2563eb] font-bold text-xs rounded-xl shadow hover:bg-slate-50 transition-all">
              Lihat Jadwal Kelas
            </button>
          </Link>
        </div>

      </div>

      {/* Bottom Row: Kehadiran & Rangkuman Nilai */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">

        {/* Attendance Card */}
        <div className="w-full lg:w-[240px] bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center gap-4 shrink-0 text-center">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Kehadiran</span>

          {student.attendanceRate !== null ? (
            <>
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="46" className="stroke-slate-100" strokeWidth="10" fill="transparent" />
                  <circle
                    cx="56" cy="56" r="46"
                    className="stroke-emerald-500"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xl font-extrabold text-slate-800">{rate}%</span>
              </div>
              <span className={`text-xs font-extrabold mt-1 ${
                rate >= 90 ? "text-emerald-600" : rate >= 75 ? "text-blue-600" : "text-orange-500"
              }`}>
                {attendanceLabel}
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 text-2xl font-bold">—</div>
              <span className="text-[10px] text-slate-400 font-semibold">Belum ada data kehadiran</span>
            </div>
          )}
        </div>

        {/* Grades Card */}
        <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col gap-6 justify-between">
          <div className="flex justify-between items-center border-b border-slate-100/50 pb-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-500" />
              Rangkuman Nilai
            </h3>
            <span className="text-[10px] font-extrabold px-3 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
              {avgGrade !== null ? `Rata-rata: ${avgGrade}` : "Belum ada nilai"}
            </span>
          </div>

          {student.grades.length > 0 ? (
            <div className="flex flex-col gap-5">
              {student.grades.map((g, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>{g.subject_name || "Mata Pelajaran"}</span>
                    <span className="text-emerald-600">{g.average ?? "—"}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      style={{ width: `${g.average ?? 0}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <div className="p-3 rounded-full bg-slate-50 text-slate-300">
                <Star className="w-6 h-6" />
              </div>
              <span className="text-xs text-slate-400 font-semibold">Belum ada data nilai untuk siswa ini.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function StudentProfilePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400 font-bold">Memuat Halaman...</div>}>
      <StudentProfileContent />
    </Suspense>
  );
}
