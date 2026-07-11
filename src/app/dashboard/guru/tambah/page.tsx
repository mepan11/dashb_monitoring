"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save,
  Info,
  User,
  Mail,
  Phone,
  BookOpen,
  Camera,
  CheckCircle2,
  Calendar,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function TambahGuruPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isHomeroom, setIsHomeroom] = useState(false);
  const [homeroomClass, setHomeroomClass] = useState("");

  const [subjects, setSubjects] = useState(["Matematika", "IPA"]);
  const [classes, setClasses] = useState(["1-A", "2-C"]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Data Guru Berhasil Disimpan!");
    router.push("/dashboard/guru");
  };

  const handleRemoveSubject = (sub: string) => {
    setSubjects(subjects.filter((s) => s !== sub));
  };

  const handleRemoveClass = (cls: string) => {
    setClasses(classes.filter((c) => c !== cls));
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Tambah Guru Baru</h1>
          <p className="text-sm text-slate-400 mt-1">
            Lengkapi formulir di bawah ini dengan data yang valid untuk mendaftarkan tenaga pengajar baru ke dalam sistem EduSmart.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3 self-stretch xl:self-auto">
          <Link href="/dashboard/guru" className="flex-1 xl:flex-initial">
            <Button variant="secondary" className="!py-2.5 !px-5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg w-full">
              Batal
            </Button>
          </Link>
          <button
            onClick={handleSave}
            className="flex-1 xl:flex-initial py-2.5 px-5 rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all whitespace-nowrap"
          >
            <Save className="w-4 h-4" />
            Simpan Data Guru
          </button>
        </div>
      </div>

      {/* Main split-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column Forms (Biodata, Kontak, Penugasan) */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col gap-6 w-full">
          
          {/* Card 1: Biodata Pribadi */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563eb]">
                <User className="w-4 h-4" />
              </div>
              Biodata Pribadi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Nama Lengkap *"
                placeholder="Contoh: Dr. Budi Santoso, M.Pd"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="NIP / Nomor Induk Pegawai *"
                placeholder="Masukkan 18 digit NIP"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                required
              />

              <Input
                label="Tempat Lahir"
                placeholder="Kota Kelahiran"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Tanggal Lahir</label>
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
              <label className="text-sm font-medium text-slate-700">Jenis Kelamin *</label>
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
              <label className="text-sm font-medium text-slate-700">Alamat Tinggal Sesuai KTP</label>
              <textarea
                placeholder="Masukkan alamat lengkap"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm resize-none"
              ></textarea>
            </div>
          </div>

          {/* Card 2: Informasi Kontak */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Mail className="w-4 h-4" />
              </div>
              Informasi Kontak
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Alamat Email *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="nama.guru@edusmart.ac.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Nomor Telepon/WhatsApp *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="+62 8xx xxxx xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Penugasan Pengajar */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <BookOpen className="w-4 h-4" />
              </div>
              Penugasan Pengajar
            </h3>

            {/* Mapel diampu */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Mata Pelajaran Diampu *</label>
              <div className="flex flex-wrap items-center gap-2 p-3 bg-[#f8fafc] rounded-xl border border-slate-100 min-h-[50px]">
                {subjects.map((sub) => (
                  <span
                    key={sub}
                    className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold shadow-sm"
                  >
                    {sub}
                    <button type="button" onClick={() => handleRemoveSubject(sub)} className="hover:text-blue-100">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1 border border-dashed border-blue-300 text-blue-600 rounded-full text-xs font-semibold bg-white hover:bg-blue-50/50 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Mapel
                </button>
              </div>
            </div>

            {/* Kelas diampu */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Kelas Diampu</label>
              <div className="flex flex-wrap items-center gap-2 p-3 bg-[#f8fafc] rounded-xl border border-slate-100 min-h-[50px]">
                {classes.map((cls) => (
                  <span
                    key={cls}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-semibold shadow-sm"
                  >
                    {cls}
                    <button type="button" onClick={() => handleRemoveClass(cls)} className="hover:text-emerald-100">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1 border border-dashed border-emerald-300 text-emerald-600 rounded-full text-xs font-semibold bg-white hover:bg-emerald-50/50 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Pilih Kelas
                </button>
              </div>
            </div>

            {/* Set Wali Kelas */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-3">
                {/* Custom toggle button */}
                <button
                  type="button"
                  onClick={() => setIsHomeroom(!isHomeroom)}
                  className={`w-11 h-6 rounded-full transition-all relative ${
                    isHomeroom ? "bg-[#2563eb]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow transition-all ${
                      isHomeroom ? "left-5.5" : "left-0.5"
                    }`}
                  ></span>
                </button>
                <span className="text-sm font-semibold text-slate-700">Set Sebagai Wali Kelas?</span>
              </div>

              <select
                disabled={!isHomeroom}
                value={homeroomClass}
                onChange={(e) => setHomeroomClass(e.target.value)}
                className="w-full sm:w-48 px-4 py-2.5 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Pilih Kelas Wali</option>
                <option value="4-C">Kelas 4-C</option>
                <option value="1-A">Kelas 1-A</option>
                <option value="2-C">Kelas 2-C</option>
              </select>
            </div>

          </div>

        </form>

        {/* Right Column (Foto Profil & Status Pendaftaran) */}
        <div className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0">
          
          {/* Card 1: Foto Profil Guru */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563eb]">
                <Camera className="w-4 h-4" />
              </div>
              Foto Profil Guru
            </h3>

            {/* Drag & drop upload area */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl py-10 px-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:bg-slate-50 transition-all bg-[#f8fafc]/50">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm">
                <User className="w-6 h-6 stroke-[1.5]" />
              </div>
              <span className="text-xs font-bold text-slate-600">Seret foto atau klik untuk upload</span>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-normal text-center px-4 font-medium">
              Gunakan format .jpg atau .png. Ukuran maksimal 2MB dengan rasio 1:1.
            </p>

            {/* Tips Box */}
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-50 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#2563eb]" />
                Tips Unggahan
              </h4>
              <ul className="list-disc pl-5 text-[10px] font-bold text-slate-500 flex flex-col gap-1.5">
                <li>Pastikan wajah terlihat jelas</li>
                <li>Gunakan latar belakang polos</li>
                <li>Pencahayaan yang cukup</li>
              </ul>
            </div>
          </div>

          {/* Card 2: Status Pendaftaran */}
          <div className="bg-[#f4f7fc]/50 border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span>
              <h3 className="text-sm font-extrabold text-slate-700">Status Pendaftaran</h3>
            </div>

            {/* Progress kelengkapan */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Kelengkapan Data</span>
                <span className="text-[#2563eb]">45%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div style={{ width: "45%" }} className="h-full bg-[#2563eb] rounded-full"></div>
              </div>
            </div>

            {/* Steps Checklist */}
            <div className="flex flex-col gap-3 mt-2">
              {/* Step 1 */}
              <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4 fill-emerald-50 bg-white rounded-full text-emerald-600" />
                <span>Biodata Pribadi telah diisi</span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400">
                <span className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0"></span>
                <span>Kontak belum lengkap</span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400">
                <span className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0"></span>
                <span>Penugasan belum diatur</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
