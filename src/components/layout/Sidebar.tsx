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
      <aside className="w-full shrink-0 overflow-y-auto border-t border-[#183a33]/60 bg-[#0d221e] p-5 md:w-84 md:border-t-0 md:border-l">
        {/* Header Sidebar */}
        <div className="mb-4 flex items-center justify-between border-b border-[#183a33] pb-3">
          <h2 className="text-xs font-bold tracking-wider text-[#94a3b8] uppercase flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#34d399]" />
            AREA PANTAUAN ({areas.length})
          </h2>
        </div>

        {areas.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#1c3e37] p-8 text-center text-xs text-[#688a82]">
            Belum ada area pantauan. Silakan gambar polygon atau titik di peta.
          </div>
        )}

        <ul className="flex flex-col gap-3">
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
                className="group rounded-2xl border border-[#1e463e] bg-[#112924] p-4 transition duration-200 hover:border-[#34d399]/60 shadow-sm"
              >
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {area.name}
                  </h3>
                  <span className="inline-block mt-1 rounded-full bg-[#173a33] px-2.5 py-0.5 text-[10px] font-medium text-[#a7f3d0] border border-[#235248]">
                    {area.category}
                  </span>
                </div>

                {isPolygon && (
                  <div className="mt-3 space-y-1 rounded-xl bg-[#0b1b17] p-2.5 border border-[#183831] text-xs font-mono">
                    <div className="flex justify-between items-center text-[#6ee7b7]">
                      <span className="text-[#688a82]">Luas Area:</span>
                      <span className="font-semibold">{formatArea(calculatePolygonAreaInKm2(geometry.coordinates[0]))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#688a82]">Terdeteksi:</span>
                      <span className={eqCount > 0 ? "text-amber-300 font-semibold" : "text-[#94a3b8]"}>
                        {eqCount} gempa
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-3.5 flex gap-2">
                  <button
                    onClick={() => onFocusArea(area.id)}
                    className="flex-1 rounded-full bg-[#2f665e] py-1.5 text-xs font-semibold text-white hover:bg-[#3b7e74] transition cursor-pointer"
                  >
                    Lihat
                  </button>

                  <button
                    onClick={() => downloadAreaAsGeoJSON(area)}
                    className="flex-1 rounded-full bg-[#173a33] border border-[#235248] py-1.5 text-xs font-semibold text-[#cbd5e1] hover:bg-[#1e473e] transition cursor-pointer"
                  >
                    Export
                  </button>

                  <button
                    onClick={() => setSelectedAreaForDelete(area)}
                    className="flex-1 rounded-full bg-red-950/30 border border-red-800/30 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-900/40 transition cursor-pointer"
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