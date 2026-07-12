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
  Lightbulb,
  Upload,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function TambahCoachPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nik, setNik] = useState("");
  const [gender, setGender] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [ekskul, setEkskul] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Data Coach Berhasil Disimpan!");
    router.push("/dashboard/coach");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1e293b]">Tambah Coach Baru</h1>
        <p className="text-sm text-slate-400 mt-1">
          Lengkapi formulir di bawah ini dengan data yang valid untuk mendaftarkan tenaga pelatih ekstrakurikuler baru.
        </p>
      </div>

      {/* Main split-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column Forms (Biodata, Kontak, Penugasan) */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col gap-6 w-full">
          
          {/* Card 1: Biodata Pribadi */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563eb]">
                <User className="w-4 h-4" />
              </div>
              Biodata Pribadi
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso, S.Pd."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ID Number/NIK</label>
                <input
                  type="text"
                  placeholder="16 digit NIK"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
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
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat</label>
              <textarea
                placeholder="Alamat lengkap domisili saat ini"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm resize-none"
              ></textarea>
            </div>
          </div>

          {/* Card 2: Informasi Kontak */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Mail className="w-4 h-4" />
              </div>
              Informasi Kontak
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Email</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nomor Telepon/WhatsApp</label>
                <div className="flex rounded-lg overflow-hidden border border-slate-200 bg-[#f8fafc] focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent">
                  <span className="bg-slate-100 text-slate-500 px-4 py-3 text-sm font-bold border-r border-slate-200 shrink-0 flex items-center justify-center">
                    +62
                  </span>
                  <input
                    type="text"
                    placeholder="81234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-transparent text-slate-900 focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Penugasan Coach */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <BookOpen className="w-4 h-4" />
              </div>
              Penugasan Coach
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Spesialisasi</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                >
                  <option value="">Pilih Spesialisasi</option>
                  <option value="Sains">Sains (Robotik, Coding, dll)</option>
                  <option value="Olahraga">Olahraga (Futsal, Basket, dll)</option>
                  <option value="Seni">Seni (Tari, Lukis, dll)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bidang Ekskul yang Diampu</label>
                <input
                  type="text"
                  placeholder="Contoh: Robotik, Futsal, Tari Tradisional"
                  value={ekskul}
                  onChange={(e) => setEkskul(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions Form Footer */}
          <div className="flex items-center justify-end gap-4 border-t border-slate-100/80 pt-6 mt-2">
            <Link href="/dashboard/coach">
              <span className="text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer px-4 py-2.5 rounded-lg">
                Batalkan
              </span>
            </Link>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] text-xs font-bold shadow-sm transition-all whitespace-nowrap"
            >
              Simpan Data Coach
            </button>
          </div>

        </form>

        {/* Right Column (Foto Profil & Status Pendaftaran) */}
        <div className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0">
          
          {/* Card 1: Foto Profil Coach */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Foto Profil Coach</h4>

            {/* Avatar display */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-24 h-24 rounded-full bg-blue-50 text-[#2563eb] border border-blue-100 shadow-inner flex items-center justify-center">
                <User className="w-10 h-10 stroke-[1.5]" />
              </div>
              
              <p className="text-[10px] text-slate-400 leading-normal text-center px-4 font-semibold">
                Unggah foto formal dengan latar belakang polos. Format .jpg atau .png (Maks. 2MB)
              </p>

              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-blue-200 text-[#2563eb] hover:bg-blue-50/50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all bg-white"
              >
                <Upload className="w-4 h-4" />
                Pilih File Foto
              </button>
            </div>

            {/* Tips Box */}
            <div className="bg-emerald-50/20 rounded-xl p-4 border border-emerald-50 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                Tips Unggah Foto
              </h4>
              <ul className="text-[10px] font-bold text-slate-500 flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50 shrink-0" />
                  Wajah terlihat jelas (close-up).
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50 shrink-0" />
                  Pakaian rapi dan sopan.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50 shrink-0" />
                  Pencahayaan yang cukup.
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Status Pendaftaran */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 font-extrabold text-sm">Status Pendaftaran</span>
              <span className="text-[#2563eb]">45%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div style={{ width: "45%" }} className="h-full bg-[#2563eb] rounded-full"></div>
            </div>

            {/* Steps Checklist */}
            <div className="flex flex-col gap-3.5 mt-2">
              {/* Step 1 */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span className="text-slate-400 font-semibold">Biodata Pribadi</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
              </div>

              {/* Step 2 */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span className="text-slate-400 font-semibold">Informasi Kontak</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
              </div>

              {/* Step 3 */}
              <div className="flex items-center justify-between text-xs font-bold text-[#2563eb]">
                <span>Kredensial Akun</span>
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              </div>

              {/* Step 4 */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Penugasan Coach</span>
                <span className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0"></span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
