"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Camera,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TambahSiswaPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nisn, setNisn] = useState("");
  const [gender, setGender] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [classLabel, setClassLabel] = useState("");
  const [status, setStatus] = useState("Aktif");
  const [saving, setSaving] = useState(false);
  const [periodId, setPeriodId] = useState("");

  React.useEffect(() => {
    setPeriodId(localStorage.getItem("active_period_id") || "");
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          genderCode: gender,
          nisn,
          classLabel,
          status,
          periodId,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Data Siswa Berhasil Disimpan!");
        router.push("/dashboard/siswa");
      } else {
        alert(data.message || "Gagal menyimpan data");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  };

  const classOptions = [
    "Kelas 1-A", "Kelas 1-B",
    "Kelas 2-A", "Kelas 2-B",
    "Kelas 3-A", "Kelas 3-B",
    "Kelas 4-A", "Kelas 4-B",
    "Kelas 5-A", "Kelas 5-B",
    "Kelas 6-A", "Kelas 6-B",
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Tambah Siswa Baru</h1>
          <p className="text-sm text-slate-400 mt-1">
            Lengkapi formulir di bawah ini untuk mendaftarkan siswa baru.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3 self-stretch xl:self-auto">
          <Link href="/dashboard/siswa" className="flex-1 xl:flex-initial">
            <Button variant="secondary" className="!py-2.5 !px-5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg w-full">
              Batalkan
            </Button>
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 xl:flex-initial py-2.5 px-6 rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] text-xs font-bold flex items-center justify-center shadow-sm transition-all whitespace-nowrap disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Data Siswa"}
          </button>
        </div>
      </div>

      {/* Main split-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column Forms (Biodata, Kontak, Penempatan) */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col gap-6 w-full">
          
          {/* Card 1: Biodata Pribadi */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563eb]">
                <User className="w-4 h-4" />
              </div>
              1. Biodata Pribadi
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap Siswa</label>
              <input
                type="text"
                placeholder="Contoh: Muhammad Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NISN (Nomor Induk Siswa Nasional)</label>
                <input
                  type="text"
                  placeholder="10 Digit NISN"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jenis Kelamin</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tempat Lahir</label>
                <input
                  type="text"
                  placeholder="Kota Kelahiran"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Lahir</label>
                <div className="relative">
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm appearance-none pr-10"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Tempat Tinggal</label>
              <textarea
                placeholder="Jl. Anggrek No. 45, Kebayoran Baru..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm resize-none"
              ></textarea>
            </div>
          </div>

          {/* Card 2: Informasi Kontak Orang Tua */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Mail className="w-4 h-4" />
              </div>
              2. Informasi Kontak Orang Tua
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Orang Tua / Wali</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="orangtua@example.com"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nomor Telepon/WA</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="+62 812 3456 7890"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Penempatan Akademik */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <GraduationCap className="w-4 h-4" />
              </div>
              3. Penempatan Akademik
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          {/* Mobile Submit */}
          <div className="flex items-center justify-end gap-4 border-t border-slate-100/80 pt-4 mt-2 lg:hidden">
            <Link href="/dashboard/siswa">
              <span className="text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer px-4 py-2.5 rounded-lg">
                Batalkan
              </span>
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="py-2.5 px-6 rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] text-xs font-bold shadow-sm transition-all whitespace-nowrap disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Data Siswa"}
            </button>
          </div>

        </form>

        {/* Right Column (Foto Profil & Tips) */}
        <div className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0">
          
          {/* Card 1: Foto Profil Siswa */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center gap-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider self-start">Foto Profil Siswa</h4>

            <div className="relative">
              <div className={`w-24 h-24 rounded-2xl border shadow-md flex items-center justify-center font-extrabold text-xl ${
                gender === "P"
                  ? "bg-pink-50 text-pink-600 border-pink-100"
                  : "bg-blue-50 text-[#2563eb] border-blue-100"
              }`}>
                {name ? name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() : <User className="w-10 h-10 stroke-[1.5]" />}
              </div>
              <span className="absolute bottom-0 right-0 bg-[#2563eb] text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                <Camera className="w-3.5 h-3.5" />
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal px-2 font-medium">
              Rekomendasi ukuran: 500x500px (Max 2MB)
            </p>

            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all bg-white"
            >
              Pilih Foto
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
