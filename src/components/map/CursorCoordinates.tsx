'use client';

import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';

export function CursorCoordinates() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useMapEvents({
    mousemove(e) {
      setCoords({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
    mouseout() {
      setCoords(null);
    },
  });

  if (!coords) return null;

  return (
    <div className="absolute bottom-5 left-5 z-[1000] rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs font-mono text-white shadow-md backdrop-blur-md border border-slate-700/50 pointer-events-none select-none">
      <span className="text-emerald-400 font-semibold">LAT:</span> {coords.lat.toFixed(5)}
      <span className="mx-2 text-slate-500">|</span>
      <span className="text-emerald-400 font-semibold">LNG:</span> {coords.lng.toFixed(5)}
    </div>
  );
}