"use client";

import React, { useEffect, useState } from "react";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AcademicPeriod {
  id: number;
  academic_year: string;
  semester: string;
  is_active: boolean;
  academicYear?: string;
  isActive?: boolean;
}

export const Header: React.FC = () => {
  const [periods, setPeriods] = useState<AcademicPeriod[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClose = () => setIsDropdownOpen(false);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [isDropdownOpen]);

  useEffect(() => {
    async function fetchPeriods() {
      try {
        const res = await fetch("/api/periods");
        const json = await res.json();
        if (json.success) {
          setPeriods(json.data);
          
          // Cari periode aktif dari DB
          const active = json.data.find((p: AcademicPeriod) => p.is_active || p.isActive);
          
          // Cek apakah sudah ada pilihan di localStorage
          const cached = localStorage.getItem("active_period_id");
          let resolvedId = "";

          if (cached) {
            setSelectedPeriodId(cached);
            resolvedId = cached;
          } else if (active) {
            setSelectedPeriodId(String(active.id));
            localStorage.setItem("active_period_id", String(active.id));
            resolvedId = String(active.id);
          } else if (json.data.length > 0) {
            setSelectedPeriodId(String(json.data[0].id));
            localStorage.setItem("active_period_id", String(json.data[0].id));
            resolvedId = String(json.data[0].id);
          }

          if (resolvedId) {
            const event = new CustomEvent("academic_period_changed", { detail: { periodId: resolvedId } });
            window.dispatchEvent(event);
          }
        }
      } catch (err) {
        console.error("Failed to load periods in Header:", err);
      }
    }
    fetchPeriods();

    // Jalankan sinkronisasi realtime saat active_period_id diset aktif dari halaman lain
    const handlePeriodChange = (e: any) => {
      if (e.detail && e.detail.periodId) {
        setSelectedPeriodId(String(e.detail.periodId));
      }
    };

    // Jalankan fetch ulang daftar periode jika ada penambahan/perubahan list periode
    const handlePeriodsUpdated = () => {
      fetchPeriods();
    };

    window.addEventListener("academic_period_changed", handlePeriodChange);
    window.addEventListener("academic_periods_updated", handlePeriodsUpdated);

    return () => {
      window.removeEventListener("academic_period_changed", handlePeriodChange);
      window.removeEventListener("academic_periods_updated", handlePeriodsUpdated);
    };
  }, []);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPeriodId(val);
    localStorage.setItem("active_period_id", val);
    
    // Pemicu custom event agar komponen/halaman lain tahu periode diubah
    const event = new CustomEvent("academic_period_changed", { detail: { periodId: val } });
    window.dispatchEvent(event);
  };

  return (
    <header className="h-16 border-b border-slate-200/50 px-8 flex items-center justify-between bg-white shrink-0">
      {/* Search Input */}
      <div className="relative w-80">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </span>
        <input
          type="text"
          placeholder="Cari data siswa, guru, atau laporan..."
          className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-100 bg-[#f4f7fc] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent transition-all"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Dropdown Periode Akademik */}
        <div className="flex items-center gap-2 border border-slate-200 bg-[#f8fafc] px-3 py-1.5 rounded-xl">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <select
            value={selectedPeriodId}
            onChange={handlePeriodChange}
            className="text-xs font-bold text-slate-700 bg-transparent border-none outline-none cursor-pointer focus:ring-0"
          >
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                TA {p.academic_year} - {p.semester}
              </option>
            ))}
          </select>
        </div>

        {/* Portal Sekolah Button */}
        <Button
          variant="secondary"
          className="!py-1.5 !px-4 !w-auto text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 border-none font-semibold rounded-lg focus:ring-blue-200"
        >
          Portal Sekolah
        </Button>

      </div>
    </header>
  );
};
