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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/lib/useRole";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface CoachRow {
  id: string;
  name: string;
  idNumber: string;
  initials: string;
  status: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
}

function formatForDatetimeLocal(val: string | null, defaultDate: string) {
  if (!val || val === "-- : --") return "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) return val;
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}(:\d{2})?$/.test(val)) {
    return val.replace(" ", "T").substring(0, 16);
  }
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(val)) {
    return `${defaultDate}T${val.substring(0, 5)}`;
  }
  return "";
}

function formatFromDatetimeLocal(val: string) {
  if (!val) return "";
  return val.replace("T", " ");
}

export default function CoachAttendancePage() {
  const { role, isReadOnly } = useRole();
  const [periodId, setPeriodId] = useState("");
  const [periodName, setPeriodName] = useState("");
  const [coaches, setCoaches] = useState<CoachRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 15;

  // Attendance state: map of coachId -> status
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [checkInTimes, setCheckInTimes] = useState<Record<string, string>>({});
  const [checkOutTimes, setCheckOutTimes] = useState<Record<string, string>>({});

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

  const fetchCoaches = useCallback(async () => {
    if (!periodId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/absensi?type=coach&date=${selectedDate}&period_id=${periodId}`
      );
      const json = await res.json();
      if (json.success) {
        setCoaches(json.data);
        const initialStatus: Record<string, string> = {};
        const initialCheckIn: Record<string, string> = {};
        const initialCheckOut: Record<string, string> = {};
        json.data.forEach((c: CoachRow) => {
          if (c.status) initialStatus[c.id] = c.status;
          initialCheckIn[c.id] = formatForDatetimeLocal(c.checkInTime, selectedDate);
          initialCheckOut[c.id] = formatForDatetimeLocal(c.checkOutTime, selectedDate);
        });
        setAttendance(initialStatus);
        setCheckInTimes(initialCheckIn);
        setCheckOutTimes(initialCheckOut);
      }
    } catch (err) {
      console.error("Failed to fetch coaches:", err);
    } finally {
      setLoading(false);
    }
  }, [periodId, selectedDate]);

  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);

  const handleSaveAttendance = async () => {
    if (!periodId) return;
    setSaving(true);
    try {
      const attendanceRecords = coaches.map((c) => ({
        coachId: c.id,
        status: attendance[c.id] || "",
        checkInTime: formatFromDatetimeLocal(checkInTimes[c.id] || ""),
        checkOutTime: formatFromDatetimeLocal(checkOutTimes[c.id] || ""),
      }));
      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "coach",
          date: selectedDate,
          periodId,
          attendance: attendanceRecords,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        alert("Data presensi coach berhasil disimpan!");
        fetchCoaches();
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
    if (!startDate || !endDate) {
      alert("Pilih Tanggal Mulai dan Tanggal Akhir");
      return;
    }
    setSaving(true);
    try {
      let queryParams = new URLSearchParams({
        type: "coach",
        startDate,
        endDate
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

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(37, 99, 235);
      doc.text("Laporan Kehadiran Coach", 14, 38);

      doc.setFontSize(9);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(71, 85, 105);

      const formattedPeriod = `Periode: ${formatIndonesianDate(startDate)} s/d ${formatIndonesianDate(endDate)}`;
      doc.text(formattedPeriod, 14, 44);

      let currentY = 50;

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
        const headers = ["No", "Nama Coach", "ID Number", "Waktu Masuk", "Waktu Keluar", "Status"];
        const rows = dateRecords.map((r: any, idx: number) => {
          let effectiveStatus = r.attendanceStatus;
          if ((r.attendanceStatus === "Hadir" || r.attendanceStatus === "Terlambat") && r.checkInTime) {
            const timePart = r.checkInTime.replace(" WIB", "").trim();
            const [hh, mm] = timePart.split(":").map(Number);
            const totalMins = hh * 60 + mm;
            effectiveStatus = totalMins < 7 * 60 ? "Hadir" : "Terlambat";
          }
          return [idx + 1, r.name, r.idNumber || "—", r.checkInTime || "—", r.checkOutTime || "—", effectiveStatus];
        });

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

      doc.save(`Laporan_Presensi_Coach_${startDate}_to_${endDate}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mencetak PDF");
    } finally {
      setSaving(false);
    }
  };

  const filtered = coaches.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.idNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
  const paginated = filtered.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const hadir = coaches.filter((c) => attendance[c.id] === "Hadir").length;
  const terlambat = coaches.filter((c) => attendance[c.id] === "Terlambat").length;
  const absenIzin = coaches.filter(
    (c) => attendance[c.id] === "Absen" || attendance[c.id] === "Izin"
  ).length;

  const stats = [
    {
      title: "Total Coach",
      value: coaches.length,
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
      desc: coaches.length > 0 ? `${Math.round((hadir / coaches.length) * 100)}% Persentase` : "—",
    },
    {
      title: "Terlambat",
      value: terlambat,
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      desc: "Perlu Tindakan",
      descColor: "text-rose-500",
    },
    {
      title: "Absen / Izin",
      value: absenIzin,
      icon: UserX,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      desc: `${absenIzin} Tidak Hadir`,
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
            <h1 className="text-3xl font-extrabold text-[#1e293b]">Presensi Coach</h1>
            <p className="text-sm text-slate-400 mt-1">
              Pantau dan kelola kehadiran coach.
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

          {!isReadOnly && (
            <Button
              onClick={handleSaveAttendance}
              disabled={saving || !periodId}
              className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : "Simpan Presensi"}
            </Button>
          )}

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
            disabled={saving || !periodId}
            className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]"
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
                <span className={`text-[10px] font-bold mt-1.5 ${"descColor" in stat && stat.descColor ? stat.descColor : "text-slate-400"}`}>
                  {stat.desc}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-slate-800">Data Kehadiran Coach</h2>
          <div className="flex items-center gap-2 bg-[#f4f7fc] border border-slate-100/50 rounded-lg px-3 py-2 w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari nama..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-xs text-slate-700 w-full outline-none placeholder-slate-400"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                <th className="py-4 px-6">NAMA COACH</th>
                <th className="py-4 px-6">ID NUMBER</th>
                <th className="py-4 px-6">WAKTU MASUK</th>
                <th className="py-4 px-6">WAKTU KELUAR</th>
                <th className="py-4 px-6">STATUS KEHADIRAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-semibold">
                    Memuat data coach...
                  </td>
                </tr>
              ) : !periodId ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-semibold">
                    Pilih periode akademik pada topbar header terlebih dahulu.
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-semibold">
                    Tidak ada data coach pada periode ini.
                  </td>
                </tr>
              ) : (
                paginated.map((row) => {
                  const currentStatus = attendance[row.id] || "";
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-all">
                      {/* Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                            {row.initials}
                          </div>
                          <span className="font-bold text-slate-800">{row.name}</span>
                        </div>
                      </td>

                      {/* ID Number */}
                      <td className="py-4 px-6 text-slate-500">{row.idNumber || "—"}</td>

                      {/* Waktu Masuk */}
                      <td className="py-4 px-6">
                        <input
                          type="datetime-local"
                          value={checkInTimes[row.id] || ""}
                          onChange={(e) =>
                            setCheckInTimes((prev) => ({ ...prev, [row.id]: e.target.value }))
                          }
                          disabled={isReadOnly}
                          className="px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all text-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </td>

                      {/* Waktu Keluar */}
                      <td className="py-4 px-6">
                        <input
                          type="datetime-local"
                          value={checkOutTimes[row.id] || ""}
                          onChange={(e) =>
                            setCheckOutTimes((prev) => ({ ...prev, [row.id]: e.target.value }))
                          }
                          disabled={isReadOnly}
                          className="px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all text-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-6">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            setAttendance((prev) => ({ ...prev, [row.id]: e.target.value }))
                          }
                          disabled={isReadOnly}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${currentStatus === "Hadir"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : currentStatus === "Terlambat"
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : currentStatus === "Izin"
                                  ? "bg-blue-50 text-blue-600 border-blue-100"
                                  : currentStatus === "Absen"
                                    ? "bg-rose-50 text-rose-600 border-rose-100"
                                    : "bg-slate-50 text-slate-400 border-slate-100"
                            }`}
                        >
                          <option value="">— Pilih Status —</option>
                          <option value="Hadir">Hadir</option>
                          <option value="Terlambat">Terlambat</option>
                          <option value="Izin">Izin</option>
                          <option value="Absen">Absen</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-400">
            Menampilkan {paginated.length} dari {filtered.length} Coach
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
      </div>
    </div>
  );
}
