"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Download,
  Calendar,
  Layers,
  Users,
  AlertTriangle,
  Search,
  ChevronLeft,
  X,
  Edit,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DailyGrade {
  assignment_name: string;
  score: number;
}

interface StudentGrade {
  id: string;
  name: string;
  nisn: string;
  initials: string;
  dailyGrades: DailyGrade[];
  dailyAssignmentAvg: number;
  ekskul: number;
  uts: number;
  uas: number;
  average: number;
  status: "Lulus" | "Remedial";
  attendancePercentage: number;
  totalAttendance: number;
  presentAttendance: number;
}

interface Stats {
  totalStudents: number;
  belowKKM: number;
  academicYear: string;
  semester: string;
  periodName: string;
}

function ViewGradesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get("class_id");

  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    belowKKM: 0,
    academicYear: "—",
    semester: "—",
    periodName: "—",
  });
  const [loading, setLoading] = useState(true);
  const [periodId, setPeriodId] = useState<string>("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentGrade | null>(null);
  const [modalMode, setModalMode] = useState<"daily" | "term">("daily");
  
  // Daily modal inputs
  const [newAssignmentName, setNewAssignmentName] = useState("");
  const [newAssignmentScore, setNewAssignmentScore] = useState("");
  
  // Term modal inputs
  const [inputUts, setInputUts] = useState("");
  const [inputUas, setInputUas] = useState("");
  const [inputEkskul, setInputEkskul] = useState("");

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

  const fetchGrades = async () => {
    if (!classId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/grades?class_id=${classId}&period_id=${periodId}`);
      const json = await res.json();
      if (json.success) {
        setStudents(json.data);
        setStats(json.stats);
      }
    } catch (error) {
      console.error("Gagal memuat nilai:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [classId, periodId]);

  const handleOpenEditModal = (student: StudentGrade, mode: "daily" | "term") => {
    setSelectedStudent(student);
    setModalMode(mode);
    
    if (mode === "term") {
      setInputUts(String(student.uts));
      setInputUas(String(student.uas));
      setInputEkskul(String(student.ekskul));
    }
    
    setIsModalOpen(true);
  };

  const handleSaveDaily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !newAssignmentName || !newAssignmentScore) return;

    try {
      const res = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          classId,
          periodId,
          type: "daily",
          assignmentName: newAssignmentName,
          score: parseFloat(newAssignmentScore),
        }),
      });

      const json = await res.json();
      if (json.success) {
        alert("Nilai tugas berhasil disimpan!");
        setNewAssignmentName("");
        setNewAssignmentScore("");
        
        // Refresh modal data
        const updatedRes = await fetch(`/api/grades?class_id=${classId}&period_id=${periodId}`);
        const updatedJson = await updatedRes.json();
        if (updatedJson.success) {
          setStudents(updatedJson.data);
          setStats(updatedJson.stats);
          
          const freshStudent = updatedJson.data.find((s: StudentGrade) => s.id === selectedStudent.id);
          if (freshStudent) {
            setSelectedStudent(freshStudent);
          }
        }
      } else {
        alert(json.message || "Gagal menyimpan nilai");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    }
  };

  const handleSaveTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      const res = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          classId,
          periodId,
          type: "term",
          uts: parseFloat(inputUts) || 0,
          uas: parseFloat(inputUas) || 0,
          ekskul: parseFloat(inputEkskul) || 0,
        }),
      });

      const json = await res.json();
      if (json.success) {
        alert("Nilai UTS/UAS/Ekskul berhasil disimpan!");
        setIsModalOpen(false);
        fetchGrades();
      } else {
        alert(json.message || "Gagal menyimpan nilai");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    }
  };

  // Filter students by search query
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nisn.includes(searchQuery)
  );

  const statsConfig = [
    {
      title: "Tahun Akademik",
      value: stats.academicYear,
      icon: Calendar,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Semester",
      value: stats.semester,
      icon: Layers,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Siswa",
      value: stats.totalStudents,
      icon: Users,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Di Bawah KKM (75)",
      value: stats.belowKKM,
      icon: AlertTriangle,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/nilai">
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-[#1e293b]">Manajemen Nilai Kelas</h1>
            <p className="text-sm text-slate-400 mt-1">
              Kelola tugas harian, UTS, UAS, dan pantau persentase kehadiran siswa.
            </p>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3 self-stretch xl:self-auto">
          <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8] whitespace-nowrap">
            <Download className="w-4 h-4" />
            Download Rekap Nilai
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_25px_rgb(0,0,0,0.01)] flex items-center justify-between gap-4"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{stat.title}</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1.5">{stat.value}</span>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.iconBg} ${stat.iconColor} flex items-center justify-center shrink-0 border border-slate-100/50 shadow-inner`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
        {/* Search Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-slate-800">Daftar Nilai Siswa</h2>

          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari Nama Siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f4f7fc] border border-slate-100/50 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-bold">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              Memuat data nilai...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-bold">
              Tidak ada data siswa ditemukan.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                  <th className="py-4 px-6 text-center">No</th>
                  <th className="py-4 px-6">Nama Siswa</th>
                  <th className="py-4 px-6 text-center">NISN</th>
                  <th className="py-4 px-6 text-center">Rata Tugas Harian</th>
                  <th className="py-4 px-6 text-center">UTS</th>
                  <th className="py-4 px-6 text-center">UAS</th>
                  <th className="py-4 px-6 text-center">Nilai Rapor</th>
                  <th className="py-4 px-6 text-center">Kehadiran</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                {filteredStudents.map((row, index) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-all">
                    {/* Number */}
                    <td className="py-4 px-6 text-center text-slate-400">{index + 1}</td>

                    {/* Student Name with Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                          {row.initials}
                        </div>
                        <span className="font-bold text-slate-800">{row.name}</span>
                      </div>
                    </td>

                    {/* NISN */}
                    <td className="py-4 px-6 text-center font-medium text-slate-500">{row.nisn}</td>

                    {/* Rata Tugas Harian */}
                    <td className="py-4 px-6 text-center text-slate-800 font-bold">{Number(row.dailyAssignmentAvg || 0).toFixed(1)}</td>

                    {/* UTS */}
                    <td className="py-4 px-6 text-center text-slate-600 font-medium">{Number(row.uts || 0).toFixed(1)}</td>

                    {/* UAS */}
                    <td className="py-4 px-6 text-center text-slate-600 font-medium">{Number(row.uas || 0).toFixed(1)}</td>

                    {/* Nilai Rapor */}
                    <td className="py-4 px-6 text-center">
                      <span className={`font-extrabold ${row.average >= 75 ? "text-blue-600" : "text-rose-600"}`}>
                        {Number(row.average || 0).toFixed(1)}
                      </span>
                    </td>

                    {/* Attendance percentage with < 90% indicator */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                          row.attendancePercentage >= 90
                            ? "bg-slate-100 text-slate-600"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}
                        title={`${row.presentAttendance}/${row.totalAttendance} hari hadir`}
                      >
                        {row.attendancePercentage}%
                        {row.attendancePercentage < 90 && " ⚠️"}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                          row.status === "Lulus"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(row, "daily")}
                          className="flex items-center gap-1.5 py-1 px-2 text-xs bg-blue-50 text-[#2563eb] rounded-lg font-bold hover:bg-blue-100/60 transition-all"
                        >
                          <Plus className="w-3 h-3" /> Tugas
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(row, "term")}
                          className="flex items-center gap-1.5 py-1 px-2 text-xs bg-emerald-50 text-emerald-600 rounded-lg font-bold hover:bg-emerald-100/60 transition-all"
                        >
                          <Edit className="w-3.5 h-3.5" /> UTS/UAS
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL FORM INPUT NILAI */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#f8fafc]">
              <div>
                <h3 className="text-base font-extrabold text-slate-800">
                  Input Nilai: {selectedStudent.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  NISN: {selectedStudent.nisn} | Kehadiran: {selectedStudent.attendancePercentage}%
                  {selectedStudent.attendancePercentage < 90 && (
                    <span className="text-amber-600 font-extrabold ml-1.5">⚠️ Presensi di bawah 90%</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Selector */}
            <div className="flex border-b border-slate-100">
              <button
                type="button"
                onClick={() => setModalMode("daily")}
                className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
                  modalMode === "daily"
                    ? "border-blue-600 text-blue-600 bg-blue-50/20"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Nilai Tugas Harian
              </button>
              <button
                type="button"
                onClick={() => setModalMode("term")}
                className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
                  modalMode === "term"
                    ? "border-blue-600 text-blue-600 bg-blue-50/20"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Nilai Sumatif (UTS / UAS)
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {modalMode === "daily" ? (
                /* SECTION 1: TUGAS HARIAN */
                <div className="flex flex-col gap-6">
                  {/* List of current assignments */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 mb-2.5">Daftar Nilai Tugas Aktif</h4>
                    {selectedStudent.dailyGrades.length === 0 ? (
                      <div className="text-[11px] text-slate-400 italic py-3 bg-slate-50 rounded-xl text-center border border-dashed border-slate-100">
                        Belum ada tugas yang diinput periode ini.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {selectedStudent.dailyGrades.map((g, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-[#f8fafc] border border-slate-100 rounded-xl px-4 py-2.5">
                            <span className="text-xs font-bold text-slate-600">{g.assignment_name}</span>
                            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-100/50 px-2.5 py-0.5 rounded-lg">
                              {g.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add/Edit assignment form */}
                  <form onSubmit={handleSaveDaily} className="border-t border-slate-100 pt-5 flex flex-col gap-4">
                    <h4 className="text-xs font-bold text-slate-700">Tambah / Perbarui Nilai Tugas</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500">Nama Tugas</label>
                        <select
                          required
                          value={newAssignmentName}
                          onChange={(e) => setNewAssignmentName(e.target.value)}
                          className="px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none"
                        >
                          <option value="">Pilih Tugas...</option>
                          <option value="Tugas 1">Tugas 1</option>
                          <option value="Tugas 2">Tugas 2</option>
                          <option value="Tugas 3">Tugas 3</option>
                          <option value="Tugas 4">Tugas 4</option>
                          <option value="Tugas 5">Tugas 5</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500">Nilai (0-100)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="Masukkan nilai"
                          value={newAssignmentScore}
                          onChange={(e) => setNewAssignmentScore(e.target.value)}
                          className="px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-2 py-2.5 px-4 rounded-xl bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4" /> Simpan Nilai Tugas
                    </button>
                  </form>
                </div>
              ) : (
                /* SECTION 2: UTS & UAS */
                <form onSubmit={handleSaveTerm} className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">Nilai UTS</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="Nilai UTS"
                        value={inputUts}
                        onChange={(e) => setInputUts(e.target.value)}
                        className="px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">Nilai UAS</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="Nilai UAS"
                        value={inputUas}
                        onChange={(e) => setInputUas(e.target.value)}
                        className="px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Nilai Ekstrakurikuler</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="Nilai Ekskul"
                      value={inputEkskul}
                      onChange={(e) => setInputEkskul(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-6 mt-4 flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsModalOpen(false)}
                      className="!py-2.5 !px-5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg"
                    >
                      Batal
                    </Button>
                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-lg bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-bold shadow-sm transition-all"
                    >
                      Simpan Nilai Sumatif
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default function ViewGradesPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400 font-bold">Memuat halaman...</div>}>
      <ViewGradesContent />
    </Suspense>
  );
}
