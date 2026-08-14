"use client";

interface MagnitudeFilterProps {
  selectedMinMag: number;
  onFilterChange: (minMag: number) => void;
}

export function MagnitudeFilter({
  selectedMinMag,
  onFilterChange,
}: MagnitudeFilterProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-1.5 shadow-2xl backdrop-blur-xl text-xs font-sans text-slate-200">
      <label htmlFor="mag-filter" className="font-medium text-slate-400">
        Filter Magnitudo:
      </label>
      <select
        id="mag-filter"
        value={selectedMinMag}
        onChange={(e) => onFilterChange(Number(e.target.value))}
        className="bg-slate-900/80 text-emerald-400 font-mono font-semibold border border-white/10 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer hover:bg-slate-800 transition"
      >
        <option value={0}>Semua Gempa</option>
        <option value={3}>≥ 3.0 SR</option>
        <option value={4}>≥ 4.0 SR</option>
        <option value={5}>≥ 5.0 SR (Kuat)</option>
        <option value={6}>≥ 6.0 SR (Sangat Kuat)</option>
      </select>
    </div>
  );
}