"use client";

import type { MonitoringArea } from "@/hooks/useMonitoringAreas";
import { downloadAreaAsGeoJSON } from "@/lib/utils/export-geojson";

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
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => onFocusArea(area.id)}
                className="flex-1 rounded bg-calm/20 py-1 text-xs text-calm hover:bg-calm/30"
              >
                Lihat di Peta
              </button>
              <button
                onClick={() => downloadAreaAsGeoJSON(area)}
                className="flex-1 rounded border border-line py-1 text-xs text-ink-muted hover:bg-panel"
              >
                Export
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}