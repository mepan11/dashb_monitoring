"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  CheckCircle2,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PeriodItem {
  id: number;
  academicYear: string;
  semester: string;
  isActive: number;
  createdAt: string;
}

export default function PeriodeAkademikPage() {
  const [periods, setPeriods] = useState<PeriodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("Ganjil");
  const [isActive, setIsActive] = useState(false);

  async function fetchPeriods() {
    setLoading(true);
    try {
      const res = await fetch("/api/periods");
      const json = await res.json();
      if (json.success) {
        setPeriods(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch academic periods:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPeriods();
  }, []);

  const handleOpenAdd = () => {
    setModalMode("add");
    setSelectedId(null);
    setAcademicYear("");
    setSemester("Ganjil");
    setIsActive(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (period: PeriodItem) => {
    setModalMode("edit");
    setSelectedId(period.id);
    setAcademicYear(period.academicYear);
    setSemester(period.semester);
    setIsActive(period.isActive === 1);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!academicYear) {
      alert("Tahun ajaran wajib diisi!");
      return;
    }

    // Validasi format Tahun Ajaran (misal: 2024/2025)
    const yearPattern = /^\d{4}\/\d{4}$/;
    if (!yearPattern.test(academicYear)) {
      alert("Format Tahun Ajaran harus YYYY/YYYY (contoh: 2024/2025)!");
      return;
    }

    setSaving(true);
    try {
      const url = modalMode === "add" ? "/api/periods" : `/api/periods/${selectedId}`;
      const method = modalMode === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academicYear,
          semester,
          isActive: isActive ? 1 : 0,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        alert(modalMode === "add" ? "Periode akademik berhasil ditambahkan!" : "Periode akademik berhasil diperbarui!");
        
        // Kirim event list terupdate ke Header
        window.dispatchEvent(new CustomEvent("academic_periods_updated"));

        // Jika periode diset aktif, update localStorage dan kirim event perubahan periode global
        if (isActive) {
          const activeId = modalMode === "add" ? json.id : selectedId;
          if (activeId) {
            localStorage.setItem("active_period_id", String(activeId));
            window.dispatchEvent(
              new CustomEvent("academic_period_changed", {
                detail: { periodId: String(activeId) },
              })
            );
          }
        }
        
        setIsModalOpen(false);
        fetchPeriods();
      } else {
        alert(json.message || "Gagal menyimpan periode akademik");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  };

  const handleSetActive = async (period: PeriodItem) => {
    if (period.isActive === 1) return;
    if (!confirm(`Aktifkan periode akademik "${period.academicYear} - ${period.semester}"? Semua halaman dan relasi data akan beralih ke periode ini.`)) return;

    try {
      const res = await fetch(`/api/periods/${period.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academicYear: period.academicYear,
          semester: period.semester,
          isActive: 1,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        // Simpan ke localStorage & infokan ke Header/menu lainnya
        localStorage.setItem("active_period_id", String(period.id));
        window.dispatchEvent(
          new CustomEvent("academic_period_changed", {
            detail: { periodId: String(period.id) },
          })
        );
        // Kirim event list terupdate ke Header
        window.dispatchEvent(new CustomEvent("academic_periods_updated"));
        
        fetchPeriods();
      } else {
        alert(json.message || "Gagal mengaktifkan periode");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    }
  };

  const handleDelete = async (period: PeriodItem) => {
    if (period.isActive === 1) {
      alert("Periode akademik yang sedang aktif tidak dapat dihapus!");
      return;
    }
    if (!confirm(`Hapus periode akademik "${period.academicYear} - ${period.semester}"? Pengecekan keamanan database akan dilakukan.`)) return;

    try {
      const res = await fetch(`/api/periods/${period.id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (res.ok && json.success) {
        alert("Periode akademik berhasil dihapus!");
        // Kirim event list terupdate ke Header
        window.dispatchEvent(new CustomEvent("academic_periods_updated"));
        
        fetchPeriods();
      } else {
        alert(json.message || "Gagal menghapus periode");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Periode Akademik</h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola data Tahun Ajaran dan Semester aktif sekolah untuk seluruh sistem monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleOpenAdd}
            className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]"
          >
            <Plus className="w-4 h-4" />
            Tambah Periode Baru
          </Button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column: List table */}
        <div className="flex-1 w-full bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-bold">
              Memuat data periode akademik...
            </div>
          ) : periods.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-bold">
              Belum ada data periode akademik. Silakan tambahkan baru.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-[#f8fafc]">
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun Ajaran</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Semester</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {periods.map((period) => (
                    <tr key={period.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all">
                      <td className="py-4 px-6 text-sm font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-blue-500" />
                          {period.academicYear}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600 font-medium text-center">
                        {period.semester}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {period.isActive === 1 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-400 border border-slate-100">
                            <XCircle className="w-3.5 h-3.5" />
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {period.isActive !== 1 && (
                            <button
                              onClick={() => handleSetActive(period)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded border border-emerald-100 hover:bg-emerald-100 transition-all"
                            >
                              Aktifkan
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(period)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Periode"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(period)}
                            disabled={period.isActive === 1}
                            className={`p-2 rounded-lg transition-all ${
                              period.isActive === 1
                                ? "text-slate-200 cursor-not-allowed"
                                : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                            }`}
                            title="Hapus Periode"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Tips & Info */}
        <div className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-4">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500" />
              Peraturan Bisnis Core
            </h4>
            <ul className="text-[10px] font-semibold text-slate-500 flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                Hanya diperbolehkan **1 periode akademik** yang berstatus **Aktif** di seluruh sistem.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                Mengubah periode akademik aktif akan mengalihkan penyaringan data kelas, mapel, siswa, nilai, dan absensi secara instan di semua menu dashboard.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                Sistem melarang penghapusan periode akademik yang telah memiliki data relasi untuk menghindari kerusakan/kebocoran integritas database.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md p-6 shadow-xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Title */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {modalMode === "add" ? "Tambah Periode Akademik" : "Edit Periode Akademik"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-50 rounded-lg"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Tahun Ajaran</label>
                <input
                  type="text"
                  placeholder="Contoh: 2024/2025"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-[#f8fafc] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium"
                />
                <span className="text-[10px] text-slate-400">Harus berformat YYYY/YYYY (contoh: 2023/2024).</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-[#f8fafc] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>

              <div className="flex items-center gap-2.5 py-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-bold text-slate-600 select-none cursor-pointer">
                  Set Periode Akademik sebagai Aktif
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Periode"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
