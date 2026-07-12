"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Calendar, Clock, Info, UserCheck, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AddSubjectPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("Matematika");
  const [teacher, setTeacher] = useState("Drs. Bambang Wijaya");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Senin", "Rabu"]);
  const [startTime, setStartTime] = useState("08:00 AM");
  const [endTime, setEndTime] = useState("09:30 AM");

  const daysList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mata Pelajaran Berhasil Ditambahkan ke Kurikulum!");
    router.push("/dashboard/mapel/detail");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] overflow-hidden">
      {/* Top Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-[#1e293b]">Tambah Mata Pelajaran ke Kelas</h1>
          <p className="text-xs text-slate-400 mt-1">Lengkapi detail kurikulum untuk Kelas 4-C</p>
        </div>
        <Link href="/dashboard/mapel/detail">
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* Form content */}
      <form onSubmit={handleSave} className="p-6 flex flex-col gap-6">
        
        {/* Pilih Mata Pelajaran */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Mata Pelajaran</label>
          <div className="relative">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent appearance-none"
            >
              <option value="Matematika">Matematika</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Ilmu Pengetahuan Alam">Ilmu Pengetahuan Alam</option>
              <option value="Bahasa Inggris">Bahasa Inggris</option>
              <option value="Seni Budaya">Seni Budaya</option>
              <option value="Pendidikan Jasmani">Pendidikan Jasmani</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Pilih Guru Pengajar */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Guru Pengajar</label>
          <div className="relative">
            <select
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent appearance-none"
            >
              <option value="Drs. Bambang Wijaya">Drs. Bambang Wijaya</option>
              <option value="Ibu Sarah Wijaya, M.Pd">Ibu Sarah Wijaya, M.Pd</option>
              <option value="Bpk. Aris Setiawan, S.Pd">Bpk. Aris Setiawan, S.Pd</option>
              <option value="Bpk. Danu Pratama, S.Pd">Bpk. Danu Pratama, S.Pd</option>
              <option value="Coach Hendra">Coach Hendra</option>
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
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
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
                  type="text"
                  placeholder="08:00 AM"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waktu Selesai</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="09:30 AM"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

        </div>

        {/* Tip Box */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4.5 flex gap-3 text-emerald-800">
          <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[10px] font-bold leading-relaxed text-emerald-600">
            Mata pelajaran yang ditambahkan akan secara otomatis terintegrasi dengan laporan capaian belajar dan absensi kelas 4-C.
          </p>
        </div>

        {/* Action Footer */}
        <div className="flex justify-end items-center gap-4 border-t border-slate-100 pt-5 mt-2">
          <Link href="/dashboard/mapel/detail">
            <button
              type="button"
              className="text-xs font-bold text-[#2563eb] hover:underline"
            >
              Batalkan
            </button>
          </Link>
          <button
            type="submit"
            className="py-2.5 px-6 rounded-lg bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            + Tambah ke Kurikulum
          </button>
        </div>

      </form>
    </div>
  );
}

// Simple internal helper component
function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
