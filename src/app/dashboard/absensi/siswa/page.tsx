"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Download,
  Calendar,
  Users,
  UserCheck,
  Clock,
  UserX,
  Search,
  ChevronLeft,
  ChevronRight,
  Save,
  BookOpen,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/lib/useRole";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface StudentRow {
  id: string;
  name: string;
  nisn: string;
  initials: string;
  status: string | null;
}

export default function StudentAttendanceSubpage() {
  const { role } = useRole();
  const [periodId, setPeriodId] = useState("");
  const [periodName, setPeriodName] = useState("");
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 15;

  // Selected filters
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  // Attendance state: map of studentId -> status
  const [studentAttMap, setStudentAttMap] = useState<Record<string, string>>({});

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // Date range for PDF rekap
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Mendengarkan perubahan periode akademik
  useEffect(() => {
    const cached = localStorage.getItem("active_period_id") || "";
    const cachedName = localStorage.getItem("active_period_name") || "";
    setPeriodId(cached);
    setPeriodName(cachedName);

    const handlePeriodChange = (e: any) => {
      setPeriodId(e.detail.periodId || "");
      setPeriodName(e.detail.periodName || "");
    };

    window.addEventListener("academic_period_changed", handlePeriodChange);
    return () => {
      window.removeEventListener("academic_period_changed", handlePeriodChange);
    };
  }, []);

  // Initialize date range defaults safely
  useEffect(() => {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const todayStr = new Date(Date.now() - tzoffset).toISOString().slice(0, 10);
    const thirtyDaysAgo = new Date(Date.now() - tzoffset - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    setStartDate(thirtyDaysAgo);
    setEndDate(todayStr);
  }, []);

  const formatIndonesianDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  // Fetch Classes
  useEffect(() => {
    if (!periodId) return;
    const userStr = localStorage.getItem("user");
    let teacherEmailParam = "";
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u.role === "guru" && u.email) {
        teacherEmailParam = `&teacher_email=${encodeURIComponent(u.email)}`;
      }
    }
    fetch(`/api/classes?period_id=${periodId}${teacherEmailParam}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setClasses(json.data);
      })
      .catch((err) => console.error("Error fetching classes:", err));
  }, [periodId, role]);

  // Fetch Subjects when selectedClassId changes
  useEffect(() => {
    if (!selectedClassId || !periodId) {
      setSubjects([]);
      setSelectedSubjectId("");
      return;
    }
    const userStr = localStorage.getItem("user");
    let teacherEmailParam = "";
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u.role === "guru" && u.email) {
        teacherEmailParam = `&teacher_email=${encodeURIComponent(u.email)}`;
      }
    }
    fetch(`/api/classes/${selectedClassId}/subjects?period_id=${periodId}${teacherEmailParam}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setSubjects(json.data);
          setSelectedSubjectId(""); // force manual selection
        }
      })
      .catch((err) => console.error("Error fetching subjects:", err));
  }, [selectedClassId, periodId, role]);

  // Fetch Students & existing attendance
  const fetchStudents = useCallback(async () => {
    if (!selectedClassId || !selectedSubjectId || !selectedDate || !periodId) {
      setStudents([]);
      return;
    }
    setLoading(true);
    try {
      const subjectObj = subjects.find((s) => String(s.id) === String(selectedSubjectId));
      const classSubjectId = subjectObj ? subjectObj.classSubjectId : "";

      const res = await fetch(
        `/api/absensi?type=students&date=${selectedDate}&classId=${selectedClassId}&classSubjectId=${classSubjectId}&period_id=${periodId}`
      );
      const json = await res.json();
      if (json.success) {
        setStudents(json.data);
        const initialMap: Record<string, string> = {};
        json.data.forEach((s: StudentRow) => {
          initialMap[s.id] = s.status || "Hadir";
        });
        setStudentAttMap(initialMap);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedClassId, selectedSubjectId, selectedDate, periodId, subjects]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleStudentAttChange = (studentId: string, status: string) => {
    setStudentAttMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!periodId || !selectedClassId || !selectedSubjectId) return;
    setSaving(true);
    try {
      const subjectObj = subjects.find((s) => String(s.id) === String(selectedSubjectId));
      const classSubjectId = subjectObj ? subjectObj.classSubjectId : "";

      const attendanceRecords = students.map((s) => ({
        studentId: s.id,
        status: studentAttMap[s.id] || "Hadir",
      }));

      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "students",
          date: selectedDate,
          periodId,
          classId: selectedClassId,
          classSubjectId,
          attendance: attendanceRecords,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        alert("Data presensi siswa berhasil disimpan!");
        fetchStudents();
      } else {
        alert(json.message || "Gagal menyimpan presensi");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  };

  const handlePrintPDF = async () => {
    if (!selectedClassId || !selectedSubjectId) {
      alert("Pilih Kelas dan Mata Pelajaran terlebih dahulu");
      return;
    }
    if (!startDate || !endDate) {
      alert("Pilih Tanggal Mulai dan Tanggal Akhir");
      return;
    }
    setSaving(true);
    try {
      const subjectObj = subjects.find((s) => String(s.id) === String(selectedSubjectId));
      const classSubjectId = subjectObj ? subjectObj.classSubjectId : "";

      let queryParams = new URLSearchParams({
        type: "siswa",
        startDate,
        endDate,
        classId: selectedClassId,
        classSubjectId
      });
      if (periodId) {
        queryParams.append("period_id", periodId);
      }

      const res = await fetch(`/api/absensi?${queryParams.toString()}`);
      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Gagal mengambil riwayat presensi");
        setSaving(false);
        return;
      }

      const records = data.data;
      if (records.length === 0) {
        alert("Tidak ada data presensi pada rentang tanggal tersebut.");
        setSaving(false);
        return;
      }

      const groupedByDate: { [date: string]: any[] } = {};
      records.forEach((r: any) => {
        const d = r.date;
        if (!groupedByDate[d]) {
          groupedByDate[d] = [];
        }
        groupedByDate[d].push(r);
      });

      const sortedDates = Object.keys(groupedByDate).sort();

      const doc = new jsPDF();

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Sistem Informasi Monitoring Presensi", 14, 24);

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(14, 28, 196, 28);

      const cls = classes.find((c) => String(c.id) === String(selectedClassId));
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(37, 99, 235);
      doc.text(`Laporan Kehadiran Siswa Kelas ${cls?.name || ""}`, 14, 38);

      doc.setFontSize(9);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(71, 85, 105);

      if (subjectObj) {
        doc.text(`Mata Pelajaran: ${subjectObj.name} (${subjectObj.code})`, 14, 44);
      }

      const formattedPeriod = `Periode: ${formatIndonesianDate(startDate)} s/d ${formatIndonesianDate(endDate)}`;
      doc.text(formattedPeriod, 14, 50);

      let currentY = 56;

      sortedDates.forEach((date) => {
        if (currentY > 240) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(`Hari / Tanggal: ${formatIndonesianDate(date)}`, 14, currentY);
        currentY += 4;

        const dateRecords = groupedByDate[date];
        const headers = ["No", "Nama Siswa", "NISN", "Status Kehadiran"];
        const rows = dateRecords.map((r: any, idx: number) => [
          idx + 1,
          r.name,
          r.nisn,
          r.attendanceStatus
        ]);

        autoTable(doc, {
          head: [headers],
          body: rows,
          startY: currentY,
          theme: "grid",
          headStyles: {
            fillColor: [15, 23, 42],
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: "bold"
          },
          bodyStyles: {
            fontSize: 8.5,
            textColor: [30, 41, 59],
            lineColor: [148, 163, 184],
            lineWidth: 0.4
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          },
          columnStyles: {
            0: { cellWidth: 10, halign: "center" }
          },
          margin: { left: 14, right: 14 },
          didParseCell: (cellData) => {
            if (cellData.section === "body" && cellData.column.index === headers.length - 1) {
              const statusText = String(cellData.cell.raw).trim();
              if (statusText === "Hadir") {
                cellData.cell.styles.textColor = [16, 185, 129];
                cellData.cell.styles.fontStyle = "bold";
              } else if (statusText === "Absen" || statusText === "Alfa") {
                cellData.cell.styles.textColor = [239, 68, 68];
                cellData.cell.styles.fontStyle = "bold";
              } else if (statusText === "Terlambat" || statusText === "Sakit" || statusText === "Izin") {
                cellData.cell.styles.textColor = [245, 158, 11];
                cellData.cell.styles.fontStyle = "bold";
              }
            }
          }
        });

        currentY = (doc as any).lastAutoTable.finalY + 12;
      });

      doc.save(`Laporan_Presensi_Siswa_${startDate}_to_${endDate}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mencetak PDF");
    } finally {
      setSaving(false);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
  const paginated = filtered.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const totalStudents = students.length;
  const hadir = students.filter((s) => studentAttMap[s.id] === "Hadir").length;
  const sakit = students.filter((s) => studentAttMap[s.id] === "Sakit").length;
  const izin = students.filter((s) => studentAttMap[s.id] === "Izin").length;
  const alfa = students.filter((s) => studentAttMap[s.id] === "Alfa").length;

  const stats = [
    {
      title: "Total Siswa",
      value: totalStudents,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      desc: periodName || "Periode Aktif",
    },
    {
      title: "Hadir",
      value: hadir,
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      desc: totalStudents > 0 ? `${Math.round((hadir / totalStudents) * 100)}% Persentase` : "—",
    },
    {
      title: "Sakit / Izin",
      value: sakit + izin,
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      desc: `${sakit} Sakit, ${izin} Izin`,
    },
    {
      title: "Alfa",
      value: alfa,
      icon: UserX,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      desc: `${alfa} Tanpa Keterangan`,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/absensi">
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-[#1e293b]">Presensi Siswa</h1>
            <p className="text-sm text-slate-400 mt-1">
              Pantau dan kelola kehadiran siswa per-kelas dan subjek mata pelajaran.
              {periodName && (
                <span className="ml-2 font-semibold text-blue-600">Periode: {periodName}</span>
              )}
            </p>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3 self-stretch xl:self-auto flex-wrap">
          {/* Date Picker */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none outline-none text-slate-700 font-bold text-xs cursor-pointer"
            />
          </div>

          <Button
            onClick={handleSaveAttendance}
            disabled={saving || !periodId || !selectedClassId || !selectedSubjectId}
            className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Menyimpan..." : "Simpan Presensi"}
          </Button>

          {/* Rekap Date Range */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-500 shadow-sm">
            <span>Rekap Mulai:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-700 font-bold text-[11px] cursor-pointer"
            />
            <span>s/d:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-700 font-bold text-[11px] cursor-pointer"
            />
          </div>

          <Button
            onClick={handlePrintPDF}
            disabled={saving || !periodId || !selectedClassId || !selectedSubjectId}
            className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Download Rekap
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
              <div className={`p-2.5 rounded-lg ${stat.iconBg} ${stat.iconColor} shrink-0`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-3xl font-extrabold text-slate-800">{stat.value}</span>
              {stat.desc && (
                <span className="text-[10px] font-bold mt-1.5 text-slate-400">
                  {stat.desc}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500">Pilih Kelas</label>
          <select
            value={selectedClassId}
            onChange={(e) => { setSelectedClassId(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="">-- Pilih Kelas --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (Homeroom: {c.homeroomTeacher || "—"})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500">Pilih Mata Pelajaran</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => { setSelectedSubjectId(e.target.value); setCurrentPage(1); }}
            disabled={!selectedClassId || subjects.length === 0}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-50"
          >
            <option value="">-- Pilih Mata Pelajaran --</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code}) - {s.teacher}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
        {/* Search Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-neutral sm:items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-slate-800">Daftar Kehadiran Siswa</h2>
          {selectedClassId && selectedSubjectId && (
            <div className="flex items-center gap-2 bg-[#f4f7fc] border border-slate-100/50 rounded-lg px-3 py-2 w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Cari nama atau NISN..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-xs text-slate-700 w-full outline-none placeholder-slate-400"
              />
            </div>
          )}
        </div>

        {/* Content Render based on Filter */}
        {!selectedClassId || !selectedSubjectId ? (
          <div className="py-20 text-center text-slate-400 font-bold border-t border-slate-100 bg-slate-50/50">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            Silakan pilih Kelas dan Mata Pelajaran terlebih dahulu untuk menampilkan daftar siswa.
          </div>
        ) : loading ? (
          <div className="py-20 text-center text-slate-400 font-semibold">
            Memuat data siswa...
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-semibold">
            Tidak ada data siswa dalam kelas ini untuk mata pelajaran terpilih.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                    <th className="py-4 px-6">NAMA SISWA</th>
                    <th className="py-4 px-6">NISN</th>
                    <th className="py-4 px-6">STATUS KEHADIRAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                  {paginated.map((row) => {
                    const currentStatus = studentAttMap[row.id] || "Hadir";
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                              {row.initials}
                            </div>
                            <span className="font-bold text-slate-800">{row.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-500">{row.nisn || "—"}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {["Hadir", "Sakit", "Izin", "Alfa"].map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleStudentAttChange(row.id, st)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${currentStatus === st
                                    ? st === "Hadir"
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                      : st === "Sakit"
                                        ? "bg-blue-50 text-blue-600 border-blue-200"
                                        : st === "Izin"
                                          ? "bg-amber-50 text-amber-600 border-amber-200"
                                          : "bg-rose-50 text-rose-600 border-rose-200"
                                    : "bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-50"
                                  }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-400">
                Menampilkan {paginated.length} dari {filtered.length} Siswa
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center ${p === currentPage
                        ? "bg-[#2563eb] text-white shadow-sm"
                        : "hover:bg-slate-50 text-slate-600"
                      }`}
                  >
                    {p}
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
          </>
        )}
      </div>
    </div>
  );
}
