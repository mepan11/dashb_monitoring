"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Calendar, Clock, Info, UserCheck, ChevronDown } from "lucide-react";

interface SubjectOption {
  id: number;
  name: string;
  code: string;
}

interface TeacherOption {
  id: number;
  name: string;
}

function EditSubjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get("class_id") || "1";
  const subjectId = searchParams.get("subject_id") || "1";

  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectId);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Senin"]);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:30");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function initOptions() {
      setLoading(true);
      try {
        const [subRes, teachRes, currRes] = await Promise.all([
          fetch("/api/subjects"),
          fetch("/api/teachers"),
          fetch(`/api/classes/${classId}/subjects`),
        ]);
        const subJson = await subRes.json();
        const teachJson = await teachRes.json();
        const currJson = await currRes.json();

        if (subJson.success) setSubjects(subJson.data);
        if (teachJson.success) setTeachers(teachJson.data);
        
        if (currJson.success && currJson.data) {
          const currentMapping = currJson.data.find((d: any) => String(d.id) === String(subjectId));
          if (currentMapping) {
            setSelectedSubjectId(String(currentMapping.id));
            setSelectedTeacherId(String(currentMapping.teacherId || ""));
            setSelectedDays(currentMapping.scheduleDays || ["Senin"]);
            setStartTime(currentMapping.startTime || "08:00");
            setEndTime(currentMapping.endTime || "09:30");
          }
        }
      } catch (err) {
        console.error("Failed to load options:", err);
      } finally {
        setLoading(false);
      }
    }
    initOptions();
  }, [classId, subjectId]);

  const daysList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !selectedTeacherId) {
      alert("Harap pilih mata pelajaran dan guru pengajar!");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/classes/${classId}/subjects`, {
        method: "POST", // POST handler handles upsert via INSERT ON DUPLICATE KEY UPDATE
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: selectedSubjectId,
          teacherId: selectedTeacherId,
          scheduleDays: selectedDays,
          startTime,
          endTime,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        alert("Perubahan Mata Pelajaran Berhasil Disimpan!");
        router.push(`/dashboard/mapel/detail?class_id=${classId}`);
      } else {
        alert(json.message || "Gagal menyimpan perubahan");
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
        Memuat data kurikulum...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] overflow-hidden">
      {/* Top Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-[#1e293b]">Edit Mata Pelajaran</h1>
          <p className="text-xs text-slate-400 mt-1">Perbarui detail kurikulum kelas terpilih</p>
        </div>
        <Link href={`/dashboard/mapel/detail?class_id=${classId}`}>
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* Form content */}
      <form onSubmit={handleSave} className="p-6 flex flex-col gap-6">
        
        {/* Pilih Mata Pelajaran (Disabled in Edit Mode to maintain unique mapping constraint) */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mata Pelajaran</label>
          <div className="relative">
            <select
              value={selectedSubjectId}
              disabled
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-400 text-xs font-semibold focus:outline-none appearance-none cursor-not-allowed"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Pilih Guru Pengajar */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Guru Pengajar</label>
          <div className="relative">
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent appearance-none"
            >
              <option value="">-- Pilih Guru Pengajar --</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <UserCheck className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Weekly Schedule Panel Box */}
        <div className="bg-[#f4f7fc]/50 border border-[#f4f7fc] rounded-2xl p-5 flex flex-col gap-5">
          <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2563eb]" />
            Pengaturan Jadwal Mingguan
          </h3>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih Hari</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {daysList.map((day) => {
                const isActive = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                      isActive
                        ? "bg-[#2563eb] text-white border-[#2563eb] shadow-sm"
                        : "bg-white text-slate-505 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waktu Mulai</span>
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waktu Selesai</span>
              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tip Box */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4.5 flex gap-3 text-emerald-800">
          <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[10px] font-bold leading-relaxed text-emerald-600">
            Perubahan jadwal mata pelajaran akan secara otomatis terintegrasi dengan laporan capaian belajar dan absensi kelas.
          </p>
        </div>

        {/* Action Footer */}
        <div className="flex justify-end items-center gap-4 border-t border-slate-100 pt-5 mt-2">
          <Link href={`/dashboard/mapel/detail?class_id=${classId}`}>
            <span className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer">
              Batalkan
            </span>
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="py-2.5 px-6 rounded-lg bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default function EditSubjectPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400 font-bold">Memuat Halaman...</div>}>
      <EditSubjectContent />
    </Suspense>
  );
}
