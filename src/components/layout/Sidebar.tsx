"use client";

import type { MonitoringArea } from "@/hooks/useMonitoringAreas";

interface SidebarProps {
  areas: MonitoringArea[];
  onFocusArea: (id: string) => void;
}

export default function Sidebar({ areas, onFocusArea }: SidebarProps) {
  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-l border-line bg-panel p-4">
      <h2 className="mb-3 text-xs font-semibold tracking-wide text-ink-muted">
        AREA PANTAUAN ({areas.length})
      </h2>

      {areas.length === 0 && (
        <p className="text-xs text-ink-muted">Belum ada area pantauan tersimpan.</p>
      )}

      <ul className="flex flex-col gap-2">
        {areas.map((area) => (
          <li key={area.id} className="rounded border border-line bg-deep p-3 text-sm">
            <p className="font-medium text-ink">{area.name}</p>
            <p className="font-mono text-xs text-signal">{area.category}</p>
            <p className="mt-1 text-xs text-ink-muted">
              {new Date(area.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            <button
              onClick={() => onFocusArea(area.id)}
              className="mt-2 w-full rounded bg-calm/20 py-1 text-xs text-calm hover:bg-calm/30"
            >
              Lihat di Peta
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}