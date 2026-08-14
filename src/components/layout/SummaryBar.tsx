"use client";

interface SummaryBarProps {
  earthquakeCount: number;
  areaCount: number;
  lastUpdated?: number;
}

export default function SummaryBar({
  earthquakeCount,
  areaCount,
  lastUpdated,
}: SummaryBarProps) {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "-";

  return (
    <div className="relative z-[1050] flex w-full items-center justify-between border-b border-slate-800/60 bg-[#060b17] px-6 py-2 text-xs text-slate-300">
      <div className="flex items-center gap-4">
        {/* Stat Pill 1 */}
        <div className="flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-800 px-3.5 py-1">
          <span className="text-base">🌋</span>
          <span className="text-slate-400 font-medium">Gempa Terdeteksi:</span>
          <span className="font-bold text-emerald-400 font-mono text-xs">
            {earthquakeCount} Titik
          </span>
        </div>

        {/* Stat Pill 2 */}
        <div className="flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-800 px-3.5 py-1">
          <span className="text-base">📐</span>
          <span className="text-slate-400 font-medium">Area Pantauan:</span>
          <span className="font-bold text-cyan-400 font-mono text-xs">
            {areaCount} Wilayah
          </span>
        </div>
      </div>

      {/* Time Badge */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 rounded-lg bg-slate-900/60 border border-slate-800/80 px-3 py-1">
        <span>⏱️ Update:</span>
        <span className="text-slate-200 font-bold">{formattedTime}</span>
      </div>
    </div>
  );
}