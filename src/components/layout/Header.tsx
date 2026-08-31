"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { AuthModal } from "@/components/auth/AuthModal";

interface HeaderProps {
  earthquakeCount: number;
  areaCount: number;
  minMagnitude: number;
  onMagnitudeChange: (val: number) => void;
  onSearchLocation: (query: string) => void;
}

export default function Header({
  earthquakeCount,
  areaCount,
  minMagnitude,
  onMagnitudeChange,
  onSearchLocation,
}: HeaderProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchLocation(searchQuery);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUserEmail(null);
  }

  return (
    <>
      <header className="relative z-[1100] flex h-16 w-full items-center justify-between border-b border-[#183a33]/60 bg-[#0d221e]/95 px-6 backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#173a33] border border-[#25564b] text-[#6ee7b7] shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white">
                Earthquake <span className="text-[#6ee7b7]">WebGIS</span>
              </h1>
              <span className="rounded-full bg-[#163831] px-2 py-0.5 text-[10px] font-medium text-[#a7f3d0] border border-[#235248]">
                v2.0
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search & Filter Pill Group */}
        <div className="flex items-center gap-2.5 max-w-md flex-1 px-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari wilayah di Indonesia..."
              className="w-full rounded-full border border-[#1e463e] bg-[#112924] py-2 pl-9 pr-4 text-xs text-white placeholder-[#688a82] focus:border-[#34d399] focus:outline-none transition shadow-sm"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6ee7b7]"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </form>

          <div className="relative">
            <select
              value={minMagnitude}
              onChange={(e) => onMagnitudeChange(Number(e.target.value))}
              className="appearance-none rounded-full border border-[#1e463e] bg-[#112924] py-2 pl-8 pr-7 text-xs font-medium text-[#cbd5e1] focus:border-[#34d399] focus:outline-none cursor-pointer shadow-sm transition"
            >
              <option value={0}>Semua Gempa</option>
              <option value={3}>≥ 3.0 SR</option>
              <option value={4}>≥ 4.0 SR</option>
              <option value={5}>≥ 5.0 SR</option>
              <option value={6}>≥ 6.0 SR</option>
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#34d399]"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
        </div>

        {/* Right: Stats & Chic Login Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-[#112924] border border-[#1e463e] px-3.5 py-1.5 text-xs text-[#94a3b8]">
            <span>Gempa: <strong className="text-[#6ee7b7]">{earthquakeCount}</strong></span>
            <span className="text-[#25564b]">|</span>
            <span>Area: <strong className="text-[#67e8f9]">{areaCount}</strong></span>
          </div>

          {userEmail ? (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#112924] border border-[#1e463e] px-3.5 py-1.5 text-xs text-[#a7f3d0] font-mono">
                {userEmail.split("@")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-950/40 border border-red-800/40 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-900/50 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="rounded-full bg-[#2f665e] hover:bg-[#3b7e74] px-4 py-2 text-xs font-semibold text-white transition hover:shadow-[0_0_15px_rgba(47,102,94,0.4)] cursor-pointer"
            >
              Masuk / Daftar
            </button>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(email) => setUserEmail(email)}
      />
    </>
  );
}