"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (email: string) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.user?.email) {
          onAuthSuccess(data.user.email);
          onClose();
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user?.email) {
          onAuthSuccess(data.user.email);
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal melakukan autentikasi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      {/* Split Modal Card */}
      <div className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#0c161d] shadow-[0_20px_60px_rgba(0,0,0,0.8)] md:flex-row min-h-[460px]">
        
        {/* Tombol Tutup Modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-slate-400 hover:text-white transition cursor-pointer border border-slate-700/50"
        >
          ✕
        </button>

        {/* SISI KIRI: Ilustrasi & Branding Halus */}
        <div className="relative flex flex-1 flex-col justify-between bg-gradient-to-br from-slate-900 via-[#102220] to-[#0e2d27] p-8 md:pr-12">
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              🌍
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-wide text-white">
                EARTHQUAKE <span className="text-emerald-400">WEBGIS</span>
              </h3>
              <p className="text-[10px] text-emerald-300/70 font-mono">
                Monitoring & Mitigasi Bencana
              </p>
            </div>
          </div>

          {/* Vektor Ilustrasi Bumi & Gelombang Seismik */}
          <div className="my-6 flex flex-col items-center justify-center">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-emerald-950/40 border border-emerald-500/20 shadow-inner">
              {/* Ripple Seismik */}
              <span className="absolute h-32 w-32 animate-ping rounded-full bg-emerald-500/10" />
              <span className="absolute h-24 w-24 rounded-full bg-emerald-500/15" />
              
              {/* Cute Vector Graphic */}
              <svg
                className="relative h-16 w-16 text-emerald-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
                <path d="M4.93 4.93l4.24 4.24" />
                <path d="M14.83 14.83l4.24 4.24" />
              </svg>
            </div>
            <p className="mt-4 text-center text-xs font-medium text-slate-300">
              Akses pantauan spasial gempa secara real-time
            </p>
          </div>

          {/* Footer Kiri */}
          <p className="text-[10px] text-slate-500">
            © 2026 Earthquake WebGIS System
          </p>
        </div>

        {/* SISI KANAN: Form Login / Register Sederhana & Elegan */}
        <div className="relative flex flex-1 flex-col justify-center bg-[#070e14] p-8 md:pl-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {isSignUp ? "Daftar Akun" : "Login"}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {isSignUp
                ? "Buat akun untuk mengelola area pantauan"
                : "Masukkan akun Anda untuk melanjutkan"}
            </p>
          </div>

          {/* Alert Error */}
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/40 p-2.5 text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Input Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-full border border-slate-700/80 bg-slate-900/90 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Input Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-full border border-slate-700/80 bg-slate-900/90 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Tombol Aksi Pill */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-full bg-[#3d7a74] hover:bg-[#488e87] py-2.5 text-xs font-bold text-white transition hover:shadow-[0_0_20px_rgba(61,122,116,0.5)] disabled:opacity-50 cursor-pointer"
            >
              {isLoading
                ? "Memproses..."
                : isSignUp
                ? "Register Now"
                : "Login to WebGIS"}
            </button>
          </form>

          {/* Switch Login / Register */}
          <div className="mt-5 text-center text-xs text-slate-400">
            {isSignUp ? (
              <p>
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setErrorMsg(null);
                  }}
                  className="font-semibold text-emerald-400 hover:underline cursor-pointer"
                >
                  Login Now
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMsg(null);
                  }}
                  className="font-semibold text-emerald-400 hover:underline cursor-pointer"
                >
                  Register Now
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}