"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Header from "@/components/layout/Header";
import AreaForm from "@/components/map/AreaForm";
import Sidebar from "@/components/layout/Sidebar";
import SummaryBar from "@/components/layout/SummaryBar";
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
  const { areas, refetch, deleteArea } = useMonitoringAreas();
  const { data: earthquakeData } = useEarthquakes();

  return (
    <div className="flex h-screen w-screen flex-col">
      <Header />
      <SummaryBar
        earthquakeCount={earthquakeData?.features.length ?? 0}
        areaCount={areas.length}
        lastUpdated={earthquakeData?.metadata.generated}
      />
      <div className="relative flex flex-1 overflow-hidden">
        <main className="relative flex-1">
          <EarthquakeMap
            onShapeDrawn={(shape) => setPendingShape(shape)}
            monitoringAreas={areas}
            earthquakeData={earthquakeData ?? null}
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
        <Sidebar areas={areas} onFocusArea={setFocusedAreaId} onDeleteArea={deleteArea} />
      </div>
    </div>
  );
}