"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import AreaForm from "@/components/map/AreaForm";
import Sidebar from "@/components/layout/Sidebar";
import SummaryBar from "@/components/layout/SummaryBar";
import { MagnitudeFilter } from "@/components/map/MagnitudeFilter";
import { useMonitoringAreas } from "@/hooks/useMonitoringAreas";
import { useEarthquakes } from "@/hooks/useEarthquakes";
import type { DrawnShape } from "@/types/monitoring-area";

const EarthquakeMap = dynamic(
  () => import("@/components/map/EarthquakeMap"),
  { ssr: false }
);

export default function Home() {
  const [pendingShape, setPendingShape] = useState<DrawnShape | null>(null);
  const [focusedAreaId, setFocusedAreaId] = useState<string | null>(null);
  const [minMagnitude, setMinMagnitude] = useState<number>(0);

  const { areas, refetch, deleteArea } = useMonitoringAreas();
  const { data: earthquakeData } = useEarthquakes();

  // Filter data gempa berdasarkan magnitudo yang dipilih
  const filteredEarthquakeData = useMemo(() => {
    if (!earthquakeData) return null;
    return {
      ...earthquakeData,
      features: earthquakeData.features.filter(
        (feature) => (feature.properties.mag ?? 0) >= minMagnitude
      ),
    };
  }, [earthquakeData, minMagnitude]);

  return (
    <div className="flex h-screen w-screen flex-col">
      <Header />
      <SummaryBar
        earthquakeCount={filteredEarthquakeData?.features.length ?? 0}
        areaCount={areas.length}
        lastUpdated={earthquakeData?.metadata.generated}
      />
      <div className="relative flex flex-1 overflow-hidden">
        <main className="relative flex-1">
          {/* Posisi Filter Magnitudo Melayang di Kiri Atas Peta */}
          <div className="absolute top-4 left-14 z-[1000]">
            <MagnitudeFilter
              selectedMinMag={minMagnitude}
              onFilterChange={setMinMagnitude}
            />
          </div>

          <EarthquakeMap
            onShapeDrawn={(shape) => setPendingShape(shape)}
            monitoringAreas={areas}
            earthquakeData={filteredEarthquakeData}
            focusedAreaId={focusedAreaId}
          />
          {pendingShape && (
            <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4">
              <AreaForm
                shape={pendingShape}
                onCancel={() => setPendingShape(null)}
                onSaved={() => {
                  setPendingShape(null);
                  refetch();
                }}
              />
            </div>
          )}
        </main>
        <Sidebar
          areas={areas}
          onFocusArea={setFocusedAreaId}
          onDeleteArea={deleteArea}
        />
      </div>
    </div>
  );
}