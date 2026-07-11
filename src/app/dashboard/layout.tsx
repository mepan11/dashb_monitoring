"use client";

import React from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fafbfc]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
