import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  badge?: string;
  badgeType?: "success" | "neutral" | "warning";
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  showLine?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  badge,
  badgeType = "neutral",
  icon: Icon,
  iconBg = "bg-blue-50",
  iconColor = "text-blue-600",
  showLine = false,
}) => {
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] w-full">
      <div className="flex justify-between items-center">
        <div className={`p-2.5 rounded-lg ${iconBg} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        {badge && (
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-full ${
              badgeType === "success"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-400">
          {title}
        </span>
        <span className="text-2xl font-extrabold text-slate-800 mt-2">
          {value}
        </span>
        {showLine && <div className="w-6 h-1 bg-blue-600 rounded-full mt-3"></div>}
      </div>
    </div>
  );
};
