"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SlidersHorizontal, Calendar, Layers, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/lib/useRole";

interface GradeClassCard {
  id: string;
  classCode: string;
  className: string;
  homeroomTeacher: string;
  teacherInitials: string;
  studentsCount: number;
  belowKkmCount?: number;
}

export default function NilaiPage() {
  const { role } = useRole();
  const [classes, setClasses] = useState<GradeClassCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodId, setPeriodId] = useState<string>("");
  const [periodName, setPeriodName] = useState<string>("—");

  // Mendengarkan perubahan periode akademik dari topbar
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
    async function fetchClasses() {
      try {
        setLoading(true);
        const userStr = localStorage.getItem("user");
        let teacherEmailParam = "";
        if (userStr) {
          const u = JSON.parse(userStr);
          if (u.role === "guru" && u.email) {
            teacherEmailParam = `&teacher_email=${encodeURIComponent(u.email)}`;
          }
        }
        const res = await fetch(`/api/classes?period_id=${periodId}${teacherEmailParam}`);
        const json = await res.json();
        
        if (json.success) {
          const formatted = await Promise.all(json.data.map(async (c: any) => {
            // Generate initials for teacher
            const nameParts = (c.homeroomTeacher || "Wali Kelas").trim().split(" ");
            const initials = nameParts.length >= 2
              ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
              : `${nameParts[0][0] || "W"}`.toUpperCase();

            // Extract code (e.g. "Kelas 4-C" -> "4C")
            const codeMatch = c.name.match(/\d+-\w+/);
            const classCode = codeMatch ? codeMatch[0].replace("-", "") : "K";

            // Fetch statistics untuk kelas ini berdasarkan periode aktif
            let belowKkmCount = 0;
            if (periodId) {
              try {
                const gradeRes = await fetch(`/api/grades?class_id=${c.id}&period_id=${periodId}`);
                const gradeJson = await gradeRes.json();
                if (gradeJson.success) {
                  belowKkmCount = gradeJson.stats.belowKKM || 0;
                  setPeriodName(gradeJson.stats.periodName || "—");
                }
              } catch (e) {
                console.error("Gagal memuat detail nilai kelas:", e);
              }
            }

            return {
              id: String(c.id),
              classCode,
              className: c.name,
              homeroomTeacher: c.homeroomTeacher || "Belum Ditugaskan",
              teacherInitials: initials,
              studentsCount: c.studentsCount || 0,
              belowKkmCount,
            };
          }));
          setClasses(formatted);
        }
      } catch (err) {
        console.error("Failed to load classes for grades:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, [periodId]);

  return (
    <div className="flex flex-col gap-8">

      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Manajemen Nilai: Pilih Kelas</h1>
          <p className="text-sm text-slate-400 mt-1">
            Pilih kelas untuk mengelola nilai siswa secara detail pada periode <strong className="text-slate-800 font-extrabold">{periodName}</strong>.
          </p>
        </div>
      </div>

      {/* Grid of Class Grade Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Memuat daftar kelas...
          </div>
        ) : classes.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold">
            Belum ada kelas terdaftar.
          </div>
        ) : (
          classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_25px_rgb(0,0,0,0.01)] flex flex-col gap-6 justify-between relative overflow-hidden"
            >
              {/* Top row: Code badge & card design element */}
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563eb] font-extrabold text-sm flex items-center justify-center border border-blue-100/55">
                  {cls.classCode}
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#2563eb]/5 rounded-bl-full pointer-events-none"></div>
              </div>

              {/* Title & Homeroom teacher */}
              <div className="flex flex-col gap-3">
                <h2 className="text-base font-extrabold text-slate-800">
                  {cls.className}
                </h2>

                <div className="flex items-center gap-2.5">
                  {/* Initials Avatar */}
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-[9px] flex items-center justify-center border border-slate-200 shrink-0">
                    {cls.teacherInitials}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 leading-tight">
                    Wali: {cls.homeroomTeacher}
                  </span>
                </div>
              </div>

              {/* Status Info / Statistics */}
              <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-500">
                <div className="flex justify-between">
                  <span>Jumlah Siswa:</span>
                  <span className="text-slate-800">{cls.studentsCount} Siswa</span>
                </div>
                <div className="flex justify-between">
                  <span>Di Bawah KKM (75):</span>
                  <span className={cls.belowKkmCount && cls.belowKkmCount > 0 ? "text-rose-600" : "text-emerald-600"}>
                    {cls.belowKkmCount || 0} Siswa
                  </span>
                </div>
              </div>

              {/* Footer row: Button */}
              <div className="flex justify-end border-t border-slate-100/80 pt-4 mt-2">
                <Link href={`/dashboard/nilai/lihat?class_id=${cls.id}`}>
                  <span className="py-2.5 px-4 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-[10px] shadow-sm transition-all cursor-pointer block text-center w-full">
                    Lihat Nilai
                  </span>
                </Link>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
