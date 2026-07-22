"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Users, Calendar, ArrowRight, Plus, Pencil, Trash2, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/lib/useRole";

interface SubjectClassCard {
  id: string;
  className: string;
  subjectsCount: number;
  syllabusCompleteness: number;
}

interface MasterSubject {
  id: string;
  name: string;
  code: string;
  description: string;
}

const LIMIT = 10;

export default function MapelPage() {
  const { isAdmin, isReadOnly } = useRole();
  const [activeTab, setActiveTab] = useState<"master" | "class">("master");
  const [periodId, setPeriodId] = useState<string>("");
  
  // Class Tab State
  const [selectedFilter, setSelectedFilter] = useState("Semua");
  const [classes, setClasses] = useState<SubjectClassCard[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Master Tab State
  const [subjects, setSubjects] = useState<MasterSubject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [searchDesc, setSearchDesc] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Assignments Modal State
  const [isAssignmentsModalOpen, setIsAssignmentsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<MasterSubject | null>(null);
  const [classSubjects, setClassSubjects] = useState<any[]>([]);
  const [allAssignments, setAllAssignments] = useState<any[]>([]);
  const [selectedClassSubjectId, setSelectedClassSubjectId] = useState("");
  
  // Assignment Inputs
  const [newAssignmentName, setNewAssignmentName] = useState("");
  const [newAssignmentDesc, setNewAssignmentDesc] = useState("");
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [savingAssignment, setSavingAssignment] = useState(false);

  const handleOpenAssignmentsModal = async (subj: MasterSubject) => {
    setSelectedSubject(subj);
    setIsAssignmentsModalOpen(true);
    setLoadingAssignments(true);
    setNewAssignmentName("");
    setNewAssignmentDesc("");
    setEditingAssignmentId(null);
    try {
      const res = await fetch(`/api/assignments?subject_id=${subj.id}`);
      const json = await res.json();
      if (json.success) {
        setAllAssignments(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !newAssignmentName) return;
    setSavingAssignment(true);
    try {
      if (editingAssignmentId) {
        // Edit mode
        const res = await fetch(`/api/assignments/${editingAssignmentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newAssignmentName, description: newAssignmentDesc }),
        });
        const json = await res.json();
        if (json.success) {
          alert("Tugas master berhasil diperbarui");
          // Refresh
          const refreshRes = await fetch(`/api/assignments?subject_id=${selectedSubject.id}`);
          const refreshJson = await refreshRes.json();
          if (refreshJson.success) {
            setAllAssignments(refreshJson.data || []);
          }
          setEditingAssignmentId(null);
          setNewAssignmentName("");
          setNewAssignmentDesc("");
        } else {
          alert(json.message || "Gagal memperbarui tugas");
        }
      } else {
        // Create mode
        const res = await fetch(`/api/assignments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subjectId: selectedSubject.id,
            name: newAssignmentName,
            description: newAssignmentDesc,
          }),
        });
        const json = await res.json();
        if (json.success) {
          alert("Tugas master berhasil ditambahkan");
          // Refresh
          const refreshRes = await fetch(`/api/assignments?subject_id=${selectedSubject.id}`);
          const refreshJson = await refreshRes.json();
          if (refreshJson.success) {
            setAllAssignments(refreshJson.data || []);
          }
          setNewAssignmentName("");
          setNewAssignmentDesc("");
        } else {
          alert(json.message || "Gagal menambahkan tugas");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSavingAssignment(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm("Hapus tugas master ini? Semua data nilai siswa untuk tugas ini di seluruh kelas juga akan dihapus.")) return;
    try {
      const res = await fetch(`/api/assignments/${assignmentId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        alert("Tugas master berhasil dihapus");
        if (selectedSubject) {
          // Refresh
          const refreshRes = await fetch(`/api/assignments?subject_id=${selectedSubject.id}`);
          const refreshJson = await refreshRes.json();
          if (refreshJson.success) {
            setAllAssignments(refreshJson.data || []);
          }
        }
      } else {
        alert(json.message || "Gagal menghapus tugas");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    }
  };

  const startEditAssignment = (assign: any) => {
    setEditingAssignmentId(assign.id);
    setNewAssignmentName(assign.name);
    setNewAssignmentDesc(assign.description || "");
  };

  const cancelEditAssignment = () => {
    setEditingAssignmentId(null);
    setNewAssignmentName("");
    setNewAssignmentDesc("");
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [mapelName, setMapelName] = useState("");
  const [mapelCode, setMapelCode] = useState("");
  const [mapelDesc, setMapelDesc] = useState("");
  const [saving, setSaving] = useState(false);

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

  // Fetch Class-based subjects
  async function fetchClasses(pid: string) {
    if (!pid) return;
    setLoadingClasses(true);
    try {
      const userStr = localStorage.getItem("user");
      let teacherEmailParam = "";
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.role === "guru" && u.email) {
          teacherEmailParam = `&teacher_email=${encodeURIComponent(u.email)}`;
        }
      }
      const res = await fetch(`/api/classes?period_id=${pid}${teacherEmailParam}`);
      const json = await res.json();
      if (json.success) {
        setClasses(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    } finally {
      setLoadingClasses(false);
    }
  }

  // Fetch Master subjects
  async function fetchSubjects(pid: string) {
    if (!pid) return;
    setLoadingSubjects(true);
    try {
      const userStr = localStorage.getItem("user");
      let teacherEmailParam = "";
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.role === "guru" && u.email) {
          teacherEmailParam = `&teacher_email=${encodeURIComponent(u.email)}`;
        }
      }
      const res = await fetch(`/api/subjects?period_id=${pid}${teacherEmailParam}`);
      const json = await res.json();
      if (json.success) {
        setSubjects(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    } finally {
      setLoadingSubjects(false);
    }
  }

  useEffect(() => {
    if (periodId) {
      fetchSubjects(periodId);
      fetchClasses(periodId);
    }
  }, [periodId]);

  const handleDeleteSubject = async (id: string, name: string) => {
    if (!confirm(`Hapus master mata pelajaran "${name}"? Tindakan ini juga akan menghapus seluruh distribusi mata pelajaran ini di kelas.`)) return;
    try {
      const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchSubjects(periodId);
        fetchClasses(periodId); // Update class subject counts
      } else {
        alert(json.message || "Gagal menghapus mata pelajaran");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    }
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setSelectedSubjectId("");
    setMapelName("");
    setMapelCode("");
    setMapelDesc("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (subj: MasterSubject) => {
    setModalMode("edit");
    setSelectedSubjectId(subj.id);
    setMapelName(subj.name);
    setMapelCode(subj.code);
    setMapelDesc(subj.description);
    setIsModalOpen(true);
  };

  const handleSaveMapel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapelName || !mapelCode) {
      alert("Nama dan Kode mata pelajaran wajib diisi!");
      return;
    }
    setSaving(true);
    try {
      const url = modalMode === "add" ? "/api/subjects" : `/api/subjects/${selectedSubjectId}`;
      const method = modalMode === "add" ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: mapelName,
          code: mapelCode,
          description: mapelDesc,
          periodId, // Kirim periodId aktif ke backend
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        alert(modalMode === "add" ? "Mata pelajaran berhasil ditambahkan!" : "Mata pelajaran berhasil diperbarui!");
        setIsModalOpen(false);
        fetchSubjects(periodId);
      } else {
        alert(json.message || "Gagal menyimpan data");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  };

  const filters = ["Semua", "Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"];

  const filteredClasses = classes.filter((card) => {
    if (selectedFilter === "Semua") return true;
    return card.className.startsWith(selectedFilter);
  });

  const totalMapel = classes.reduce((sum, c) => sum + Number(c.subjectsCount), 0);

  // Filter Master Subjects
  const filteredSubjects = subjects.filter((sub) => {
    const matchesGlobal =
      searchQuery === "" ||
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesName = searchName === "" || sub.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesCode = searchCode === "" || sub.code.toLowerCase().includes(searchCode.toLowerCase());
    const matchesDesc = searchDesc === "" || sub.description.toLowerCase().includes(searchDesc.toLowerCase());

    return matchesGlobal && matchesName && matchesCode && matchesDesc;
  });

  // Reset page on search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, searchName, searchCode, searchDesc]);

  const totalFiltered = filteredSubjects.length;
  const totalPages = Math.ceil(totalFiltered / LIMIT);
  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * LIMIT,
    currentPage * LIMIT
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb & Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <span>Mata Pelajaran</span>
            <span>&gt;</span>
            <span className="text-[#2563eb]">
              {activeTab === "master" ? "Master Data" : "Daftar Kelas"}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Mata Pelajaran</h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola data master mata pelajaran dan kurikulum tingkat kelas di sekolah.
          </p>
        </div>

        {activeTab === "master" && isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="!w-auto py-2.5 px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]"
          >
            <Plus className="w-4 h-4" />
            Tambah Mata Pelajaran
          </button>
        )}
      </div>

      {/* Tabs Control */}
      <div className="flex border-b border-slate-100 gap-6">
        <button
          onClick={() => setActiveTab("master")}
          className={`py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "master"
              ? "border-[#2563eb] text-[#2563eb]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Master Mata Pelajaran
        </button>
        <button
          onClick={() => setActiveTab("class")}
          className={`py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "class"
              ? "border-[#2563eb] text-[#2563eb]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Mata Pelajaran Per Kelas
        </button>
      </div>

      {/* TAB CONTENT: MASTER MATA PELAJARAN */}
      {activeTab === "master" && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Advanced Search & Filtering bar */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#2563eb]" />
              Pencarian & Filter Kolom
            </h3>
            
            {/* Global Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kata kunci secara global (nama, kode, deskripsi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-[#f8fafc] text-slate-700 font-semibold"
              />
            </div>

            {/* Column specific filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Filter Nama</span>
                <input
                  type="text"
                  placeholder="Filter nama mapel..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#f8fafc]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Filter Kode</span>
                <input
                  type="text"
                  placeholder="Filter kode mapel..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#f8fafc]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Filter Deskripsi</span>
                <input
                  type="text"
                  placeholder="Filter deskripsi mapel..."
                  value={searchDesc}
                  onChange={(e) => setSearchDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#f8fafc]"
                />
              </div>
            </div>
          </div>

          {/* Master Table Card */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                    <th className="py-4 px-6">Mata Pelajaran</th>
                    <th className="py-4 px-6">Kode Mapel</th>
                    <th className="py-4 px-6">Deskripsi</th>
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {loadingSubjects ? (
                    <tr>
                      <td colSpan={4} className="py-16 text-center text-slate-400 font-bold">
                        Memuat data mata pelajaran...
                      </td>
                    </tr>
                  ) : paginatedSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-16 text-center text-slate-400 font-bold">
                        Belum ada mata pelajaran terdaftar.
                      </td>
                    </tr>
                  ) : (
                    paginatedSubjects.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/50 transition-all font-semibold">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-800">{sub.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-500">{sub.code}</td>
                        <td className="py-4 px-6 text-slate-500 font-medium">{sub.description || "-"}</td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenAssignmentsModal(sub)}
                              title="Kelola Tugas / Rincian Nilai Harian"
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-all"
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() => handleOpenEditModal(sub)}
                                  className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-all"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubject(sub.id, sub.name)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
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
                  Showing {(currentPage - 1) * LIMIT + 1} - {Math.min(currentPage * LIMIT, totalFiltered)} of {totalFiltered} mata pelajaran
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
      )}

      {/* TAB CONTENT: MATA PELAJARAN PER KELAS */}
      {activeTab === "class" && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#2563eb]">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">TOTAL DISTRIBUSI MAPEL</span>
                <span className="text-2xl font-extrabold text-slate-800 mt-1">
                  {loadingClasses ? "..." : totalMapel}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10b981]">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">STATUS MONITORING</span>
                <span className="text-2xl font-extrabold text-slate-800 mt-1">Aktif</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
              <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">TAHUN AJARAN</span>
                <span className="text-2xl font-extrabold text-slate-800 mt-1">2025/2026</span>
              </div>
            </div>
          </div>

          {/* Class Pills Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const isActive = selectedFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-100/50"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Grid of Subject Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingClasses ? (
              <div className="col-span-full py-16 text-center text-slate-400 font-bold">
                Memuat daftar kelas...
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-400 font-bold">
                Tidak ada kelas ditemukan.
              </div>
            ) : (
              filteredClasses.map((card) => (
                <div
                  key={card.id}
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center text-center gap-5"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#2563eb] border border-blue-100/50 shadow-sm">
                    <BookOpen className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-lg font-extrabold text-slate-800">{card.className}</span>
                    <span className="text-xs text-slate-400 font-bold mt-1">
                      {card.subjectsCount} Mata Pelajaran
                    </span>
                  </div>

                  <div className="w-full flex flex-col gap-1.5 text-left">
                    <div className="flex justify-between text-[10px] font-extrabold text-slate-400">
                      <span>KELENGKAPAN SILABUS:</span>
                      <span>{card.syllabusCompleteness}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        style={{ width: `${card.syllabusCompleteness}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      ></div>
                    </div>
                  </div>

                  <Link href={`/dashboard/mapel/detail?class_id=${card.id}`} className="w-full">
                    <span className="w-full py-2.5 px-4 rounded-xl border border-blue-200 text-[#2563eb] hover:bg-blue-50/50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                      Lihat Mata Pelajaran
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* POPUP MODAL: ADD / EDIT SUBJECT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <form
            onSubmit={handleSaveMapel}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">
                  {modalMode === "add" ? "Tambah Mata Pelajaran" : "Edit Mata Pelajaran"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Lengkapi parameter data master kurikulum</p>
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
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  placeholder="Contoh: Ilmu Pengetahuan Alam"
                  value={mapelName}
                  onChange={(e) => setMapelName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kode Mapel</label>
                <input
                  type="text"
                  placeholder="Contoh: IPA-01"
                  value={mapelCode}
                  onChange={(e) => setMapelCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi</label>
                <textarea
                  placeholder="Penjelasan singkat..."
                  value={mapelDesc}
                  onChange={(e) => setMapelDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 resize-none"
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
      {/* POPUP MODAL: MANAGE ASSIGNMENTS */}
      {isAssignmentsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 max-h-[85vh]">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">
                  Kelola Tugas - {selectedSubject?.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Daftar tugas harian / tujuan pembelajaran untuk mata pelajaran ini</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignmentsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6">

              {/* Form to Add/Edit Assignment */}
              {!isReadOnly && (
                <form onSubmit={handleSaveAssignment} className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-slate-700">
                    {editingAssignmentId ? "Edit Tugas Master" : "Tambah Tugas Master Baru"}
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Tugas</label>
                      <input
                        type="text"
                        placeholder="Contoh: Tugas 1: Algoritma"
                        value={newAssignmentName}
                        onChange={(e) => setNewAssignmentName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deskripsi Tugas</label>
                      <input
                        type="text"
                        placeholder="Keterangan tugas..."
                        value={newAssignmentDesc}
                        onChange={(e) => setNewAssignmentDesc(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    {editingAssignmentId && (
                      <button
                        type="button"
                        onClick={cancelEditAssignment}
                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                      >
                        Batal
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={savingAssignment}
                      className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all disabled:opacity-60"
                    >
                      {savingAssignment ? "Menyimpan..." : editingAssignmentId ? "Perbarui" : "Tambah"}
                    </button>
                  </div>
                </form>
              )}

              {/* List of assignments */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-700">Daftar Tugas Terdaftar</h4>
                
                {loadingAssignments ? (
                  <div className="text-center py-6 text-xs text-slate-400 font-semibold">Memuat tugas...</div>
                ) : allAssignments.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 font-semibold">Belum ada tugas master yang didefinisikan untuk mata pelajaran ini.</div>
                ) : (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
                    {allAssignments.map((assign) => (
                      <div key={assign.id} className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition-all">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-slate-800">{assign.name}</span>
                          {assign.description && (
                            <span className="text-[10px] text-slate-400 font-medium">{assign.description}</span>
                          )}
                        </div>
                        
                        {!isReadOnly && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startEditAssignment(assign)}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-all"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAssignment(assign.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center">
              <button
                type="button"
                onClick={() => setIsAssignmentsModalOpen(false)}
                className="px-6 py-2.5 bg-slate-800 text-white hover:bg-slate-900 rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
