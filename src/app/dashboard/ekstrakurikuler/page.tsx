"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  ArrowRight,
  TrendingUp,
  Calendar,
  ExternalLink,
  Cpu,
  Dumbbell,
  Palette,
  Activity,
  Smile,
  X,
  Trash2,
  Pencil,
} from "lucide-react";
import { useRole } from "@/lib/useRole";

interface ProgramItem {
  id: string;
  name: string;
  coachId: number | null;
  coachName: string | null;
  category: string;
  schedule: string;
  location: string;
  contact: string;
  membersCount: number;
}

interface CoachOption {
  id: string;
  name: string;
}

export default function EkstrakurikulerPage() {
  const { isAdmin } = useRole();
  const [selectedFilter, setSelectedFilter] = useState("Semua");
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [coaches, setCoaches] = useState<CoachOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodId, setPeriodId] = useState<string>("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedId, setSelectedId] = useState("");

  const [ekskulName, setEkskulName] = useState("");
  const [ekskulCategory, setEkskulCategory] = useState("Seni");
  const [ekskulCoachId, setEkskulCoachId] = useState("");
  const [ekskulSchedule, setEkskulSchedule] = useState("");
  const [ekskulLocation, setEkskulLocation] = useState("");
  const [ekskulContact, setEkskulContact] = useState("");

  const [saving, setSaving] = useState(false);

  const filters = ["Semua", "Olahraga", "Seni & Sains"];

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

  async function fetchPrograms(pid: string) {
    if (!pid) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/extracurriculars?period_id=${pid}`);
      const json = await res.json();
      if (json.success) {
        setPrograms(json.data);
      }
    } catch (err) {
      console.error("Failed to load programs:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCoaches() {
    try {
      const res = await fetch("/api/coaches");
      const json = await res.json();
      if (json.success) {
        setCoaches(json.data);
      }
    } catch (err) {
      console.error("Failed to load coaches:", err);
    }
  }

  useEffect(() => {
    if (periodId) {
      fetchPrograms(periodId);
      fetchCoaches();
    }
  }, [periodId]);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setSelectedId("");
    setEkskulName("");
    setEkskulCategory("Seni");
    setEkskulCoachId("");
    setEkskulSchedule("");
    setEkskulLocation("");
    setEkskulContact("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prog: ProgramItem) => {
    setModalMode("edit");
    setSelectedId(prog.id);
    setEkskulName(prog.name);
    setEkskulCategory(prog.category);
    setEkskulCoachId(prog.coachId ? String(prog.coachId) : "");
    setEkskulSchedule(prog.schedule);
    setEkskulLocation(prog.location);
    setEkskulContact(prog.contact);
    setIsModalOpen(true);
  };

  const handleSaveEkskul = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ekskulName || !ekskulCategory || !ekskulSchedule || !ekskulLocation || !ekskulContact) {
      alert("Harap lengkapi semua field yang wajib!");
      return;
    }
    setSaving(true);
    try {
      const url = modalMode === "add" ? "/api/extracurriculars" : `/api/extracurriculars/${selectedId}`;
      const method = modalMode === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: ekskulName,
          category: ekskulCategory,
          coachId: ekskulCoachId ? Number(ekskulCoachId) : null,
          schedule: ekskulSchedule,
          location: ekskulLocation,
          contact: ekskulContact,
          periodId, // Kirim periodId aktif
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        alert(modalMode === "add" ? "Ekstrakurikuler berhasil ditambahkan!" : "Ekstrakurikuler berhasil diperbarui!");
        setIsModalOpen(false);
        fetchPrograms(periodId);
      } else {
        alert(json.message || "Gagal menyimpan data");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEkskul = async (id: string, name: string) => {
    if (!confirm(`Hapus program ekstrakurikuler "${name}"? Seluruh data pendaftaran murid pada program ini juga akan terhapus.`)) return;
    try {
      const res = await fetch(`/api/extracurriculars/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchPrograms(periodId);
      } else {
        alert(json.message || "Gagal menghapus program");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    }
  };

  const filteredPrograms = programs.filter((prog) => {
    if (selectedFilter === "Semua") return true;
    if (selectedFilter === "Olahraga") {
      return prog.category === "Olahraga";
    }
    // Seni & Sains
    return prog.category === "Seni" || prog.category === "Sains & Teknologi" || prog.category === "Sains";
  });

  const getCategoryBadgeStyles = (cat: string) => {
    switch (cat) {
      case "Sains & Teknologi":
      case "Sains":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "Olahraga":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "Seni":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Sains & Teknologi":
      case "Sains":
        return Cpu;
      case "Olahraga":
        return Dumbbell;
      case "Seni":
        return Palette;
      default:
        return Smile;
    }
  };

  const totalMembers = programs.reduce((sum, p) => sum + p.membersCount, 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Katalog Ekstrakurikuler</h1>
          <p className="text-sm text-slate-400 mt-1">
            Temukan dan kelola program minat bakat siswa SD Islam Baiturrachman.
          </p>
        </div>

        {/* Filter Tabs top right */}
        <div className="flex bg-[#f4f7fc] border border-slate-100/50 p-1.5 rounded-xl gap-1.5 shrink-0 self-stretch md:self-auto">
          {filters.map((f) => {
            const isActive = selectedFilter === f;
            return (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${isActive
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold">
            Memuat katalog ekstrakurikuler...
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold">
            Tidak ada program ekstrakurikuler yang ditemukan.
          </div>
        ) : (
          filteredPrograms.map((prog) => {
            const ProgramIcon = getCategoryIcon(prog.category);
            const capacity = 30; // default capacity limit representation
            const progressPercentage = Math.min((prog.membersCount / capacity) * 100, 100);

            return (
              <div
                key={prog.id}
                className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between gap-6 relative group"
              >
                {/* Card Top: Icon & Category & Action Delete */}
                <div className="flex justify-between items-center">
                  <div className={`p-3 rounded-xl border border-slate-100/30 shadow-sm ${prog.category === "Olahraga"
                      ? "bg-blue-50 text-blue-600"
                      : prog.category === "Seni"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}>
                    <ProgramIcon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md ${getCategoryBadgeStyles(prog.category)}`}>
                      {prog.category}
                    </span>
                    {isAdmin && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => handleOpenEditModal(prog)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEkskul(prog.id, prog.name)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title & Coach */}
                <div className="flex flex-col">
                  <h2 className="text-lg font-extrabold text-slate-800">{prog.name}</h2>
                  <span className="text-xs font-semibold text-slate-400 mt-1">
                    Coach: <span className="font-bold text-slate-700">{prog.coachName || "Belum ditugaskan"}</span>
                  </span>
                </div>

                {/* Progress bar and quota label */}
                <div className="flex flex-col gap-2">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div style={{ width: `${progressPercentage}%` }} className="h-full bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400">
                    <span>Kuota: {prog.membersCount}/{capacity} Siswa</span>
                    {progressPercentage >= 100 ? (
                      <span className="text-rose-500 font-bold">Penuh</span>
                    ) : progressPercentage >= 80 ? (
                      <span className="text-amber-500 font-bold">Hampir Penuh</span>
                    ) : (
                      <span className="text-slate-400 font-semibold">{Math.round(progressPercentage)}% Terisi</span>
                    )}
                  </div>
                </div>

                {/* Detail button */}
                <Link href={`/dashboard/ekstrakurikuler/detail?id=${prog.id}`} className="w-full">
                  <span className="w-full py-2.5 px-4 rounded-xl border border-blue-200 text-[#2563eb] hover:bg-blue-50/50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                    Lihat Detail
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            );
          })
        )}

        {/* Add Program Dotted Card */}
        {isAdmin && (
          <div
            onClick={handleOpenAddModal}
            className="bg-[#f4f7fc]/50 border-2 border-dashed border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:bg-[#2563eb]/5 hover:border-blue-300 transition-all min-h-[220px]"
          >
            <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563eb] shadow-sm">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-slate-700">Tambah Program</span>
              <span className="text-xs text-slate-400 font-medium mt-1">Buat kurikulum ekstrakurikuler baru</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom section summary cards (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Card 1: Total Partisipasi (Solid blue) */}
        <div className="bg-[#2563eb] rounded-2xl p-6 text-white shadow-[0_8px_30px_rgb(37,99,235,0.15)] flex flex-col justify-between gap-5 relative overflow-hidden">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-blue-100">Total Partisipasi</span>
            <span className="text-3xl font-extrabold">{loading ? "..." : `${totalMembers} Siswa`}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-blue-100">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% dari semester lalu</span>
          </div>
        </div>

        {/* Card 2: Program Terpopuler (Light blue) */}
        <div className="bg-blue-50 border border-blue-100/50 rounded-2xl p-6 flex flex-col justify-between gap-5 shadow-[0_4px_20px_rgb(0,0,0,0.01)]">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-450">Program Terpopuler</span>
            <span className="text-3xl font-extrabold text-slate-800">
              {loading ? "..." : programs[0]?.name || "Belum ada"}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Memiliki keaktifan dan minat pendaftar terbanyak semester ini.
          </p>
        </div>

        {/* Card 3: Jadwal Terdekat (White) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between gap-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/30 shadow-sm shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">Tahun Ajaran Aktif</span>
              <span className="text-sm font-extrabold text-slate-800 mt-1">Ganjil, 2025/2026</span>
            </div>
          </div>
          <span className="text-xs font-extrabold text-[#2563eb] flex items-center gap-1 cursor-pointer">
            Status Terverifikasi
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* POPUP MODAL: ADD EXTRACURRICULAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all animate-fadeIn">
          <form
            onSubmit={handleSaveEkskul}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">
                  {modalMode === "add" ? "Tambah Program Ekstrakurikuler" : "Edit Program Ekstrakurikuler"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {modalMode === "add" ? "Buat program minat bakat baru untuk siswa" : "Sesuaikan parameter program ekstrakurikuler"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inputs Body */}
            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Program</label>
                <input
                  type="text"
                  placeholder="Contoh: Robotik / Sepak Bola"
                  value={ekskulName}
                  onChange={(e) => setEkskulName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
                <select
                  value={ekskulCategory}
                  onChange={(e) => setEkskulCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                >
                  <option value="Sains & Teknologi">Sains & Teknologi</option>
                  <option value="Sains">Sains</option>
                  <option value="Olahraga">Olahraga</option>
                  <option value="Seni">Seni</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coach Pengajar</label>
                <select
                  value={ekskulCoachId}
                  onChange={(e) => setEkskulCoachId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                >
                  <option value="">Belum Ditugaskan</option>
                  {coaches.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jadwal Latihan</label>
                <input
                  type="text"
                  placeholder="Contoh: Selasa & Kamis, 15:30"
                  value={ekskulSchedule}
                  onChange={(e) => setEkskulSchedule(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi / Tempat Latihan</label>
                <input
                  type="text"
                  placeholder="Contoh: Lapangan Utama / Laboratorium Komputer"
                  value={ekskulLocation}
                  onChange={(e) => setEkskulLocation(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kontak Penanggung Jawab</label>
                <input
                  type="text"
                  placeholder="Contoh: +62 812-3456-7890"
                  value={ekskulContact}
                  onChange={(e) => setEkskulContact(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
              >
                Batalkan
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#2563eb] text-white hover:bg-blue-700 rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan Data"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
