"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Download,
  GraduationCap,
  Users,
  User,
  Info,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Save,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// PDF printing dependencies
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface RecentAttendance {
  id: string;
  name: string;
  role: string;
  time: string;
  status: "Hadir" | "Terlambat" | "Absen" | "Sakit" | "Izin" | "Alfa";
  initials: string;
}

export default function AbsensiPage() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"monitoring" | "presensi" | "riwayat">("monitoring");
  
  // Presensi Sub-Tabs
  const [presensiType, setPresensiType] = useState<"siswa" | "guru" | "coach" | "ekskul">("siswa");

  // Riwayat Sub-Tabs
  const [riwayatType, setRiwayatType] = useState<"siswa" | "guru" | "coach" | "ekskul">("siswa");

  // Filter & Mock States for Monitoring Tab
  const [semesterFilter, setSemesterFilter] = useState("Semester Ganjil 2023");
  const chartData = [
    { month: "Jul", studentHeight: "72%", staffHeight: "78%" },
    { month: "Agu", studentHeight: "82%", staffHeight: "85%" },
    { month: "Sep", studentHeight: "68%", staffHeight: "78%" },
    { month: "Okt", studentHeight: "86%", staffHeight: "84%" },
    { month: "Nov", studentHeight: "72%", staffHeight: "76%" },
    { month: "Des", studentHeight: "89%", staffHeight: "88%" },
  ];

  const recentAttendanceData: RecentAttendance[] = [
    { id: "1", name: "Ahmad Subarkah", role: "Guru Matematika", time: "07:05 WIB", status: "Hadir", initials: "AS" },
    { id: "2", name: "Budi Raharjo", role: "Coach Renang", time: "07:45 WIB", status: "Terlambat", initials: "BR" },
    { id: "3", name: "Citra Putri", role: "Siswa Kelas 4A", time: "—", status: "Absen", initials: "CP" },
  ];

  // --- MONITORING STATS STATES ---
  const [teacherRate, setTeacherRate] = useState("—%");
  const [coachRate, setCoachRate] = useState("—%");
  const [studentRate, setStudentRate] = useState("—%");
  const [chartDataList, setChartDataList] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<RecentAttendance[]>([]);

  // --- DATABASE SELECT OPTIONS STATES ---
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [riwayatSubjects, setRiwayatSubjects] = useState<any[]>([]);
  const [extracurriculars, setExtracurriculars] = useState<any[]>([]);
  
  // --- FORM INPUT STATES ---
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  
  // 1. Siswa (Class/Subject) Form
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [studentAttMap, setStudentAttMap] = useState<{ [id: string]: string }>({});

  // 1b. Riwayat Siswa
  const [selectedRiwayatClassId, setSelectedRiwayatClassId] = useState<string>("");
  const [selectedRiwayatSubjectId, setSelectedRiwayatSubjectId] = useState<string>("");

  // 2. Guru Form
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const [teacherAttMap, setTeacherAttMap] = useState<{ [id: string]: { status: string; checkInTime: string; checkOutTime: string } }>({});

  // 3. Coach Form
  const [coachesList, setCoachesList] = useState<any[]>([]);
  const [coachAttMap, setCoachAttMap] = useState<{ [id: string]: { status: string; checkInTime: string; checkOutTime: string } }>({});

  // 4. Ekskul Form
  const [selectedEkskulId, setSelectedEkskulId] = useState<string>("");
  const [ekskulStudents, setEkskulStudents] = useState<any[]>([]);
  const [ekskulAttMap, setEkskulAttMap] = useState<{ [id: string]: string }>({});

  // 4b. Riwayat Ekskul
  const [selectedRiwayatEkskulId, setSelectedRiwayatEkskulId] = useState<string>("");

  const [saving, setSaving] = useState(false);

  // Set default dates safely using local timezone
  useEffect(() => {
    const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    const today = new Date(Date.now() - tzoffset).toISOString().slice(0, 10);
    setSelectedDate(today);
    setEndDate(today);

    // Default start date to 30 days ago
    const thirtyDaysAgo = new Date(Date.now() - tzoffset - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    setStartDate(thirtyDaysAgo);
  }, []);

  // Fetch Dashboard Stats (rates, trends, logs)
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/absensi/stats");
        const data = await res.json();
        if (data.success) {
          setTeacherRate(data.data.rates.teacher);
          setCoachRate(data.data.rates.coach);
          setStudentRate(data.data.rates.student);
          setChartDataList(data.data.chart);
          setRecentLogs(data.data.recent);
        }
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      }
    }
    fetchStats();
  }, [activeTab]);

  // Fetch Master Data (Classes and Extracurriculars)
  useEffect(() => {
    async function fetchMasterData() {
      try {
        const [resClasses, resExtracurriculars] = await Promise.all([
          fetch("/api/classes").then((r) => r.json()),
          fetch("/api/extracurriculars").then((r) => r.json())
        ]);
        if (resClasses.success) setClasses(resClasses.data);
        if (resExtracurriculars.success) setExtracurriculars(resExtracurriculars.data);
      } catch (err) {
        console.error("Error loading master data:", err);
      }
    }
    fetchMasterData();
  }, []);

  // Fetch subjects and students (with attendance) when selected class or date changes
  useEffect(() => {
    if (!selectedClassId || !selectedDate) {
      setSubjects([]);
      setStudents([]);
      return;
    }

    async function fetchClassDetails() {
      try {
        const [resSubj, resAtt] = await Promise.all([
          fetch(`/api/classes/${selectedClassId}/subjects`).then((r) => r.json()),
          fetch(`/api/absensi?type=students&date=${selectedDate}&classId=${selectedClassId}`).then((r) => r.json())
        ]);

        if (resSubj.success) setSubjects(resSubj.data);
        if (resAtt.success) {
          setStudents(resAtt.data);
          const initialMap: { [id: string]: string } = {};
          resAtt.data.forEach((s: any) => {
            initialMap[s.id] = s.status || "Hadir";
          });
          setStudentAttMap(initialMap);
        }
      } catch (err) {
        console.error("Error loading class details:", err);
      }
    }
    fetchClassDetails();
  }, [selectedClassId, selectedDate]);

  // Fetch subjects for Riwayat class changes
  useEffect(() => {
    if (!selectedRiwayatClassId) {
      setRiwayatSubjects([]);
      return;
    }
    async function fetchRiwayatSubjects() {
      try {
        const res = await fetch(`/api/classes/${selectedRiwayatClassId}/subjects`);
        const data = await res.json();
        if (data.success) {
          setRiwayatSubjects(data.data);
        }
      } catch (err) {
        console.error("Error loading class subjects:", err);
      }
    }
    fetchRiwayatSubjects();
  }, [selectedRiwayatClassId]);

  // Fetch teachers when entering teachers tab or when date changes
  useEffect(() => {
    if (presensiType !== "guru" || !selectedDate) return;
    async function fetchTeachers() {
      try {
        const res = await fetch(`/api/absensi?type=teachers&date=${selectedDate}`);
        const data = await res.json();
        if (data.success) {
          setTeachersList(data.data);
          const initialMap: { [id: string]: { status: string; checkInTime: string; checkOutTime: string } } = {};
          data.data.forEach((t: any) => {
            initialMap[t.id] = {
              status: t.status || "Hadir",
              checkInTime: t.checkInTime || "07:00",
              checkOutTime: t.checkOutTime || "14:00"
            };
          });
          setTeacherAttMap(initialMap);
        }
      } catch (err) {
        console.error("Error loading teachers:", err);
      }
    }
    fetchTeachers();
  }, [presensiType, selectedDate]);

  // Fetch coaches when entering coaches tab or when date changes
  useEffect(() => {
    if (presensiType !== "coach" || !selectedDate) return;
    async function fetchCoaches() {
      try {
        const res = await fetch(`/api/absensi?type=coaches&date=${selectedDate}`);
        const data = await res.json();
        if (data.success) {
          setCoachesList(data.data);
          const initialMap: { [id: string]: { status: string; checkInTime: string; checkOutTime: string } } = {};
          data.data.forEach((c: any) => {
            initialMap[c.id] = {
              status: c.status || "Hadir",
              checkInTime: c.checkInTime || "15:00",
              checkOutTime: c.checkOutTime || "17:00"
            };
          });
          setCoachAttMap(initialMap);
        }
      } catch (err) {
        console.error("Error loading coaches:", err);
      }
    }
    fetchCoaches();
  }, [presensiType, selectedDate]);

  // Fetch extracurricular students and their attendance when selected ekskul or date changes
  useEffect(() => {
    if (!selectedEkskulId || !selectedDate) {
      setEkskulStudents([]);
      return;
    }

    async function fetchEkskulStudents() {
      try {
        const res = await fetch(`/api/absensi?type=ekskul&date=${selectedDate}&extracurricularId=${selectedEkskulId}`);
        const data = await res.json();
        if (data.success) {
          setEkskulStudents(data.data);
          const initialMap: { [id: string]: string } = {};
          data.data.forEach((s: any) => {
            initialMap[s.id] = s.status || "Hadir";
          });
          setEkskulAttMap(initialMap);
        }
      } catch (err) {
        console.error("Error loading ekskul students:", err);
      }
    }
    fetchEkskulStudents();
  }, [selectedEkskulId, selectedDate]);

  // Helper to change student attendance status
  const handleStudentAttChange = (studentId: string, status: string) => {
    setStudentAttMap((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Helper to change teacher attendance status/times
  const handleTeacherAttChange = (
    teacherId: string,
    updates: Partial<{ status: string; checkInTime: string; checkOutTime: string }>
  ) => {
    setTeacherAttMap((prev) => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        ...updates
      }
    }));
  };

  // Helper to change coach attendance status/times
  const handleCoachAttChange = (
    coachId: string,
    updates: Partial<{ status: string; checkInTime: string; checkOutTime: string }>
  ) => {
    setCoachAttMap((prev) => ({
      ...prev,
      [coachId]: {
        ...prev[coachId],
        ...updates
      }
    }));
  };

  // Helper to change ekskul student attendance status
  const handleEkskulAttChange = (studentId: string, status: string) => {
    setEkskulAttMap((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Format YYYY-MM-DD date safely into Indonesian date format without timezone shifting
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
    } catch (e) {
      return dateStr;
    }
  };

  // Submit Handler for all Forms
  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let payload: any = {
      type: presensiType,
      date: selectedDate
    };

    if (presensiType === "siswa") {
      if (!selectedClassId) {
        alert("Pilih Kelas terlebih dahulu");
        setSaving(false);
        return;
      }
      payload.classId = selectedClassId;
      payload.subjectId = selectedSubjectId;
      payload.attendance = Object.entries(studentAttMap).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        status
      }));
    } else if (presensiType === "guru") {
      payload.attendance = Object.entries(teacherAttMap).map(([teacherId, val]) => ({
        teacherId: parseInt(teacherId),
        status: val.status,
        checkInTime: `${val.checkInTime} WIB`,
        checkOutTime: `${val.checkOutTime} WIB`
      }));
    } else if (presensiType === "coach") {
      payload.attendance = Object.entries(coachAttMap).map(([coachId, val]) => ({
        coachId: parseInt(coachId),
        status: val.status,
        checkInTime: `${val.checkInTime} WIB`,
        checkOutTime: `${val.checkOutTime} WIB`
      }));
    } else if (presensiType === "ekskul") {
      if (!selectedEkskulId) {
        alert("Pilih Kegiatan Ekstrakurikuler terlebih dahulu");
        setSaving(false);
        return;
      }
      payload.extracurricularId = selectedEkskulId;
      payload.attendance = Object.entries(ekskulAttMap).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        status
      }));
    }

    try {
      const response = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Presensi berhasil dicatat!");
        
        // Refresh values after saving
        if (presensiType === "siswa") {
          const resAtt = await fetch(`/api/absensi?type=students&date=${selectedDate}&classId=${selectedClassId}`).then((r) => r.json());
          if (resAtt.success) {
            setStudents(resAtt.data);
            const initialMap: { [id: string]: string } = {};
            resAtt.data.forEach((s: any) => {
              initialMap[s.id] = s.status || "Hadir";
            });
            setStudentAttMap(initialMap);
          }
        } else if (presensiType === "guru") {
          const res = await fetch(`/api/absensi?type=teachers&date=${selectedDate}`).then((r) => r.json());
          if (res.success) {
            setTeachersList(res.data);
            const initialMap: { [id: string]: { status: string; checkInTime: string; checkOutTime: string } } = {};
            res.data.forEach((t: any) => {
              initialMap[t.id] = {
                status: t.status || "Hadir",
                checkInTime: t.checkInTime || "07:00",
                checkOutTime: t.checkOutTime || "14:00"
              };
            });
            setTeacherAttMap(initialMap);
          }
        } else if (presensiType === "coach") {
          const res = await fetch(`/api/absensi?type=coaches&date=${selectedDate}`).then((r) => r.json());
          if (res.success) {
            setCoachesList(res.data);
            const initialMap: { [id: string]: { status: string; checkInTime: string; checkOutTime: string } } = {};
            res.data.forEach((c: any) => {
              initialMap[c.id] = {
                status: c.status || "Hadir",
                checkInTime: c.checkInTime || "15:00",
                checkOutTime: c.checkOutTime || "17:00"
              };
            });
            setCoachAttMap(initialMap);
          }
        } else if (presensiType === "ekskul") {
          const res = await fetch(`/api/absensi?type=ekskul&date=${selectedDate}&extracurricularId=${selectedEkskulId}`).then((r) => r.json());
          if (res.success) {
            setEkskulStudents(res.data);
            const initialMap: { [id: string]: string } = {};
            res.data.forEach((s: any) => {
              initialMap[s.id] = s.status || "Hadir";
            });
            setEkskulAttMap(initialMap);
          }
        }
      } else {
        alert(data.message || "Gagal mencatat presensi");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  };

  // PDF report generation for history
  const handlePrintPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Pilih Tanggal Mulai dan Tanggal Akhir");
      return;
    }

    setSaving(true);

    let queryParams = new URLSearchParams({
      type: riwayatType,
      startDate,
      endDate
    });

    let titleText = "";
    let subTitleText = "";

    if (riwayatType === "siswa") {
      if (!selectedRiwayatClassId) {
        alert("Pilih Kelas terlebih dahulu");
        setSaving(false);
        return;
      }
      queryParams.append("classId", selectedRiwayatClassId);
      const cls = classes.find((c) => c.id === parseInt(selectedRiwayatClassId));
      titleText = `Laporan Kehadiran Siswa Kelas ${cls?.name || ""}`;
      const subj = riwayatSubjects.find((s) => s.id === selectedRiwayatSubjectId);
      if (subj) {
        subTitleText = `Mata Pelajaran: ${subj.name} (${subj.code})`;
      }
    } else if (riwayatType === "guru") {
      titleText = "Laporan Kehadiran Guru";
    } else if (riwayatType === "coach") {
      titleText = "Laporan Kehadiran Coach";
    } else if (riwayatType === "ekskul") {
      if (!selectedRiwayatEkskulId) {
        alert("Pilih Kegiatan Ekstrakurikuler terlebih dahulu");
        setSaving(false);
        return;
      }
      queryParams.append("extracurricularId", selectedRiwayatEkskulId);
      const eks = extracurriculars.find((e) => e.id === parseInt(selectedRiwayatEkskulId));
      titleText = `Laporan Kehadiran Ekskul ${eks?.name || ""}`;
    }

    try {
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

      // Group records by Date to generate distinct sections (per tanggal)
      const groupedByDate: { [date: string]: any[] } = {};
      records.forEach((r: any) => {
        const d = r.date;
        if (!groupedByDate[d]) {
          groupedByDate[d] = [];
        }
        groupedByDate[d].push(r);
      });

      // Sort dates chronologically
      const sortedDates = Object.keys(groupedByDate).sort();

      // Initialize jsPDF
      const doc = new jsPDF();

      // Report Header styling (Modern & Clean)
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(30, 41, 59); // Slate-800
      doc.text("SD Islam Baiturrachman", 14, 18);

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text("Sistem Informasi Monitoring Presensi", 14, 24);

      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.setLineWidth(0.5);
      doc.line(14, 28, 196, 28);

      // Report Title
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(37, 99, 235); // Blue-600
      doc.text(titleText, 14, 38);

      doc.setFontSize(9);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(71, 85, 105); // Slate-600
      
      const formattedPeriod = `Periode: ${formatIndonesianDate(startDate)} s/d ${formatIndonesianDate(endDate)}`;
      if (subTitleText) {
        doc.text(subTitleText, 14, 44);
        doc.text(formattedPeriod, 14, 50);
      } else {
        doc.text(formattedPeriod, 14, 44);
      }

      let currentY = subTitleText ? 56 : 50;

      // Loop and print grouped tables per date
      sortedDates.forEach((date, dateIdx) => {
        // Prevent printing header too low on page
        if (currentY > 240) {
          doc.addPage();
          currentY = 20;
        }

        // Section header for Date
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42); // Slate-900 (High contrast)
        doc.text(`Hari / Tanggal: ${formatIndonesianDate(date)}`, 14, currentY);
        currentY += 4;

        const dateRecords = groupedByDate[date];
        let headers: string[] = [];
        let rows: any[] = [];

        if (riwayatType === "siswa") {
          headers = ["No", "Nama Siswa", "NISN", "Status Kehadiran"];
          rows = dateRecords.map((r: any, idx: number) => [
            idx + 1,
            r.name,
            r.nisn,
            r.attendanceStatus
          ]);
        } else if (riwayatType === "guru") {
          headers = ["No", "Nama Guru", "NIP", "Waktu Masuk", "Waktu Keluar", "Status"];
          rows = dateRecords.map((r: any, idx: number) => [
            idx + 1,
            r.name,
            r.nip,
            r.checkInTime || "-- : --",
            r.checkOutTime || "-- : --",
            r.attendanceStatus
          ]);
        } else if (riwayatType === "coach") {
          headers = ["No", "Nama Coach", "ID Number", "Waktu Masuk", "Waktu Keluar", "Status"];
          rows = dateRecords.map((r: any, idx: number) => [
            idx + 1,
            r.name,
            r.idNumber,
            r.checkInTime || "-- : --",
            r.checkOutTime || "-- : --",
            r.attendanceStatus
          ]);
        } else if (riwayatType === "ekskul") {
          headers = ["No", "Nama Siswa", "Kelas", "NISN", "Status"];
          rows = dateRecords.map((r: any, idx: number) => [
            idx + 1,
            r.name,
            r.classLabel || "—",
            r.nisn,
            r.attendanceStatus
          ]);
        }

        // Print table using jsPDF autoTable with high-contrast borders and headers
        autoTable(doc, {
          head: [headers],
          body: rows,
          startY: currentY,
          theme: "grid",
          headStyles: {
            fillColor: [15, 23, 42], // Slate-900 for premium contrast
            textColor: 255,
            fontStyle: "bold",
            fontSize: 9
          },
          styles: {
            fontSize: 8.5,
            textColor: [30, 41, 59], // Slate-800 body text
            lineColor: [148, 163, 184], // Slate-400 borders (high contrast)
            lineWidth: 0.4
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252] // Light slate background for alternating rows
          },
          columnStyles: {
            0: { cellWidth: 10, halign: "center" }
          },
          margin: { left: 14, right: 14 },
          didParseCell: (cellData) => {
            // Apply colored highlights to status column cells
            if (cellData.section === "body" && cellData.column.index === headers.length - 1) {
              const statusText = String(cellData.cell.raw).trim();
              if (statusText === "Hadir") {
                cellData.cell.styles.textColor = [16, 185, 129]; // Emerald-500
                cellData.cell.styles.fontStyle = "bold";
              } else if (statusText === "Absen" || statusText === "Alfa") {
                cellData.cell.styles.textColor = [239, 68, 68]; // Rose-500
                cellData.cell.styles.fontStyle = "bold";
              } else if (statusText === "Terlambat" || statusText === "Sakit" || statusText === "Izin") {
                cellData.cell.styles.textColor = [245, 158, 11]; // Amber-500
                cellData.cell.styles.fontStyle = "bold";
              }
            }
          }
        });

        // Set currentY to the coordinate after the current table + space
        currentY = (doc as any).lastAutoTable.finalY + 12;
      });

      // Download compiled PDF
      doc.save(`Laporan_Presensi_${riwayatType}_${startDate}_to_${endDate}.pdf`);

    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mencetak PDF");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Navigation Title Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#2563eb]">Monitoring Absensi</span>
          </div>
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Monitoring Kehadiran</h1>
          <p className="text-sm text-slate-400 mt-1">
            Ringkasan data kehadiran harian, tren akademik, dan pencatatan presensi.
          </p>
        </div>

        {/* Date picker top right */}
        {activeTab === "monitoring" && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-[#2563eb] rounded-xl text-xs font-bold border border-blue-100 shadow-sm">
              <Calendar className="w-4 h-4" />
              12 Okt 2023 - Hari Ini
            </div>
            <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
              <Download className="w-4 h-4" />
              Download Rekapitulasi
            </Button>
          </div>
        )}
      </div>

      {/* Tabs Selector Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("monitoring")}
          className={`py-4 px-6 font-bold text-sm border-b-2 transition-all ${
            activeTab === "monitoring"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Dashboard Monitoring Kehadiran
        </button>
        <button
          onClick={() => setActiveTab("presensi")}
          className={`py-4 px-6 font-bold text-sm border-b-2 transition-all ${
            activeTab === "presensi"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Lakukan Presensi
        </button>
        <button
          onClick={() => setActiveTab("riwayat")}
          className={`py-4 px-6 font-bold text-sm border-b-2 transition-all ${
            activeTab === "riwayat"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Riwayat Presensi
        </button>
      </div>

      {/* TAB CONTENT 1: MONITORING */}
      {activeTab === "monitoring" && (
        <>
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Presensi Guru */}
            <Link href="/dashboard/absensi/guru" className="block hover:opacity-95 transition-all">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] h-full">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-lg bg-blue-50 text-[#2563eb]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-400">Presensi Guru</span>
                  <span className="text-3xl font-extrabold text-slate-800 mt-2">{teacherRate}</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-3">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+1.5% dari bulan lalu</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Presensi Coach */}
            <Link href="/dashboard/absensi/coach" className="block hover:opacity-95 transition-all">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] h-full">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-lg bg-emerald-50 text-[#10b981]">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-400">Presensi Coach</span>
                  <span className="text-3xl font-extrabold text-slate-800 mt-2">{coachRate}</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-3">
                    <span>— Stabil dalam 7 hari</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Presensi Siswa */}
            <Link href="/dashboard/absensi/siswa" className="block hover:opacity-95 transition-all">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] h-full">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                    <User className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-400">Presensi Siswa</span>
                  <span className="text-3xl font-extrabold text-slate-800 mt-2">{studentRate}</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-rose-500 mt-3">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>-0.8% karena musim flu</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Monthly Attendance Trend Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Tren Kehadiran Bulanan</h2>
                <p className="text-xs text-slate-400 mt-1">Data kumulatif seluruh entitas akademik</p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span>
                    Siswa
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                    Staf/Guru
                  </div>
                </div>
                <select
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option>Semester Ganjil 2023</option>
                  <option>Semester Genap 2024</option>
                </select>
              </div>
            </div>

            {/* Custom Bar Chart */}
            <div className="h-64 flex items-end justify-between px-4 sm:px-12 border-b border-slate-100 pb-2 relative mt-4">
              {chartDataList && chartDataList.length > 0 ? (
                chartDataList.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-3 w-16">
                    <div className="h-48 flex items-end gap-2 justify-center w-full">
                      <div
                        style={{ height: data.studentHeight }}
                        className="w-3.5 bg-[#2563eb] rounded-full hover:opacity-90 transition-all cursor-pointer"
                      ></div>
                      <div
                        style={{ height: data.staffHeight }}
                        className="w-3.5 bg-[#10b981] rounded-full hover:opacity-90 transition-all cursor-pointer"
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{data.month}</span>
                  </div>
                ))
              ) : (
                chartData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-3 w-16">
                    <div className="h-48 flex items-end gap-2 justify-center w-full">
                      <div
                        style={{ height: data.studentHeight }}
                        className="w-3.5 bg-[#2563eb] rounded-full hover:opacity-90 transition-all cursor-pointer"
                      ></div>
                      <div
                        style={{ height: data.staffHeight }}
                        className="w-3.5 bg-[#10b981] rounded-full hover:opacity-90 transition-all cursor-pointer"
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{data.month}</span>
                  </div>
                ))
              )}
            </div>

            {/* Alert banner/info box */}
            <div className="bg-blue-50/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-50">
              <div className="flex items-center gap-3 text-xs text-slate-600 leading-relaxed">
                <Info className="w-5 h-5 text-[#2563eb] shrink-0" />
                <span>
                  Rata-rata kehadiran tertinggi terjadi pada bulan <strong>Desember (97.5%)</strong>.
                  Persiapkan strategi untuk menjaga tren ini.
                </span>
              </div>
              <button className="text-xs font-extrabold text-[#2563eb] hover:text-blue-700 whitespace-nowrap">
                Lihat Detail Analitik
              </button>
            </div>
          </div>

          {/* Recent Attendance Status Table */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Status Kehadiran Terbaru</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fafbfc] border-b border-slate-100 text-[10px] font-extrabold text-slate-400 tracking-wider">
                    <th className="py-4.5 px-6">Nama</th>
                    <th className="py-4.5 px-6">Peran</th>
                    <th className="py-4.5 px-6">Waktu Absen</th>
                    <th className="py-4.5 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {recentLogs && recentLogs.length > 0 ? (
                    recentLogs.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-[#2563eb] font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                            {row.initials}
                          </div>
                          <span className="font-bold text-slate-800">{row.name}</span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-500">{row.role}</td>
                        <td className="py-4 px-6 font-semibold text-slate-500">{row.time}</td>
                        <td className="py-4 px-6">
                          {row.status === "Hadir" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-[10px] font-bold text-emerald-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {row.status}
                            </span>
                          )}
                          {(row.status === "Terlambat" || row.status === "Sakit" || row.status === "Izin") && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-100 bg-amber-50 text-[10px] font-bold text-amber-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              {row.status}
                            </span>
                          )}
                          {(row.status === "Absen" || row.status === "Alfa") && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-rose-100 bg-rose-50 text-[10px] font-bold text-rose-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              {row.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    recentAttendanceData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-[#2563eb] font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                            {row.initials}
                          </div>
                          <span className="font-bold text-slate-800">{row.name}</span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-500">{row.role}</td>
                        <td className="py-4 px-6 font-semibold text-slate-500">{row.time}</td>
                        <td className="py-4 px-6">
                          {row.status === "Hadir" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-[10px] font-bold text-emerald-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {row.status}
                            </span>
                          )}
                          {row.status === "Terlambat" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-100 bg-amber-50 text-[10px] font-bold text-amber-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              {row.status}
                            </span>
                          )}
                          {row.status === "Absen" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-rose-100 bg-rose-50 text-[10px] font-bold text-rose-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              {row.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-center">
              <button className="text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-6 py-2.5 hover:bg-slate-50 transition-all">
                Lihat Semua Riwayat
              </button>
            </div>
          </div>
        </>
      )}

      {/* TAB CONTENT 2: LAKUKAN PRESENSI */}
      {activeTab === "presensi" && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-6">
            {/* Presensi Sub-navigation */}
            <div className="flex flex-wrap bg-slate-50 border border-slate-100 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setPresensiType("siswa")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  presensiType === "siswa" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Presensi Siswa (Kelas/Mapel)
              </button>
              <button
                type="button"
                onClick={() => setPresensiType("guru")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  presensiType === "guru" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Presensi Guru
              </button>
              <button
                type="button"
                onClick={() => setPresensiType("coach")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  presensiType === "coach" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Presensi Coach
              </button>
              <button
                type="button"
                onClick={() => setPresensiType("ekskul")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  presensiType === "ekskul" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Presensi Ekskul
              </button>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Tanggal Presensi:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <form onSubmit={handleSaveAttendance} className="flex flex-col gap-6">
            
            {/* SUB-FORM 1: PRESENSI SISWA KELAS / MAPEL */}
            {presensiType === "siswa" && (
              <div className="flex flex-col gap-6">
                {/* Selection Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500">Pilih Kelas</label>
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
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
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
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

                {/* Students Checklist Table */}
                {selectedClassId && students.length > 0 ? (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm mt-4">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#fafbfc] border-b border-slate-100 text-[10px] font-extrabold text-slate-400 tracking-wider">
                          <th className="py-4 px-6">Nama Siswa</th>
                          <th className="py-4 px-6">NISN</th>
                          <th className="py-4 px-6">Status Presensi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                        {students.map((student) => {
                          const currentStatus = studentAttMap[student.id] || "Hadir";
                          return (
                            <tr key={student.id} className="hover:bg-slate-50/50 transition-all">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                                    {student.initials}
                                  </div>
                                  <span className="font-bold text-slate-800">{student.name}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-slate-400">{student.nisn}</td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  {["Hadir", "Sakit", "Izin", "Alfa"].map((st) => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => handleStudentAttChange(student.id, st)}
                                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                                        currentStatus === st
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
                ) : (
                  selectedClassId && (
                    <div className="py-12 text-center text-slate-400 font-bold">
                      Tidak ada siswa dalam kelas ini.
                    </div>
                  )
                )}
              </div>
            )}

            {/* SUB-FORM 2: PRESENSI GURU */}
            {presensiType === "guru" && (
              <div className="flex flex-col gap-6">
                {teachersList.length > 0 ? (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm mt-4">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#fafbfc] border-b border-slate-100 text-[10px] font-extrabold text-slate-400 tracking-wider">
                          <th className="py-4 px-6">Nama Guru</th>
                          <th className="py-4 px-6">NIP</th>
                          <th className="py-4 px-6">Waktu Masuk</th>
                          <th className="py-4 px-6">Waktu Keluar</th>
                          <th className="py-4 px-6">Status Presensi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                        {teachersList.map((teacher) => {
                          const state = teacherAttMap[teacher.id] || { status: "Hadir", checkInTime: "07:00", checkOutTime: "14:00" };
                          return (
                            <tr key={teacher.id} className="hover:bg-slate-50/50 transition-all">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                                    {teacher.initials}
                                  </div>
                                  <span className="font-bold text-slate-800">{teacher.name}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-slate-400">{teacher.nip}</td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  <input
                                    type="time"
                                    value={state.checkInTime}
                                    onChange={(e) => handleTeacherAttChange(teacher.id, { checkInTime: e.target.value })}
                                    disabled={state.status === "Izin" || state.status === "Absen"}
                                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-600 disabled:opacity-50"
                                  />
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  <input
                                    type="time"
                                    value={state.checkOutTime}
                                    onChange={(e) => handleTeacherAttChange(teacher.id, { checkOutTime: e.target.value })}
                                    disabled={state.status === "Izin" || state.status === "Absen"}
                                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-600 disabled:opacity-50"
                                  />
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  {["Hadir", "Terlambat", "Izin", "Absen"].map((st) => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => handleTeacherAttChange(teacher.id, { status: st })}
                                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                                        state.status === st
                                          ? st === "Hadir"
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                            : st === "Terlambat"
                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                            : st === "Izin"
                                            ? "bg-blue-50 text-blue-600 border-blue-200"
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
                ) : (
                  <div className="py-12 text-center text-slate-400 font-bold">
                    Memuat data guru...
                  </div>
                )}
              </div>
            )}

            {/* SUB-FORM 3: PRESENSI COACH */}
            {presensiType === "coach" && (
              <div className="flex flex-col gap-6">
                {coachesList.length > 0 ? (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm mt-4">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#fafbfc] border-b border-slate-100 text-[10px] font-extrabold text-slate-400 tracking-wider">
                          <th className="py-4 px-6">Nama Coach</th>
                          <th className="py-4 px-6">ID Number</th>
                          <th className="py-4 px-6">Waktu Masuk</th>
                          <th className="py-4 px-6">Waktu Keluar</th>
                          <th className="py-4 px-6">Status Presensi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                        {coachesList.map((coach) => {
                          const state = coachAttMap[coach.id] || { status: "Hadir", checkInTime: "15:00", checkOutTime: "17:00" };
                          return (
                            <tr key={coach.id} className="hover:bg-slate-50/50 transition-all">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                                    {coach.initials}
                                  </div>
                                  <span className="font-bold text-slate-800">{coach.name}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-slate-400">{coach.idNumber}</td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  <input
                                    type="time"
                                    value={state.checkInTime}
                                    onChange={(e) => handleCoachAttChange(coach.id, { checkInTime: e.target.value })}
                                    disabled={state.status === "Izin" || state.status === "Absen"}
                                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-600 disabled:opacity-50"
                                  />
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  <input
                                    type="time"
                                    value={state.checkOutTime}
                                    onChange={(e) => handleCoachAttChange(coach.id, { checkOutTime: e.target.value })}
                                    disabled={state.status === "Izin" || state.status === "Absen"}
                                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-600 disabled:opacity-50"
                                  />
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  {["Hadir", "Terlambat", "Izin", "Absen"].map((st) => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => handleCoachAttChange(coach.id, { status: st })}
                                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                                        state.status === st
                                          ? st === "Hadir"
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                            : st === "Terlambat"
                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                            : st === "Izin"
                                            ? "bg-blue-50 text-blue-600 border-blue-200"
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
                ) : (
                  <div className="py-12 text-center text-slate-400 font-bold">
                    Memuat data coach...
                  </div>
                )}
              </div>
            )}

            {/* SUB-FORM 4: PRESENSI SISWA EKSTRAKURIKULER */}
            {presensiType === "ekskul" && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 max-w-md">
                  <label className="text-xs font-bold text-slate-500">Pilih Kegiatan Ekstrakurikuler</label>
                  <select
                    value={selectedEkskulId}
                    onChange={(e) => setSelectedEkskulId(e.target.value)}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="">-- Pilih Ekstrakurikuler --</option>
                    {extracurriculars.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} (Pelatih: {e.coachName || "—"})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedEkskulId && ekskulStudents.length > 0 ? (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm mt-4">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#fafbfc] border-b border-slate-100 text-[10px] font-extrabold text-slate-400 tracking-wider">
                          <th className="py-4 px-6">Nama Siswa</th>
                          <th className="py-4 px-6">Kelas</th>
                          <th className="py-4 px-6">NISN</th>
                          <th className="py-4 px-6">Status Presensi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                        {ekskulStudents.map((student) => {
                          const currentStatus = ekskulAttMap[student.id] || "Hadir";
                          
                          // Initials
                          const nameParts = student.name.trim().split(" ");
                          const initials = nameParts.length >= 2
                            ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                            : `${nameParts[0][0] || "S"}`.toUpperCase();

                          return (
                            <tr key={student.id} className="hover:bg-slate-50/50 transition-all">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                                    {initials}
                                  </div>
                                  <span className="font-bold text-slate-800">{student.name}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-slate-500 font-semibold">{student.class_label}</td>
                              <td className="py-4 px-6 text-slate-400">{student.nisn}</td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  {["Hadir", "Sakit", "Izin", "Alfa"].map((st) => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => handleEkskulAttChange(student.id, st)}
                                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                                        currentStatus === st
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
                ) : (
                  selectedEkskulId && (
                    <div className="py-12 text-center text-slate-400 font-bold">
                      Tidak ada siswa terdaftar dalam kegiatan ekskul ini.
                    </div>
                  )
                )}
              </div>
            )}

            {/* Save Button for Forms */}
            {((presensiType === "siswa" && selectedClassId && students.length > 0) ||
              (presensiType === "guru" && teachersList.length > 0) ||
              (presensiType === "coach" && coachesList.length > 0) ||
              (presensiType === "ekskul" && selectedEkskulId && ekskulStudents.length > 0)) && (
              <div className="flex justify-end border-t border-slate-100 pt-6 mt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="!w-auto !py-3 !px-8 flex items-center gap-2 rounded-xl font-bold text-xs bg-[#2563eb] text-white shadow-md hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Menyimpan..." : "Simpan Presensi"}
                </Button>
              </div>
            )}

          </form>
        </div>
      )}

      {/* TAB CONTENT 3: RIWAYAT PRESENSI */}
      {activeTab === "riwayat" && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-6">
            {/* Riwayat Sub-navigation */}
            <div className="flex flex-wrap bg-slate-50 border border-slate-100 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setRiwayatType("siswa")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  riwayatType === "siswa" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Kehadiran Siswa
              </button>
              <button
                type="button"
                onClick={() => setRiwayatType("guru")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  riwayatType === "guru" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Kehadiran Guru
              </button>
              <button
                type="button"
                onClick={() => setRiwayatType("coach")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  riwayatType === "coach" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Kehadiran Coach
              </button>
              <button
                type="button"
                onClick={() => setRiwayatType("ekskul")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  riwayatType === "ekskul" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Kehadiran Ekskul
              </button>
            </div>

            {/* Date Range Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Mulai:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Akhir:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          <form onSubmit={handlePrintPDF} className="flex flex-col gap-6">
            
            {/* Filter Inputs depending on selection */}
            {riwayatType === "siswa" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500">Pilih Kelas</label>
                  <select
                    value={selectedRiwayatClassId}
                    onChange={(e) => setSelectedRiwayatClassId(e.target.value)}
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
                  <label className="text-xs font-bold text-slate-500">Pilih Mata Pelajaran (Opsional)</label>
                  <select
                    value={selectedRiwayatSubjectId}
                    onChange={(e) => setSelectedRiwayatSubjectId(e.target.value)}
                    disabled={!selectedRiwayatClassId || riwayatSubjects.length === 0}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-50"
                  >
                    <option value="">-- Semua Mata Pelajaran --</option>
                    {riwayatSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code}) - {s.teacher}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {riwayatType === "ekskul" && (
              <div className="flex flex-col gap-2 max-w-md">
                <label className="text-xs font-bold text-slate-500">Pilih Kegiatan Ekstrakurikuler</label>
                <select
                  value={selectedRiwayatEkskulId}
                  onChange={(e) => setSelectedRiwayatEkskulId(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">-- Pilih Ekstrakurikuler --</option>
                  {extracurriculars.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} (Pelatih: {e.coachName || "—"})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Print Button Card (premium design) */}
            <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-6 mt-4 max-w-xl mx-auto">
              <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                <Printer className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-extrabold text-slate-800 text-sm">Cetak Laporan Riwayat Kehadiran</span>
                <span className="text-xs text-slate-400 font-medium leading-relaxed px-4">
                  Mengunduh laporan rekapitulasi kehadiran periode <strong>{formatIndonesianDate(startDate)} s/d {formatIndonesianDate(endDate)}</strong> dalam format PDF. Laporan ini dapat dicetak secara fisik.
                </span>
              </div>
              
              <Button
                type="submit"
                disabled={saving}
                className="!w-auto !py-3 !px-10 flex items-center gap-2 rounded-xl font-bold text-xs bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {saving ? "Menyiapkan PDF..." : "Unduh Laporan PDF (Cetak)"}
              </Button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}
