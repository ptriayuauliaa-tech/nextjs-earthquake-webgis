"use client";

export default function Header() {
  return (
    <header className="relative z-[1100] flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-[#030712]/95 px-6 backdrop-blur-md">
      {/* Soft Ambient Glow Effect */}
      <div className="absolute top-0 left-1/4 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Brand & Logo Section */}
      <div className="flex items-center gap-3">
        {/* Cute Earth/Pulse Icon Badge */}
        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-teal-400/10 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
          <span className="text-lg">🌍</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#030712]"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold tracking-tight text-white">
              Earthquake <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">WebGIS</span>
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              v2.0 ✨
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Real-time Monitoring & Spatial Analysis System
          </p>
        </div>
      </div>

      {/* Center Tagline / Quick Status */}
      <div className="hidden md:flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-800 px-4 py-1.5 text-xs text-slate-300 shadow-inner">
        <span className="text-emerald-400 font-bold">● BMKG & USGS</span>
        <span className="text-slate-600">|</span>
        <span>Data Terintegrasi</span>
      </div>

      {/* Right Live Status Pill */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-emerald-950/60 border border-emerald-500/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span>LIVE</span>
        </div>
      </div>
    </header>
  );
}