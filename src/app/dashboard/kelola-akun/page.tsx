"use client";

import React from "react";
import {
  Users,
  CheckCircle,
  Shield,
  Ban,
  UserPlus,
  Mail,
  Clock,
  Plus,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";

interface AccountUser {
  id: string;
  name: string;
  role: "Administrator" | "Guru" | "Coach" | "Wali Murid";
  email: string;
  lastLogin: string;
  status: "active" | "idle";
  initials: string;
}

export default function KelolaAkunPage() {
  const stats = [
    {
      title: "Total Akun",
      value: 124,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Aktif Hari Ini",
      value: 89,
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Admin",
      value: 6,
      icon: Shield,
      iconBg: "bg-amber-50/70",
      iconColor: "text-amber-600",
    },
    {
      title: "Ditangguhkan",
      value: 2,
      icon: Ban,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  const accountsData: AccountUser[] = [
    {
      id: "1",
      name: "Sarah Jenkins, M.Pd",
      role: "Administrator",
      email: "s.jenkins@lumina.edu",
      lastLogin: "Login terakhir: 2 jam yang lalu",
      status: "active",
      initials: "SJ",
    },
    {
      id: "2",
      name: "Michael Chen, S.Pd",
      role: "Guru",
      email: "m.chen@lumina.edu",
      lastLogin: "Login terakhir: Kemarin, 14:20",
      status: "active",
      initials: "MC",
    },
    {
      id: "3",
      name: "Ahmad Dahlan",
      role: "Coach",
      email: "a.dahlan@lumina.edu",
      lastLogin: "Login terakhir: 3 hari yang lalu",
      status: "idle",
      initials: "AD",
    },
    {
      id: "4",
      name: "Maria Wijaya",
      role: "Wali Murid",
      email: "m.wijaya@parent.edu",
      lastLogin: "Login terakhir: 15 menit yang lalu",
      status: "active",
      initials: "MW",
    },
    {
      id: "5",
      name: "David Bradley",
      role: "Administrator",
      email: "d.bradley@lumina.edu",
      lastLogin: "Login terakhir: 5 jam yang lalu",
      status: "active",
      initials: "DB",
    },
  ];

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "Administrator":
        return "bg-blue-50 text-[#2563eb] border border-blue-100";
      case "Guru":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "Coach":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "Wali Murid":
        return "bg-sky-50 text-sky-600 border border-sky-100";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b]">Manajemen Pengguna</h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola akses dan privasi akun untuk seluruh staf dan pengajar.
          </p>
        </div>

        {/* Add Account Button */}
        <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-bold text-xs bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]">
          <UserPlus className="w-4 h-4" />
          Tambah Akun Baru
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Grid of Users Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accountsData.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between gap-6"
          >
            {/* User Info with Avatar & Status dot */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm text-sm">
                  {user.initials}
                </div>
                <span
                  className={`w-3.5 h-3.5 rounded-full border-2 border-white absolute bottom-0 right-0 ${
                    user.status === "active" ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                ></span>
              </div>
              
              <div className="flex flex-col items-start gap-1">
                <span className="font-extrabold text-slate-800 text-sm">{user.name}</span>
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${getRoleBadgeStyles(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </div>

            {/* Email & Last login history */}
            <div className="flex flex-col gap-2 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{user.lastLogin}</span>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="grid grid-cols-2 gap-3 border-t border-slate-100/80 pt-4 mt-2">
              <button className="py-2 px-3 rounded-xl bg-blue-50/50 hover:bg-blue-100/50 text-[#2563eb] font-bold text-xs transition-all">
                Ganti Password
              </button>
              <button className="py-2 px-3 rounded-xl bg-rose-50/50 hover:bg-rose-100/50 text-rose-600 font-bold text-xs transition-all">
                Hapus Akun
              </button>
            </div>
          </div>
        ))}

        {/* Add Account Dotted Card */}
        <div className="bg-[#f4f7fc]/50 border-2 border-dashed border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:bg-slate-100/30 transition-all min-h-[220px]">
          <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563eb] shadow-sm">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-slate-700">Tambah Akun</span>
            <span className="text-xs text-slate-400 font-medium mt-1">Klik untuk mendaftarkan pengguna baru</span>
          </div>
        </div>
      </div>

    </div>
  );
}
