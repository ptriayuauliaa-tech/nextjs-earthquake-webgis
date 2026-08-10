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
    <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/50 backdrop-blur-md text-xs font-sans text-slate-200">
      <label htmlFor="mag-filter" className="font-medium text-slate-400">
        Filter Magnitudo:
      </label>
      <select
        id="mag-filter"
        value={selectedMinMag}
        onChange={(e) => onFilterChange(Number(e.target.value))}
        className="bg-slate-800 text-emerald-400 font-semibold border border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
      >
        <option value={0}>Semua Magnitudo</option>
        <option value={3}>≥ 3.0 SR</option>
        <option value={4}>≥ 4.0 SR</option>
        <option value={5}>≥ 5.0 SR (Kuat)</option>
        <option value={6}>≥ 6.0 SR (Sangat Kuat)</option>
      </select>
    </div>
  );
}