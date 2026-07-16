"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save,
  User,
  Mail,
  Phone,
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
  const [birthPlace, setBirthPlace] = useState("Jakarta");
  const [birthDate, setBirthDate] = useState("1995-01-01");
  const [gender, setGender] = useState("L");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [isHomeroom, setIsHomeroom] = useState(false);
  const [homeroomClass, setHomeroomClass] = useState("Kelas 4-C");

  const [subjects, setSubjects] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);

  // Dynamic dropdown addition states
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [periodId, setPeriodId] = useState("");

  React.useEffect(() => {
    setPeriodId(localStorage.getItem("active_period_id") || "");
  }, []);

  const availableSubjectsList = ["Matematika", "Bahasa Inggris", "Ilmu Pengetahuan Alam"];
  const availableClassesList = ["Kelas 4-C", "Kelas 5-B", "Kelas 6-A"];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodId) {
      alert("Silakan pilih periode akademik di topbar terlebih dahulu!");
      return;
    }
    try {
      const response = await fetch("/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          nip,
          isHomeroom,
          homeroomClass: isHomeroom ? homeroomClass : null,
          subjects,
          classes,
          specialization: "Akademik",
          periodId // Kirim periodId aktif
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert("Data Guru Berhasil Disimpan!");
        router.push("/dashboard/guru");
      } else {
        alert(data.message || "Gagal menyimpan data guru");
      }
    } catch (err) {
      console.error("Failed to save teacher:", err);
      alert("Terjadi kesalahan koneksi");
    }
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
            Lengkapi formulir di bawah ini dengan data yang valid untuk mendaftarkan pengajar baru.
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

      {/* Main layout */}
      <div className="w-full">
        
        {/* Forms (Biodata, Kontak) */}
        <form onSubmit={handleSave} className="flex flex-col gap-6 w-full">
          
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
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Card 2: Informasi Kontak */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-6">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563eb]">
                <Mail className="w-4 h-4" />
              </div>
              Informasi Kontak
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Alamat Email Instansi *"
                type="email"
                placeholder="contoh@sekolah.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Nomor Telepon Seluler *"
                type="tel"
                placeholder="+62 8xx-xxxx-xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
