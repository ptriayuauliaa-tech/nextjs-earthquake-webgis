"use client";

interface MagnitudeFilterProps {
  minMagnitude: number;
  onChange: (value: number) => void;
}

const MAGNITUDE_OPTIONS = [
  { label: "Semua Magnitudo", value: 0 },
  { label: "≥ 3.0 SR (Ringan)", value: 3 },
  { label: "≥ 4.0 SR (Sedang)", value: 4 },
  { label: "≥ 5.0 SR (Kuat)", value: 5 },
  { label: "≥ 6.0 SR (Sangat Kuat)", value: 6 },
];

export function MagnitudeFilter({ minMagnitude, onChange }: MagnitudeFilterProps) {
  return (
    <div className="relative flex items-center">
      <div className="relative">
        <select
          value={minMagnitude}
          onChange={(e) => onChange(Number(e.target.value))}
          className="appearance-none rounded-full border border-[#1b3d36] bg-[#0c1f1b]/95 py-2 pl-9 pr-8 text-xs font-medium text-[#e2e8f0] backdrop-blur-md transition focus:border-[#34d399] focus:outline-none focus:ring-1 focus:ring-[#34d399] cursor-pointer shadow-lg"
        >
          {MAGNITUDE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0c1f1b] text-white">
              {opt.label}
            </option>
          ))}
        </select>
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
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#34d399]"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
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
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748b]"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}