"use client";

import { useState } from "react";
import { useMapEvents } from "react-leaflet";

export function CursorCoordinates() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useMapEvents({
    mousemove(e) {
      setCoords({
        lat: Number(e.latlng.lat.toFixed(5)),
        lng: Number(e.latlng.lng.toFixed(5)),
      });
    },
  });

  if (!coords) return null;

  return (
    <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-2 rounded-full border border-[#1e463e] bg-[#0d221e]/90 px-3.5 py-1.5 font-mono text-xs text-[#94a3b8] backdrop-blur-md shadow-lg pointer-events-none">
      <span className="text-[#6ee7b7] font-semibold">LAT:</span> {coords.lat}
      <span className="text-[#25564b]">|</span>
      <span className="text-[#67e8f9] font-semibold">LNG:</span> {coords.lng}
    </div>
  );
}