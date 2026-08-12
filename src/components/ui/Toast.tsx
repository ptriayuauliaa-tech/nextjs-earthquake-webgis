"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string | null;
  type?: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Otomatis hilang dalam 3 detik

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[4000] flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-xs font-medium text-slate-100 shadow-2xl backdrop-blur-md transition-all">
      <span
        className={`h-2 w-2 rounded-full ${
          type === "success" ? "bg-emerald-400" : "bg-red-400"
        }`}
      />
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-slate-200"
      >
        ✕
      </button>
    </div>
  );
}