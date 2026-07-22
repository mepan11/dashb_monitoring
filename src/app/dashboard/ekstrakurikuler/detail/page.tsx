"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRole } from "@/lib/useRole";
import {
  Cpu,
  Users,
  Download,
  UserPlus,
  Pencil,
  Calendar,
  MapPin,
  Mail,
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
  Check,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ParticipationRow {
  id: string;
  name: string;
  className: string;
  nisn: string;
  status: string;
  initials: string;
}

interface AvailableStudent {
  id: string;
  name: string;
  nisn: string;
  className: string | null;
}

interface CoachOption {
  id: string;
  name: string;
}

const LIMIT = 10;

function ExtracurricularDetailContent() {
  const searchParams = useSearchParams();
  const ekskulId = searchParams.get("id") || "1";
  const { isAdmin } = useRole();

  // Data State
  const [ekskulName, setEkskulName] = useState("Ekstrakurikuler...");
  const [category, setCategory] = useState("...");
  const [coachName, setCoachName] = useState("Belum ditentukan");
  const [coachId, setCoachId] = useState<string>("");
  const [schedule, setSchedule] = useState("...");
  const [location, setLocation] = useState("...");
  const [contact, setContact] = useState("...");
  
  const [students, setStudents] = useState<ParticipationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [periodId, setPeriodId] = useState<string>("");

  // Search & Filter & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Coach Edit Modal State
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [coachesList, setCoachesList] = useState<CoachOption[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState("");
  const [savingCoach, setSavingCoach] = useState(false);

  // Student Add Modal State
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [searchAvailable, setSearchAvailable] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedInitialStatus, setSelectedInitialStatus] = useState("Aktif");
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [savingStudent, setSavingStudent] = useState(false);

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

  const fetchDetail = useCallback(async () => {
    if (!periodId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/extracurriculars/${ekskulId}?period_id=${periodId}`);
      const json = await res.json();
      if (json.success) {
        setEkskulName(json.data.name);
        setCategory(json.data.category);
        setCoachName(json.data.coachName || "Belum ditugaskan");
        setCoachId(json.data.coachId ? String(json.data.coachId) : "");
        setSchedule(json.data.schedule);
        setLocation(json.data.location);
        setContact(json.data.contact);
      }
    } catch (err) {
      console.error("Failed to fetch detail:", err);
    } finally {
      setLoading(false);
    }
  }, [ekskulId, periodId]);

  const fetchStudents = useCallback(async () => {
    if (!periodId) return;
    setLoadingStudents(true);
    try {
      const res = await fetch(`/api/extracurriculars/${ekskulId}/students?search=${encodeURIComponent(searchQuery)}&period_id=${periodId}`);
      const json = await res.json();
      if (json.success) {
        setStudents(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoadingStudents(false);
    }
  }, [ekskulId, searchQuery, periodId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail, periodId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, periodId]);

  // Load coaches for dropdown
  useEffect(() => {
    if (!isCoachModalOpen) return;
    async function loadCoaches() {
      try {
        const res = await fetch("/api/coaches");
        const json = await res.json();
        if (json.success) {
          setCoachesList(json.data);
          setSelectedCoachId(coachId);
        }
      } catch (err) {
        console.error("Failed to load coaches:", err);
      }
    }
    loadCoaches();
  }, [isCoachModalOpen, coachId]);

  // Load available students when student modal opens
  useEffect(() => {
    if (!isStudentModalOpen || !periodId) return;
    async function loadAvailable() {
      setLoadingAvailable(true);
      try {
        const res = await fetch(`/api/students/available-ekskul?ekskulId=${ekskulId}&period_id=${periodId}`);
        const json = await res.json();
        if (json.success) {
          setAvailableStudents(json.data);
        }
      } catch (err) {
        console.error("Failed to load available students:", err);
      } finally {
        setLoadingAvailable(false);
      }
    }
    loadAvailable();
  }, [isStudentModalOpen, ekskulId, periodId]);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, periodId]);

  const totalFiltered = students.length;
  const totalPages = Math.ceil(totalFiltered / LIMIT);
  const paginatedStudents = students.slice(
    (currentPage - 1) * LIMIT,
    currentPage * LIMIT
  );

  const handleUpdateCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCoach(true);
    try {
      const res = await fetch(`/api/extracurriculars/${ekskulId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: ekskulName,
          category,
          coachId: selectedCoachId ? Number(selectedCoachId) : null,
          schedule,
          location,
          contact,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        alert("Pelatih utama berhasil diperbarui!");
        setIsCoachModalOpen(false);
        fetchDetail();
      } else {
        alert(json.message || "Gagal memperbarui pelatih");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSavingCoach(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert("Harap pilih siswa terlebih dahulu!");
      return;
    }
    setSavingStudent(true);
    try {
      const res = await fetch(`/api/extracurriculars/${ekskulId}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          status: selectedInitialStatus,
          periodId,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        alert("Siswa berhasil ditambahkan!");
        setIsStudentModalOpen(false);
        setSelectedStudentId("");
        setSearchAvailable("");
        fetchStudents();
        fetchDetail(); // Refresh total count
      } else {
        alert(json.message || "Gagal mendaftarkan siswa");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSavingStudent(false);
    }
  };

  const handleDeleteStudent = async (studentId: string, name: string) => {
    if (!confirm(`Keluarkan "${name}" dari program ekstrakurikuler "${ekskulName}"?`)) return;
    try {
      const res = await fetch(`/api/extracurriculars/${ekskulId}/students?studentId=${studentId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        fetchStudents();
        fetchDetail();
      } else {
        alert(json.message || "Gagal mengeluarkan siswa");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    }
  };

  const filteredAvailable = availableStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchAvailable.toLowerCase()) ||
      s.nisn.includes(searchAvailable)
  );

  const nameParts = coachName.trim().split(" ");
  const coachInitials = nameParts.length >= 2
    ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    : `${nameParts[0][0] || "C"}`.toUpperCase();

  return (
    <div className="flex flex-col gap-8">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center shadow-md">
            <Cpu className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1.5 animate-pulseSlow">
            <h1 className="text-2xl font-extrabold text-slate-800">{ekskulName}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">
                {category}
              </span>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 font-semibold">
                <Users className="w-3.5 h-3.5 text-slate-350" />
                {students.length} Siswa Terdaftar
              </span>
            </div>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3 self-stretch md:self-auto w-full md:w-auto">
          <Button variant="secondary" className="flex-1 md:flex-initial !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm">
            <Download className="w-4 h-4 text-slate-400" />
            Unduh Daftar Siswa
          </Button>
          {isAdmin && (
            <button
              onClick={() => setIsStudentModalOpen(true)}
              className="flex-1 md:flex-initial py-2.5 px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]"
            >
              <UserPlus className="w-4 h-4" />
              Tambah Siswa
            </button>
          )}
        </div>
      </div>

      {/* Main split-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left Column: Pelatih Utama */}
        <div className="w-full lg:w-[320px] bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col gap-6 shrink-0 relative">
          <div className="flex justify-between items-center border-b border-slate-100/50 pb-4">
            <h3 className="text-base font-extrabold text-slate-800">Pelatih Utama</h3>
            {isAdmin && (
              <button
                onClick={() => setIsCoachModalOpen(true)}
                className="p-1.5 text-slate-400 hover:bg-slate-55 hover:text-slate-700 rounded-lg transition-all border border-slate-100"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Coach Avatar/Photo and badge */}
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-blue-50 text-[#2563eb] font-extrabold text-3xl border border-blue-100 shadow-md flex items-center justify-center">
                {coachInitials}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <span className="font-extrabold text-slate-800 text-lg">{coachName}</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                {coachId ? `Coach ID: #RCT-${coachId.padStart(4, "0")}` : "Belum Ditugaskan"}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100/80 pt-4 flex flex-col gap-4.5">
            {/* Jadwal */}
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Jadwal Latihan</span>
                <span className="text-xs font-bold text-slate-700">{schedule}</span>
              </div>
            </div>

            {/* Lokasi */}
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lokasi</span>
                <span className="text-xs font-bold text-slate-700">{location}</span>
              </div>
            </div>

            {/* Kontak */}
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Kontak</span>
                <span className="text-xs font-bold text-slate-700 break-all">{contact}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Daftar Partisipasi Siswa */}
        <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] flex flex-col gap-6 justify-between">
          
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100/50 pb-4">
            <h3 className="text-base font-extrabold text-slate-800">Daftar Partisipasi Siswa</h3>

            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Cari nama atau NISN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#f4f7fc] border border-slate-100/50 rounded-lg text-xs font-semibold text-slate-650 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Nama Siswa</th>
                  <th className="py-4 px-6">Kelas</th>
                  <th className="py-4 px-6">NISN</th>
                  <th className="py-4 px-6">Status</th>
                  {isAdmin && <th className="py-4 px-6 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                {loadingStudents ? (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="py-16 text-center text-slate-400 font-bold">
                      Memuat daftar partisipasi...
                    </td>
                  </tr>
                ) : paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="py-16 text-center text-slate-400 font-bold">
                      Tidak ada siswa terdaftar pada program ini.
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                            {row.initials}
                          </div>
                          <span className="font-bold text-slate-800">{row.name}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-500 font-bold">
                        {row.className}
                      </td>

                      <td className="py-4 px-6 font-mono text-slate-500">
                        {row.nisn}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                            row.status === "Aktif"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : row.status === "Izin"
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : "bg-rose-50 text-rose-600 border border-rose-100"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>

                      {isAdmin && (
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleDeleteStudent(row.id, row.name)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-400">
                Menampilkan {(currentPage - 1) * LIMIT + 1} - {Math.min(currentPage * LIMIT, totalFiltered)} dari {totalFiltered} siswa
              </span>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                      currentPage === idx + 1
                        ? "bg-[#2563eb] text-white shadow-sm"
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* POPUP MODAL: EDIT COACH */}
      {isCoachModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <form
            onSubmit={handleUpdateCoach}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">Ubah Detail Program</h3>
                <p className="text-xs text-slate-400 mt-1">Ubah pembimbing, jadwal, lokasi, dan kontak program</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCoachModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Pelatih (Coach)</label>
                <select
                  value={selectedCoachId}
                  onChange={(e) => setSelectedCoachId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                >
                  <option value="">Belum Ditugaskan</option>
                  {coachesList.map((c) => (
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
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi Latihan</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kontak Penanggung Jawab</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCoachModalOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
              >
                Batalkan
              </button>
              <button
                type="submit"
                disabled={savingCoach}
                className="px-6 py-2.5 bg-[#2563eb] text-white hover:bg-blue-700 rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-60"
              >
                {savingCoach ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* POPUP MODAL: ADD STUDENT */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <form
            onSubmit={handleAddStudent}
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">Daftarkan Murid</h3>
                <p className="text-xs text-slate-400 mt-1">Pilih siswa sekolah untuk dimasukkan ke program ini</p>
              </div>
              <button
                type="button"
                onClick={() => { setIsStudentModalOpen(false); setSelectedStudentId(""); }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search Box */}
            <div className="px-6 py-4 border-b border-slate-100 bg-[#fafbfc]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama atau NISN..."
                  value={searchAvailable}
                  onChange={(e) => setSearchAvailable(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Students List */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2 bg-white">
              {loadingAvailable ? (
                <div className="text-center py-10 text-xs font-bold text-slate-400">
                  Memuat data siswa sekolah...
                </div>
              ) : filteredAvailable.length === 0 ? (
                <div className="text-center py-10 text-xs font-bold text-slate-400">
                  Tidak ada siswa sekolah tersedia untuk didaftarkan.
                </div>
              ) : (
                filteredAvailable.map((student) => {
                  const isSelected = selectedStudentId === student.id;
                  return (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`p-4 rounded-2xl border transition-all flex justify-between items-center cursor-pointer ${
                        isSelected
                          ? "bg-blue-50/70 border-blue-200 shadow-sm"
                          : "bg-white border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-xs font-bold text-slate-800">{student.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">NISN: {student.nisn}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded border border-slate-200">
                            Kelas: {student.className || "-"}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Status Select & Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status Keaktifan:</span>
                <select
                  value={selectedInitialStatus}
                  onChange={(e) => setSelectedInitialStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-bold bg-white text-slate-700"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Izin">Izin</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => { setIsStudentModalOpen(false); setSelectedStudentId(""); }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  disabled={savingStudent || !selectedStudentId}
                  className="px-6 py-2.5 bg-[#2563eb] text-white hover:bg-blue-700 rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-60"
                >
                  {savingStudent ? "Mendaftarkan..." : "Daftarkan Siswa"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function ExtracurricularDetailPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400 font-bold">Memuat Halaman...</div>}>
      <ExtracurricularDetailContent />
    </Suspense>
  );
}
