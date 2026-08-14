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
      <aside className="w-full shrink-0 overflow-y-auto border-t border-slate-800/80 bg-[#070b14] p-5 md:w-88 md:border-t-0 md:border-l md:max-h-none max-h-60">
        <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            AREA PANTAUAN ({areas.length})
          </h2>
        </div>

        {areas.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-500">
            Belum ada area pantauan tersimpan.
          </div>
        )}

        <ul className="flex flex-col gap-3.5">
          {areas.map((area) => {
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
              <li
                key={area.id}
                className="group relative rounded-xl border border-slate-800 bg-[#0f172a]/90 p-4 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
                      {area.name}
                    </h3>
                    <span className="inline-block mt-1 rounded-md bg-slate-800 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 border border-slate-700">
                      {area.category}
                    </span>
                  </div>
                </div>

                {isPolygon && (
                  <div className="mt-3.5 space-y-1.5 rounded-lg bg-[#030712] p-3 border border-slate-800 text-xs font-mono">
                    <div className="flex justify-between items-center text-emerald-400">
                      <span className="text-slate-400">Luas Area:</span>
                      <span className="font-bold">{formatArea(calculatePolygonAreaInKm2(geometry.coordinates[0]))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Terdeteksi:</span>
                      <span className={eqCount > 0 ? "text-amber-400 font-extrabold" : "text-slate-300"}>
                        {eqCount} kejadian gempa
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onFocusArea(area.id)}
                    className="flex-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer"
                  >
                    Lihat
                  </button>

                  <button
                    onClick={() => downloadAreaAsGeoJSON(area)}
                    className="flex-1 rounded-lg bg-slate-800 border border-slate-700 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition cursor-pointer"
                  >
                    Export
                  </button>

                  <button
                    onClick={() => setSelectedAreaForDelete(area)}
                    className="flex-1 rounded-lg bg-red-500/10 border border-red-500/30 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition cursor-pointer"
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
            ? `Apakah Anda yakin ingin menghapus area "${selectedAreaForDelete.name}"?`
            : ""
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setSelectedAreaForDelete(null)}
      />
    </>
  );
}