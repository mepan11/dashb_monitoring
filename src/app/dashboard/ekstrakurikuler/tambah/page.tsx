"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AvailableStudentRow {
  id: string;
  name: string;
  className: string;
  nisn: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
}

export default function AddExtracurricularStudentPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(["2", "3"]); // Preselected Bagas & Citra

  const studentsList: AvailableStudentRow[] = [
    { id: "1", name: "Aditya Ardiansyah", className: "4-A", nisn: "0129384755", initials: "AA", avatarBg: "bg-blue-100", avatarText: "text-blue-600" },
    { id: "2", name: "Bagas Pratama", className: "5-C", nisn: "0129384812", initials: "BP", avatarBg: "bg-emerald-100", avatarText: "text-emerald-600" },
    { id: "3", name: "Citra Salsabila", className: "3-B", nisn: "0129384901", initials: "CS", avatarBg: "bg-amber-100", avatarText: "text-amber-600" },
    { id: "4", name: "Daffa Firdaus", className: "5-A", nisn: "0129385022", initials: "DF", avatarBg: "bg-indigo-100", avatarText: "text-indigo-600" },
    { id: "5", name: "Elena Maulida", className: "4-B", nisn: "0129385110", initials: "EM", avatarBg: "bg-purple-100", avatarText: "text-purple-600" },
    { id: "6", name: "Fathan Syah", className: "5-B", nisn: "0129385203", initials: "FS", avatarBg: "bg-slate-100", avatarText: "text-slate-600" },
  ];

  const handleCheckboxChange = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAdd = () => {
    alert(`${selectedIds.length} Siswa Berhasil Ditambahkan ke Ekstrakurikuler!`);
    router.push("/dashboard/ekstrakurikuler/detail");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-[0_4px_30px_rgb(0,0,0,0.03)] overflow-hidden flex flex-col gap-6">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-[#1e293b]">Tambah Siswa ke Ekstrakurikuler</h1>
          <p className="text-xs text-slate-400 mt-1">Robotik Dasar (Level 1)</p>
        </div>
        <Link href="/dashboard/ekstrakurikuler/detail">
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* Search Input Card */}
      <div className="px-6 flex flex-col gap-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            placeholder="Cari nama atau NISN siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#f4f7fc] border border-slate-100/50 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        {/* Sub-info bar */}
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
          <div className="flex gap-4">
            <span>Urutkan: <strong className="text-slate-700 font-bold">Nama (A-Z)</strong></span>
            <span>Filter: <strong className="text-slate-700 font-bold">Semua Kelas</strong></span>
          </div>
          <span className="text-[#2563eb] font-bold">124 Siswa Tersedia</span>
        </div>
      </div>

      {/* Table List container */}
      <div className="px-6 overflow-hidden">
        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                <th className="py-4 px-6 w-12 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedIds.length === studentsList.length}
                    onChange={() => {
                      if (selectedIds.length === studentsList.length) {
                        setSelectedIds([]);
                      } else {
                        setSelectedIds(studentsList.map((s) => s.id));
                      }
                    }}
                  />
                </th>
                <th className="py-4 px-6">Nama Siswa</th>
                <th className="py-4 px-6">Kelas</th>
                <th className="py-4 px-6">NISN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
              {studentsList.map((student) => {
                const isChecked = selectedIds.includes(student.id);
                return (
                  <tr
                    key={student.id}
                    className={`transition-all hover:bg-slate-50/50 ${
                      isChecked ? "bg-blue-50/30" : ""
                    }`}
                  >
                    
                    {/* Checkbox cell */}
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(student.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    {/* Name with initials avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${student.avatarBg} ${student.avatarText} font-bold flex items-center justify-center border border-slate-100 shadow-sm shrink-0`}>
                          {student.initials}
                        </div>
                        <span className="font-bold text-slate-800">{student.name}</span>
                      </div>
                    </td>

                    {/* Kelas */}
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {student.className}
                    </td>

                    {/* NISN */}
                    <td className="py-4 px-6 text-slate-400 font-medium">
                      {student.nisn}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer action bar */}
      <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
        
        {/* Selected count info with initials overlay */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {selectedIds.slice(0, 3).map((id) => {
              const student = studentsList.find((s) => s.id === id);
              if (!student) return null;
              return (
                <div
                  key={id}
                  className={`w-7 h-7 rounded-full ${student.avatarBg} ${student.avatarText} font-extrabold text-[9px] flex items-center justify-center border-2 border-white shadow-sm`}
                >
                  {student.initials}
                </div>
              );
            })}
          </div>
          <span className="text-xs font-bold text-slate-600">
            <strong className="text-slate-800 font-extrabold">{selectedIds.length} Siswa</strong> Terpilih
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/ekstrakurikuler/detail">
            <Button variant="secondary" className="!py-2.5 !px-5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg">
              Batalkan
            </Button>
          </Link>
          <button
            onClick={handleAdd}
            disabled={selectedIds.length === 0}
            className="py-2.5 px-6 rounded-lg bg-[#2563eb] text-white hover:bg-blue-700 disabled:opacity-50 text-xs font-bold flex items-center justify-center shadow-sm transition-all"
          >
            Tambahkan Siswa
          </button>
        </div>

      </div>

    </div>
  );
}
