import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  Users,
  DoorOpen,
  BookOpen,
  CalendarCheck,
  FileBarChart2,
  Activity,
  UserCog,
  LogOut,
  Shield,
  Calendar,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Guru", href: "/dashboard/guru", icon: GraduationCap },
    { name: "Coach", href: "/dashboard/coach", icon: Award },
    { name: "Siswa", href: "/dashboard/siswa", icon: Users },
    { name: "Kelas", href: "/dashboard/kelas", icon: DoorOpen },
    { name: "Mata Pelajaran", href: "/dashboard/mapel", icon: BookOpen },
    { name: "Absensi", href: "/dashboard/absensi", icon: CalendarCheck },
    { name: "Nilai", href: "/dashboard/nilai", icon: FileBarChart2 },
    { name: "Ekstrakurikuler", href: "/dashboard/ekstrakurikuler", icon: Activity },
    { name: "Periode Akademik", href: "/dashboard/periode", icon: Calendar },
    { name: "Kelola Akun", href: "/dashboard/kelola-akun", icon: UserCog },
  ];

  return (
    <aside className="w-64 bg-[#f0f4fa] h-screen flex flex-col justify-between border-r border-slate-200/60 p-5 shrink-0">
      <div className="flex flex-col gap-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2563eb] flex items-center justify-center text-white shadow-md">
            <Shield className="w-5 h-5 fill-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-[#1d4ed8] leading-tight">
              SD Islam
            </span>
            <span className="font-extrabold text-sm text-[#1d4ed8] leading-tight">
              Baiturrachman
            </span>
            <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
              Admin Management
            </span>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#2563eb]/10 text-[#2563eb]"
                    : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#2563eb]" : "text-slate-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <Link
        href="/"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </Link>
    </aside>
  );
};
