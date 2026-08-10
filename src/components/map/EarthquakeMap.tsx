"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polygon,
  Marker,
  useMap,
} from "react-leaflet";
import {
  getMagnitudeColor,
  getMagnitudeRadius,
  formatEarthquakeTime,
} from "@/lib/utils/magnitude";
import DrawControl from "./DrawControl";
import { CursorCoordinates } from "./CursorCoordinates";
import type { DrawnShape } from "@/types/monitoring-area";
import type { MonitoringArea } from "@/hooks/useMonitoringAreas";
import type { EarthquakeFeatureCollection } from "@/types/earthquake";

const INDONESIA_CENTER: [number, number] = [-2.5489, 118.0149];
const DEFAULT_ZOOM = 5;
const MIN_ZOOM = 4;

interface EarthquakeMapProps {
  onShapeDrawn: (shape: DrawnShape) => void;
  monitoringAreas: MonitoringArea[];
  earthquakeData: EarthquakeFeatureCollection | null;
  focusedAreaId: string | null;
}

function FlyToArea({
  areaId,
  areas,
}: {
  areaId: string | null;
  areas: MonitoringArea[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!areaId) return;
    const area = areas.find((a) => a.id === areaId);
    if (!area) return;

    if (area.geometry.type === "Polygon") {
      const coords = (area.geometry.coordinates[0] as [number, number][]).map(
        ([lng, lat]) => [lat, lng] as [number, number]
      );
      map.fitBounds(coords);
    } else if (area.geometry.type === "Point") {
      const [lng, lat] = area.geometry.coordinates as [number, number];
      map.flyTo([lat, lng], 10);
    }
  }, [areaId, areas, map]);

  return null;
}

export default function EarthquakeMap({
  onShapeDrawn,
  monitoringAreas,
  earthquakeData,
  focusedAreaId,
}: EarthquakeMapProps) {
  return (
    <div className="relative h-full w-full">
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

        {/* Fitur Tambahan 1: Display Koordinat Kursor Real-time */}
        <CursorCoordinates />

        <DrawControl onShapeDrawn={onShapeDrawn} />
        <FlyToArea areaId={focusedAreaId} areas={monitoringAreas} />

        {monitoringAreas.map((area) => {
          if (area.geometry.type === "Polygon") {
            const coordinates = (area.geometry.coordinates[0] as [number, number][]).map(
              ([lng, lat]) => [lat, lng] as [number, number]
            );
            return (
              <Polygon
                key={area.id}
                positions={coordinates}
                pathOptions={{ color: "#4fb3a9", fillOpacity: 0.3 }}
              >
                <Popup>
                  <div className="font-sans text-sm">
                    <p className="font-semibold">{area.name}</p>
                    <p className="font-mono text-xs">{area.category}</p>
                    {area.description && <p>{area.description}</p>}
                  </div>
                </Popup>
              </Polygon>
            );
          }

          if (area.geometry.type === "Point") {
            const [lng, lat] = area.geometry.coordinates as [number, number];
            return (
              <Marker key={area.id} position={[lat, lng]}>
                <Popup>
                  <div className="font-sans text-sm">
                    <p className="font-semibold">{area.name}</p>
                    <p className="font-mono text-xs">{area.category}</p>
                  </div>
                </Popup>
              </Marker>
            );
          }

          return null;
        })}

        {earthquakeData?.features.map((feature) => {
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