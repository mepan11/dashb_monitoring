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

interface TeacherRow {
  id: string;
  name: string;
  nip: string;
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

export default function TeacherAttendancePage() {
  const [periodId, setPeriodId] = useState("");
  const [periodName, setPeriodName] = useState("");
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 15;

  // Attendance state: map of teacherId -> status
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [checkInTimes, setCheckInTimes] = useState<Record<string, string>>({});
  const [checkOutTimes, setCheckOutTimes] = useState<Record<string, string>>({});

  // Today's date
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

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

  const fetchTeachers = useCallback(async () => {
    if (!periodId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/absensi?type=guru&date=${selectedDate}&period_id=${periodId}`
      );
      const json = await res.json();
      if (json.success) {
        setTeachers(json.data);
        // Pre-fill attendance state from existing records
        const initialStatus: Record<string, string> = {};
        const initialCheckIn: Record<string, string> = {};
        const initialCheckOut: Record<string, string> = {};
        json.data.forEach((t: TeacherRow) => {
          if (t.status) initialStatus[t.id] = t.status;
          initialCheckIn[t.id] = formatForDatetimeLocal(t.checkInTime, selectedDate);
          initialCheckOut[t.id] = formatForDatetimeLocal(t.checkOutTime, selectedDate);
        });
        setAttendance(initialStatus);
        setCheckInTimes(initialCheckIn);
        setCheckOutTimes(initialCheckOut);
      }
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    } finally {
      setLoading(false);
    }
  }, [periodId, selectedDate]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleSaveAttendance = async () => {
    if (!periodId) return;
    setSaving(true);
    try {
      const attendanceRecords = teachers.map((t) => ({
        teacherId: t.id,
        status: attendance[t.id] || "",
        checkInTime: formatFromDatetimeLocal(checkInTimes[t.id] || ""),
        checkOutTime: formatFromDatetimeLocal(checkOutTimes[t.id] || ""),
      }));
      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "guru",
          date: selectedDate,
          periodId,
          attendance: attendanceRecords,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        alert("Data presensi guru berhasil disimpan!");
        fetchTeachers();
      } else {
        alert(json.message || "Gagal menyimpan presensi");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  };

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nip?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
  const paginated = filtered.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const hadir = teachers.filter((t) => attendance[t.id] === "Hadir").length;
  const terlambat = teachers.filter((t) => attendance[t.id] === "Terlambat").length;
  const absenIzin = teachers.filter(
    (t) => attendance[t.id] === "Absen" || attendance[t.id] === "Izin"
  ).length;

  const stats = [
    {
      title: "Total Guru",
      value: teachers.length,
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
      desc: teachers.length > 0 ? `${Math.round((hadir / teachers.length) * 100)}% Persentase` : "—",
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
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Presensi Guru</h1>
          <p className="text-sm text-slate-400 mt-1">
            Pantau dan kelola kehadiran guru.
            {periodName && (
              <span className="ml-2 font-semibold text-blue-600">Periode: {periodName}</span>
            )}
          </p>
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
            disabled={saving || !periodId}
            className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Menyimpan..." : "Simpan Presensi"}
          </Button>

          <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
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
          <h2 className="text-lg font-extrabold text-slate-800">Data Kehadiran Guru</h2>
          <div className="flex items-center gap-2 bg-[#f4f7fc] border border-slate-100/50 rounded-lg px-3 py-2 w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari nama atau NIP..."
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
                <th className="py-4 px-6">NAMA GURU</th>
                <th className="py-4 px-6">NIP</th>
                <th className="py-4 px-6">WAKTU MASUK</th>
                <th className="py-4 px-6">WAKTU KELUAR</th>
                <th className="py-4 px-6">STATUS KEHADIRAN</th>
                <th className="py-4 px-6 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-semibold">
                    Memuat data guru...
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
                    Tidak ada data guru pada periode ini.
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

                      {/* NIP */}
                      <td className="py-4 px-6 text-slate-500">{row.nip || "—"}</td>

                      {/* Waktu Masuk */}
                      <td className="py-4 px-6">
                        <input
                          type="datetime-local"
                          value={checkInTimes[row.id] || ""}
                          onChange={(e) =>
                            setCheckInTimes((prev) => ({ ...prev, [row.id]: e.target.value }))
                          }
                          className="px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all text-slate-800"
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
                          className="px-2 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all text-slate-800"
                        />
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-6">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            setAttendance((prev) => ({ ...prev, [row.id]: e.target.value }))
                          }
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${currentStatus === "Hadir"
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

                      {/* Action link */}
                      <td className="py-4 px-6 text-center">
                        <Link
                          href={`/dashboard/guru/profile?id=${row.id}`}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          Detail
                        </Link>
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
            Menampilkan {paginated.length} dari {filtered.length} Guru
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
