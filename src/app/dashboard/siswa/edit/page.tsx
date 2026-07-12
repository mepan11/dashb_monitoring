"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save,
  User,
  Mail,
  Phone,
  GraduationCap,
  Camera,
  CheckCircle2,
  Calendar,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function EditSiswaPage() {
  const router = useRouter();
  const [name, setName] = useState("Aris Setiawan");
  const [nisn, setNisn] = useState("0098223145");
  const [gender, setGender] = useState("L");
  const [birthPlace, setBirthPlace] = useState("Jakarta");
  const [birthDate, setBirthDate] = useState("2012-05-14");
  const [address, setAddress] = useState("Jl. Mawar Melati No. 45, Kebayoran Baru, Jakarta Selatan, 12150");
  const [parentEmail, setParentEmail] = useState("orangtua@example.com");
  const [parentPhone, setParentPhone] = useState("+62 812 3456 7890");
  const [gradeLevel, setGradeLevel] = useState("5");
  const [section, setSection] = useState("B");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Perubahan Data Siswa Berhasil Disimpan!");
    router.push("/dashboard/siswa/profile");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Edit Data Siswa</h1>
          <p className="text-sm text-slate-400 mt-1">
            Perbarui informasi siswa dengan data terbaru.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3 self-stretch xl:self-auto">
          <Link href="/dashboard/siswa/profile" className="flex-1 xl:flex-initial">
            <Button variant="secondary" className="!py-2.5 !px-5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg w-full">
              Batalkan
            </Button>
          </Link>
          <button
            onClick={handleSave}
            className="flex-1 xl:flex-initial py-2.5 px-6 rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] text-xs font-bold flex items-center justify-center shadow-sm transition-all whitespace-nowrap"
          >
            Simpan Perubahan
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
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Tempat Tinggi</label>
              <textarea
                placeholder="Jl. Anggrek No. 45, Kebayoran Baru..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm resize-none"
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
                    required
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
                    required
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tingkat Kelas</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                >
                  <option value="">Pilih Kelas</option>
                  <option value="1">Kelas 1</option>
                  <option value="2">Kelas 2</option>
                  <option value="3">Kelas 3</option>
                  <option value="4">Kelas 4</option>
                  <option value="5">Kelas 5</option>
                  <option value="6">Kelas 6</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kelompok Belajar / Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                >
                  <option value="">Pilih Kelompok</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </div>
          </div>

        </form>

        {/* Right Column (Foto Profil & Progres & Tips) */}
        <div className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0">
          
          {/* Card 1: Foto Profil Siswa */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center gap-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider self-start">Foto Profil Siswa</h4>

            {/* Circular image placeholder */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-blue-50 text-[#2563eb] border border-blue-100 shadow-md flex items-center justify-center font-extrabold text-xl">
                AS
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
              Ganti Foto
            </button>
          </div>

          {/* Card 2: Progres Pendaftaran */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 font-extrabold text-sm">Kelengkapan Form</span>
              <span className="text-emerald-600">100%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div style={{ width: "100%" }} className="h-full bg-emerald-550 rounded-full"></div>
            </div>

            {/* Steps Checklist */}
            <div className="flex flex-col gap-3.5 mt-2">
              <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4 fill-emerald-50" />
                <span>Biodata Pribadi lengkap</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4 fill-emerald-50" />
                <span>Informasi Kontak lengkap</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4 fill-emerald-50" />
                <span>Penempatan Akademik sesuai</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4 fill-emerald-50" />
                <span>Kredensial Akun aktif</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4 fill-emerald-50" />
                <span>Unggah Foto Profil sesuai</span>
              </div>
            </div>
          </div>

          {/* Card 3: Tips Admin */}
          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-50 flex gap-4 shadow-sm">
            <Lightbulb className="w-6 h-6 text-[#2563eb] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5">
              <h4 className="text-xs font-extrabold text-slate-700">Tips Admin</h4>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                Pastikan NISN siswa valid dan sesuai dengan Dapodik untuk menghindari duplikasi data di sistem pusat.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
