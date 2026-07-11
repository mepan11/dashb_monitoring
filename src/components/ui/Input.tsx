import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#f8fafc] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm ${className}`}
        {...props}
      />
    </div>
  );
};
