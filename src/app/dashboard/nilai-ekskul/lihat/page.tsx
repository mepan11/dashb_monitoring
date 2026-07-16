"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Download, Search, Save, Star } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface StudentGradeRow {
  studentPeriodId: number;
  studentId: string;
  name: string;
  nisn: string;
  gender: string;
  className: string;
  gradeId: number | null;
  score: number | null;
  notes: string;
}

interface EkskulInfo {
  name: string;
  academicYear: string;
  semester: string;
}

function NilaiEkskulContent() {
  const searchParams = useSearchParams();
  const epId = searchParams.get("ep_id") || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentGradeRow[]>([]);
  const [ekskulInfo, setEkskulInfo] = useState<EkskulInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Temporary local edits: { [studentPeriodId]: { score, notes } }
  const [edits, setEdits] = useState<Record<string, { score: string; notes: string }>>({});

  const fetchData = useCallback(async () => {
    if (!epId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/extracurricular-grades?extracurricular_period_id=${epId}`);
      const json = await res.json();
      if (json.success) {
        setStudents(json.data || []);
        setEkskulInfo(json.ekskul || null);

        // Initialize edits from existing data
        const initialEdits: Record<string, { score: string; notes: string }> = {};
        for (const s of json.data || []) {
          initialEdits[String(s.studentPeriodId)] = {
            score: s.score !== null ? String(s.score) : "",
            notes: s.notes || "",
          };
        }
        setEdits(initialEdits);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [epId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (studentPeriodId: number) => {
    const key = String(studentPeriodId);
    const edit = edits[key];
    if (!edit || edit.score === "") {
      alert("Nilai wajib diisi");
      return;
    }
    setSaving(key);
    try {
      const res = await fetch("/api/extracurricular-grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extracurricularPeriodId: epId,
          studentPeriodId,
          score: parseFloat(edit.score),
          notes: edit.notes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchData();
      } else {
        alert(json.message || "Gagal menyimpan nilai");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSaving(null);
    }
  };

  const handleDownloadPdf = () => {
    if (students.length === 0) {
      alert("Tidak ada data nilai untuk diunduh!");
      return;
    }

    const doc = new jsPDF();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text("SD Islam Baiturrachman", 14, 18);

    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Sistem Informasi Monitoring Nilai Ekstrakurikuler", 14, 24);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, 28, 196, 28);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(37, 99, 235);
    doc.text(`REKAP NILAI EKSTRAKURIKULER`, 14, 38);

    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`Ekstrakurikuler : ${ekskulInfo?.name || "—"}`, 14, 44);
    doc.text(`Tahun Akademik  : ${ekskulInfo?.academicYear || "—"} - Semester ${ekskulInfo?.semester || "—"}`, 14, 50);

    const headers = ["No", "Nama Siswa", "NISN", "Kelas", "Gender", "Nilai Ekskul", "Catatan"];
    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      s.name,
      s.nisn,
      s.className,
      s.gender,
      s.score !== null ? s.score : "—",
      s.notes || "—",
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 56,
      theme: "grid",
      headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: "bold", fontSize: 9 },
      styles: { fontSize: 8.5, cellPadding: 3 },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { halign: "left" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "center" },
        6: { halign: "left" },
      },
    });

    const fileName = `Rekap_Nilai_Ekskul_${(ekskulInfo?.name || "Ekskul").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
    doc.save(fileName);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery)
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/nilai-ekskul">
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-[#1e293b]">
              {ekskulInfo ? ekskulInfo.name : "Nilai Ekstrakurikuler"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {ekskulInfo
                ? `TA ${ekskulInfo.academicYear} - Semester ${ekskulInfo.semester}`
                : "Memuat info..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch xl:self-auto">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 py-2.5 px-5 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8] whitespace-nowrap transition-all"
          >
            <Download className="w-4 h-4" />
            Download Rekap PDF
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Anggota", value: students.length, icon: "👥" },
          { label: "Sudah Dinilai", value: students.filter(s => s.score !== null).length, icon: "✅" },
          { label: "Belum Dinilai", value: students.filter(s => s.score === null).length, icon: "⏳" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_25px_rgb(0,0,0,0.01)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl">{stat.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
        {/* Search Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-slate-800">Daftar Nilai Siswa</h2>
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari Nama Siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f4f7fc] border border-slate-100/50 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-bold">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              Memuat data nilai...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-bold">
              {students.length === 0 ? "Belum ada siswa terdaftar di ekskul ini." : "Tidak ada siswa ditemukan."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                  <th className="py-4 px-5 text-center">No</th>
                  <th className="py-4 px-5">Nama Siswa</th>
                  <th className="py-4 px-5 text-center">NISN</th>
                  <th className="py-4 px-5 text-center">Kelas</th>
                  <th className="py-4 px-5 text-center">Gender</th>
                  <th className="py-4 px-5 text-center w-32">Nilai Ekskul</th>
                  <th className="py-4 px-5">Catatan</th>
                  <th className="py-4 px-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => {
                  const key = String(s.studentPeriodId);
                  const edit = edits[key] || { score: "", notes: "" };
                  const isSaving = saving === key;
                  const hasScore = s.score !== null;

                  return (
                    <tr key={s.studentPeriodId} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-5 text-center text-xs font-bold text-slate-400">{idx + 1}</td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-extrabold text-blue-600 shrink-0">
                            {s.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-800">{s.name}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-center text-xs font-semibold text-slate-500">{s.nisn}</td>
                      <td className="py-4 px-5 text-center text-xs font-semibold text-slate-600">{s.className}</td>
                      <td className="py-4 px-5 text-center text-xs font-semibold text-slate-500">{s.gender}</td>

                      {/* Nilai Input */}
                      <td className="py-4 px-5 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={0.5}
                          placeholder="0-100"
                          value={edit.score}
                          onChange={(e) =>
                            setEdits((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], score: e.target.value },
                            }))
                          }
                          className="w-24 px-3 py-2 text-center border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      {/* Catatan Input */}
                      <td className="py-4 px-5">
                        <input
                          type="text"
                          placeholder="Catatan..."
                          value={edit.notes}
                          onChange={(e) =>
                            setEdits((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], notes: e.target.value },
                            }))
                          }
                          className="w-full min-w-[120px] px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => handleSave(s.studentPeriodId)}
                          disabled={isSaving}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-bold transition-all ${
                            hasScore
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          } disabled:opacity-50`}
                        >
                          <Save className="w-3 h-3" />
                          {isSaving ? "..." : hasScore ? "Update" : "Simpan"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NilaiEkskulLihatPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-slate-400 font-bold">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        Memuat halaman...
      </div>
    }>
      <NilaiEkskulContent />
    </Suspense>
  );
}
