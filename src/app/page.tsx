"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Header from "@/components/layout/Header";
import AreaForm from "@/components/map/AreaForm";
import { useMonitoringAreas } from "@/hooks/useMonitoringAreas";
import type { DrawnShape } from "@/types/monitoring-area";

const EarthquakeMap = dynamic(
  () => import("@/components/map/EarthquakeMap"),
  { ssr: false }
);

export default function Home() {
  const [pendingShape, setPendingShape] = useState<DrawnShape | null>(null);
  const { areas, refetch } = useMonitoringAreas();

  return (
    <div className="flex h-screen w-screen flex-col">
      <Header />
      <main className="relative flex-1">
        <EarthquakeMap
          onShapeDrawn={(shape) => setPendingShape(shape)}
          monitoringAreas={areas}
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
    </div>
  );
}