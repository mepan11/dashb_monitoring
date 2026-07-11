"use client";

import React, { useState } from "react";
import {
  Users,
  CheckCircle,
  Shapes,
  Ban,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";

interface Coach {
  id: string;
  name: string;
  email: string;
  idNumber: string;
  specialization: string;
  specializationType: "robotik" | "tari" | "futsal" | string;
  contact: string;
  status: "Aktif" | "Non-Aktif";
  initials: string;
}

export default function CoachPage() {
  const [selectedBidang, setSelectedBidang] = useState("Semua Bidang");
  const [selectedStatus, setSelectedStatus] = useState("Status: Aktif");

  // KPI Data
  const stats = [
    {
      title: "Total Coach",
      value: 24,
      badge: "+4 MoM",
      badgeType: "success" as const,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Aktif",
      value: 21,
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Spesialisasi",
      value: "12 Bidang",
      icon: Shapes,
      iconBg: "bg-amber-50/70",
      iconColor: "text-amber-600",
    },
    {
      title: "Non-Aktif",
      value: 3,
      icon: Ban,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  // Dummy Coach Data
  const coaches: Coach[] = [
    {
      id: "1",
      name: "Ahmad Subardjo",
      email: "ahmad.s@lumina.sch.id",
      idNumber: "LC-2024-001",
      specialization: "Robotik",
      specializationType: "robotik",
      contact: "+62 812-3456-7890",
      status: "Aktif",
      initials: "AS",
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      email: "siti.n@lumina.sch.id",
      idNumber: "LC-2024-042",
      specialization: "Tari Tradisional",
      specializationType: "tari",
      contact: "+62 811-9876-5432",
      status: "Aktif",
      initials: "SN",
    },
    {
      id: "3",
      name: "Bambang Pamungkas",
      email: "b.pamungkas@lumina.sch.id",
      idNumber: "LC-2024-015",
      specialization: "Futsal",
      specializationType: "futsal",
      contact: "+62 822-4455-6677",
      status: "Non-Aktif",
      initials: "BP",
    },
  ];

  const handleResetFilters = () => {
    setSelectedBidang("Semua Bidang");
    setSelectedStatus("Status: Aktif");
  };

  const getSpecializationBadgeStyles = (type: string) => {
    switch (type) {
      case "robotik":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "tari":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "futsal":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-[#2563eb]">Daftar Coach</span>
          </div>
          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-800">Daftar Coach</h1>
          <p className="text-sm text-slate-400 mt-1">
            Mengelola data profesional pendidik ekstrakurikuler dan klub sekolah.
          </p>
        </div>

        {/* Add Coach Button */}
        <Button className="!w-auto !py-2.5 !px-5 flex items-center gap-2 rounded-lg font-semibold text-xs shadow-sm">
          <Plus className="w-4 h-4" />
          Tambah Coach Baru
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            badge={stat.badge}
            badgeType={stat.badgeType}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Filter & Table Container */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
        
        {/* Filter Controls Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter icon label */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#f4f7fc] text-slate-600 rounded-lg text-xs font-semibold border border-slate-100">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter:
            </div>

            {/* Dropdown 1 */}
            <div className="relative">
              <select
                value={selectedBidang}
                onChange={(e) => setSelectedBidang(e.target.value)}
                className="appearance-none bg-white border border-slate-200/80 rounded-lg px-4 py-2 pr-10 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option>Semua Bidang</option>
                <option>Robotik</option>
                <option>Tari Tradisional</option>
                <option>Futsal</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Dropdown 2 */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-white border border-slate-200/80 rounded-lg px-4 py-2 pr-10 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option>Status: Aktif</option>
                <option>Status: Non-Aktif</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-all text-left"
          >
            Reset All Filters
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#fafbfc] text-[10px] font-extrabold text-slate-400 tracking-wider">
                <th className="py-4 px-6">NAMA COACH</th>
                <th className="py-4 px-6">ID NUMBER</th>
                <th className="py-4 px-6">SPESIALISASI</th>
                <th className="py-4 px-6">KONTAK</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {coaches.map((coach) => (
                <tr key={coach.id} className="hover:bg-slate-50/50 transition-all">
                  
                  {/* Name and Email */}
                  <td className="py-4 px-6 flex items-center gap-3">
                    {/* Initials Avatar */}
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                      {coach.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{coach.name}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{coach.email}</span>
                    </div>
                  </td>

                  {/* ID Number */}
                  <td className="py-4 px-6 font-medium text-slate-500">
                    {coach.idNumber}
                  </td>

                  {/* Specialization Badge */}
                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${getSpecializationBadgeStyles(
                        coach.specializationType
                      )}`}
                    >
                      {coach.specialization}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-6 font-medium text-slate-600">
                    {coach.contact}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    {coach.status === "Aktif" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-[10px] font-bold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {coach.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-rose-100 bg-rose-50 text-[10px] font-bold text-rose-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        {coach.status}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-all">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-400">
            Menampilkan 4 dari 24 Coach
          </span>
          
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400">
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Page Buttons */}
            <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
              1
            </button>
            <button className="w-8 h-8 rounded-lg hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center">
              2
            </button>
            <button className="w-8 h-8 rounded-lg hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center">
              3
            </button>

            {/* Next */}
            <button className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
