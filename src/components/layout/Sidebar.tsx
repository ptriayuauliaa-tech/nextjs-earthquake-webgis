"use client";

import { useState } from "react";
import type { MonitoringArea } from "@/hooks/useMonitoringAreas";
import type { EarthquakeFeatureCollection } from "@/types/earthquake";
import { downloadAreaAsGeoJSON } from "@/lib/utils/export-geojson";
import { calculatePolygonAreaInKm2, formatArea } from "@/lib/utils/area";
import { countEarthquakesInPolygon } from "@/lib/utils/spatial";
import { ConfirmModal } from "./ConfirmModal";

interface SidebarProps {
  areas: MonitoringArea[];
  earthquakeData?: EarthquakeFeatureCollection | null;
  onFocusArea: (id: string) => void;
  onDeleteArea: (id: string) => void;
}

export default function Sidebar({
  areas,
  earthquakeData,
  onFocusArea,
  onDeleteArea,
}: SidebarProps) {
  const [selectedAreaForDelete, setSelectedAreaForDelete] = useState<MonitoringArea | null>(null);

  function handleConfirmDelete() {
    if (selectedAreaForDelete) {
      onDeleteArea(selectedAreaForDelete.id);
      setSelectedAreaForDelete(null);
    }
  }

  return (
    <>
      <aside className="w-full shrink-0 overflow-y-auto border-t border-line bg-panel p-4 md:w-72 md:border-t-0 md:border-l md:max-h-none max-h-56">
        <h2 className="mb-3 text-xs font-semibold tracking-wide text-ink-muted">
          AREA PANTAUAN ({areas.length})
        </h2>

        {areas.length === 0 && (
          <p className="text-xs text-ink-muted">Belum ada area pantauan tersimpan.</p>
        )}

        <ul className="flex flex-col gap-2">
          {areas.map((area) => {
            // Lakukan Type Casting khusus ke Geometry bertipe Polygon
            const geometry = area.geometry as { type: string; coordinates: any };
            const isPolygon = geometry.type === "Polygon";

            const polygonCoords = isPolygon
              ? (geometry.coordinates[0] as [number, number][]).map(
                  ([lng, lat]) => [lat, lng] as [number, number]
                )
              : [];

            const eqCount =
              isPolygon && earthquakeData?.features
                ? countEarthquakesInPolygon(polygonCoords, earthquakeData.features)
                : 0;

            return (
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

                {isPolygon && (
                  <div className="mt-2 space-y-0.5 border-t border-line/50 pt-2 text-xs font-mono">
                    <p className="text-emerald-400">
                      Luas: {formatArea(calculatePolygonAreaInKm2(geometry.coordinates[0]))}
                    </p>
                    <p className={eqCount > 0 ? "text-amber-400 font-semibold" : "text-slate-400"}>
                      Terdeteksi: {eqCount} kejadian gempa
                    </p>
                  </div>
                )}

                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => onFocusArea(area.id)}
                    className="flex-1 rounded bg-calm/20 py-1 text-xs text-calm hover:bg-calm/30"
                  >
                    Lihat
                  </button>
                  <button
                    onClick={() => downloadAreaAsGeoJSON(area)}
                    className="flex-1 rounded border border-line py-1 text-xs text-ink-muted hover:bg-panel"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => setSelectedAreaForDelete(area)}
                    className="flex-1 rounded border border-red-400/40 py-1 text-xs text-red-400 hover:bg-red-400/10"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      <ConfirmModal
        isOpen={!!selectedAreaForDelete}
        title="Hapus Area Pantauan"
        message={
          selectedAreaForDelete
            ? `Apakah Anda yakin ingin menghapus area "${selectedAreaForDelete.name}"? Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setSelectedAreaForDelete(null)}
      />
    </>
  );
}