"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Download,
  UserPlus,
  Users,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  X,
  Search,
  Check,
  User,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface StudentRow {
  id: string;
  name: string;
  absenNumber: string;
  nisn: string;
  gender: string;
  status: string;
  initials: string;
}

interface AvailableStudent {
  id: string;
  name: string;
  nisn: string;
  classLabel: string | null;
}

const LIMIT = 15;

function ClassDetailContent() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("id") || "1";

  const [className, setClassName] = useState("Kelas ...");
  const [homeroomTeacher, setHomeroomTeacher] = useState("Memuat...");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("Semua Gender");
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStats, setTotalStats] = useState({ total: 0, male: 0, female: 0 });
  const [periodId, setPeriodId] = useState("");

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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [searchAvailable, setSearchAvailable] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [submittingAvailable, setSubmittingAvailable] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGender, selectedStatus, searchQuery]);

  const fetchClassStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/classes/${classId}/students`);
      const json = await res.json();
      if (json.success) {
        setClassName(json.className);
        setHomeroomTeacher(json.homeroomTeacher);
        setStudents(json.data);
        setTotalStats(json.stats);
      }
    } catch (err) {
      console.error("Failed to fetch class students:", err);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchClassStudents();
  }, [fetchClassStudents]);

  // Load available students when modal opens or period changes
  useEffect(() => {
    if (!isModalOpen || !periodId) return;
    async function loadAvailable() {
      setLoadingAvailable(true);
      try {
        const res = await fetch(`/api/students/available?period_id=${periodId}`);
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
  }, [isModalOpen, periodId]);

  const handleDeleteStudent = async (studentId: string, name: string) => {
    if (!confirm(`Keluarkan siswa "${name}" dari kelas ${className}?`)) return;
    try {
      const res = await fetch(`/api/classes/${classId}/students?studentId=${studentId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        fetchClassStudents();
      } else {
        alert(json.message || "Gagal mengeluarkan siswa");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nisn.includes(searchQuery);

    const matchGender =
      selectedGender === "Semua Gender" ||
      (selectedGender === "Laki-laki" && student.gender === "Laki-laki") ||
      (selectedGender === "Perempuan" && student.gender === "Perempuan");

    const matchStatus =
      selectedStatus === "Semua Status" ||
      (selectedStatus === "Status: Aktif" && student.status === "Aktif") ||
      (selectedStatus === "Status: Nonaktif" && student.status === "Nonaktif");

    return matchSearch && matchGender && matchStatus;
  });

  const totalFiltered = filteredStudents.length;
  const totalPages = Math.ceil(totalFiltered / LIMIT);

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * LIMIT,
    currentPage * LIMIT
  );

  const handleAddStudentSubmit = async () => {
    if (!selectedStudentId) {
      alert("Harap pilih siswa terlebih dahulu!");
      return;
    }
    setSubmittingAvailable(true);
    try {
      const res = await fetch(`/api/classes/${classId}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudentId }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        alert("Siswa berhasil ditambahkan ke kelas!");
        setIsModalOpen(false);
        setSelectedStudentId("");
        setSearchAvailable("");
        fetchClassStudents();
      } else {
        alert(json.message || "Gagal menambahkan siswa");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSubmittingAvailable(false);
    }
  };

  const stats = [
    {
      title: "Total Siswa",
      value: totalStats.total,
      badge: `${totalStats.total} Riel`,
      badgeType: "success" as const,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Laki-laki",
      value: totalStats.male,
      icon: User,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Perempuan",
      value: totalStats.female,
      icon: User,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Kehadiran Hari Ini",
      value: "100%",
      icon: CheckCircle,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  const filteredAvailable = availableStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchAvailable.toLowerCase()) ||
      s.nisn.includes(searchAvailable)
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">{className}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Wali Kelas: <span className="font-bold text-slate-700">{homeroomTeacher}</span>
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3 self-stretch xl:self-auto">
          <Button variant="secondary" className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm">
            <Download className="w-4 h-4 text-slate-400" />
            Export Data
          </Button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="!w-auto py-2.5 px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Siswa
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-5">
              <div className={`w-12 h-12 rounded-lg ${stat.iconBg} flex items-center justify-center ${stat.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">{stat.title}</span>
                <span className="text-2xl font-extrabold text-slate-800 mt-1">{loading ? "..." : stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Table Container: Daftar Siswa */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
        
        {/* Table Filter Controls Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-slate-800">Daftar Rombongan Belajar Siswa</h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-[#f4f7fc] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Gender */}
            {["Semua Gender", "Laki-laki", "Perempuan"].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedGender === g
                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                    : "bg-[#f4f7fc] text-slate-600 border-slate-100/50 hover:bg-slate-200/50"
                }`}
              >
                {g}
              </button>
            ))}

            {/* Filter Status */}
            {["Semua Status", "Status: Aktif", "Status: Nonaktif"].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedStatus === s
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-[#f4f7fc] text-slate-600 border-slate-100/50 hover:bg-slate-200/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                <th className="py-4 px-6">Siswa</th>
                <th className="py-4 px-6">NISN</th>
                <th className="py-4 px-6">GENDER</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-bold">
                    Memuat data siswa kelas...
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-bold">
                    Tidak ada siswa terdaftar di kelas ini yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-all">
                    
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center border shadow-sm shrink-0 text-xs ${
                        student.gender === "Perempuan"
                          ? "bg-pink-50 text-pink-600 border-pink-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                      }`}>
                        {student.initials}
                      </div>
                      <div className="flex flex-col">
                        <Link href={`/dashboard/siswa/profile?id=${student.id}`} className="font-bold text-slate-800 hover:text-[#2563eb] transition-all">
                          {student.name}
                        </Link>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{student.absenNumber}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-650">
                      {student.nisn}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-md ${
                          student.gender === "Laki-laki"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}
                      >
                        {student.gender === "Laki-laki" ? "L" : "P"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${
                        student.status === "Aktif"
                          ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                          : "border-slate-100 bg-slate-50 text-slate-500"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${student.status === "Aktif" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                        {student.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/dashboard/siswa/profile?id=${student.id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-all">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/dashboard/siswa/edit?id=${student.id}`} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-all">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteStudent(student.id, student.name)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
              Showing {(currentPage - 1) * LIMIT + 1} - {Math.min(currentPage * LIMIT, totalFiltered)} of {totalFiltered} siswa
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

      {/* Modal Form: Add Student to Class */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">Tambahkan Siswa ke Kelas</h3>
                <p className="text-xs text-slate-400 mt-1">Daftar siswa sekolah yang belum berada di kelas ini</p>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); setSelectedStudentId(""); }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search */}
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama atau NISN..."
                  value={searchAvailable}
                  onChange={(e) => setSearchAvailable(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal List */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
              {loadingAvailable ? (
                <div className="text-center py-10 text-xs text-slate-450 font-bold">
                  Memuat data siswa...
                </div>
              ) : filteredAvailable.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400 font-bold">
                  Tidak ada siswa tersedia untuk ditambahkan.
                </div>
              ) : (
                filteredAvailable.map((student) => {
                  const isSelected = selectedStudentId === student.id;
                  return (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`p-4.5 rounded-2xl border transition-all flex justify-between items-center cursor-pointer ${
                        isSelected
                          ? "bg-blue-50/70 border-blue-200 shadow-sm"
                          : "bg-white border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-xs font-bold text-slate-800">{student.name}</span>
                        <div className="flex gap-2 items-center mt-0.5">
                          <span className="text-[10px] text-slate-400 font-semibold font-mono">NISN: {student.nisn}</span>
                          {student.classLabel && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded border border-slate-200">
                              Saat ini: {student.classLabel}
                            </span>
                          )}
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

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-3">
              <button
                onClick={() => { setIsModalOpen(false); setSelectedStudentId(""); }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
              >
                Batalkan
              </button>
              <button
                onClick={handleAddStudentSubmit}
                disabled={submittingAvailable || !selectedStudentId}
                className="px-6 py-2.5 bg-[#2563eb] text-white hover:bg-blue-700 rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-60"
              >
                {submittingAvailable ? "Menambahkan..." : "Tambahkan ke Kelas"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClassDetailPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400 font-bold">Memuat Halaman...</div>}>
      <ClassDetailContent />
    </Suspense>
  );
}
