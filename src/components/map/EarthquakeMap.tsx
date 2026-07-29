"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useEarthquakes } from "@/hooks/useEarthquakes";
import {
  getMagnitudeColor,
  getMagnitudeRadius,
  formatEarthquakeTime,
} from "@/lib/utils/magnitude";

const INDONESIA_CENTER: [number, number] = [-2.5489, 118.0149];
const DEFAULT_ZOOM = 5;
const MIN_ZOOM = 4;

export default function EarthquakeMap() {
  const { data, status, errorMessage } = useEarthquakes();

  return (
    <div className="relative h-full w-full">
      {status === "loading" && (
        <div className="absolute top-4 left-1/2 z-[1000] -translate-x-1/2 rounded-full border border-line bg-panel px-4 py-2 text-xs font-mono text-ink-muted shadow-lg">
          Memuat data gempa...
        </div>
      )}

      {status === "error" && (
        <div className="absolute top-4 left-1/2 z-[1000] -translate-x-1/2 rounded-lg border border-line bg-panel px-4 py-2 text-xs text-ink shadow-lg">
          <span className="font-semibold text-red-400">Gagal memuat data:</span>{" "}
          {errorMessage}
        </div>
      )}

      <MapContainer
        center={INDONESIA_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={MIN_ZOOM}
        scrollWheelZoom={true}
        className="h-full w-full bg-panel"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data?.features.map((feature) => {
          const [lng, lat, depth] = feature.geometry.coordinates;
          const { mag, place, time } = feature.properties;

          return (
            <CircleMarker
              key={feature.id}
              center={[lat, lng]}
              radius={getMagnitudeRadius(mag)}
              pathOptions={{
                color: getMagnitudeColor(mag),
                fillColor: getMagnitudeColor(mag),
                fillOpacity: 0.6,
              }}
            >
              <Popup>
                <div className="font-sans text-sm">
                  <p className="font-semibold">{place ?? "Lokasi tidak diketahui"}</p>
                  <p className="font-mono">Magnitudo: {mag ?? "N/A"}</p>
                  <p className="font-mono text-xs">{formatEarthquakeTime(time)}</p>
                  <p className="font-mono">Kedalaman: {depth} km</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}