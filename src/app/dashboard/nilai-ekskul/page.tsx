"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Users, Star, ChevronRight } from "lucide-react";

interface EkskulCard {
  id: string;
  name: string;
  category: string;
  coachName: string;
  membersCount: number;
  extracurricularPeriodId: string;
}

export default function NilaiEkskulPage() {
  const [ekskuls, setEkskuls] = useState<EkskulCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodId, setPeriodId] = useState<string>("");
  const [periodName, setPeriodName] = useState<string>("—");

  useEffect(() => {
    const cached = localStorage.getItem("active_period_id") || "";
    setPeriodId(cached);

    const handlePeriodChange = (e: any) => {
      setPeriodId(e.detail.periodId || "");
    };
    window.addEventListener("academic_period_changed", handlePeriodChange);
    return () => window.removeEventListener("academic_period_changed", handlePeriodChange);
  }, []);

  useEffect(() => {
    async function fetchEkskuls() {
      try {
        setLoading(true);
        const userStr = localStorage.getItem("user");
        let coachEmailParam = "";
        if (userStr) {
          const u = JSON.parse(userStr);
          if (u.role === "coach" && u.email) {
            coachEmailParam = `&coach_email=${encodeURIComponent(u.email)}`;
          }
        }

        const url = periodId
          ? `/api/extracurriculars?period_id=${periodId}${coachEmailParam}&t=${Date.now()}`
          : `/api/extracurriculars?${coachEmailParam ? coachEmailParam.slice(1) + "&" : ""}t=${Date.now()}`;

        const res = await fetch(url);
        const json = await res.json();

        if (json.success) {
          const formatted: EkskulCard[] = json.data.map((e: any) => {
            if (e.academic_year || e.semester) {
              setPeriodName(`TA ${e.academic_year || ""} - ${e.semester || ""}`);
            }
            return {
              id: String(e.id),
              name: e.name,
              category: e.category || "Umum",
              coachName: e.coachName || "Belum Ditugaskan",
              membersCount: e.membersCount || 0,
              extracurricularPeriodId: String(e.extracurricularPeriodId || e.id),
            };
          });
          setEkskuls(formatted);
        }
      } catch (err) {
        console.error("Failed to load ekskuls:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEkskuls();
  }, [periodId]);

  // Fetch period name
  useEffect(() => {
    fetch(`/api/periods?t=${Date.now()}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) {
          let matched = null;
          if (periodId) {
            matched = j.data.find((p: any) => String(p.id) === String(periodId));
          } else {
            matched = j.data.find((p: any) => p.is_active || p.isActive);
          }
          if (matched) {
            setPeriodName(`TA ${matched.academic_year || matched.academicYear} - ${matched.semester}`);
          }
        }
      })
      .catch(() => {});
  }, [periodId]);

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    Olahraga:  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
    Seni:      { bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-100" },
    Akademik:  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-100" },
    Religi:    { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-100" },
    default:   { bg: "bg-slate-50",   text: "text-slate-700",   border: "border-slate-100" },
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Nilai Ekstrakurikuler</h1>
          <p className="text-sm text-slate-400 mt-1">
            Pilih ekstrakurikuler untuk mengelola nilai siswa pada periode{" "}
            <strong className="text-slate-800 font-extrabold">{periodName}</strong>.
          </p>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Memuat daftar ekstrakurikuler...
          </div>
        ) : ekskuls.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold">
            Belum ada ekstrakurikuler terdaftar untuk periode ini.
          </div>
        ) : (
          ekskuls.map((ekskul) => {
            const colorSet = categoryColors[ekskul.category] || categoryColors["default"];
            const initials = ekskul.name
              .split(" ")
              .slice(0, 2)
              .map((w: string) => w[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={ekskul.id}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_25px_rgb(0,0,0,0.01)] flex flex-col gap-6 justify-between relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                {/* Top Row */}
                <div className="flex justify-between items-start">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#2563eb] font-extrabold text-sm flex items-center justify-center border border-blue-100">
                    {initials}
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#2563eb]/5 rounded-bl-full pointer-events-none"></div>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-3">
                  <h2 className="text-base font-extrabold text-slate-800 leading-tight">{ekskul.name}</h2>

                  <span className={`self-start text-[10px] font-bold px-2.5 py-1 rounded-lg border ${colorSet.bg} ${colorSet.text} ${colorSet.border}`}>
                    {ekskul.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[10px] font-bold text-slate-400 truncate">
                      Coach: {ekskul.coachName}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-500">
                  <div className="flex justify-between">
                    <span>Jumlah Anggota:</span>
                    <span className="text-slate-800">{ekskul.membersCount} Siswa</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="border-t border-slate-100/80 pt-4 mt-2">
                  <Link href={`/dashboard/nilai-ekskul/lihat?ep_id=${ekskul.extracurricularPeriodId}`}>
                    <span className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-[10px] shadow-sm transition-all cursor-pointer w-full">
                      Kelola Nilai
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
