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
  LayersControl,
} from "react-leaflet";
import { calculatePolygonAreaInKm2, formatArea } from "@/lib/utils/area";
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
        className="h-full w-full bg-slate-950"
      >
        {/* Basemap Switcher (Layer Control) */}
        <LayersControl position="topright">
          {/* Option 1: OpenStreetMap Standard (Peta Terang & Jelas - Default Checked) */}
          <LayersControl.BaseLayer checked name="OpenStreetMap (Standard)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Option 2: Dark Mode (CartoDB Gelap) */}
          <LayersControl.BaseLayer name="Dark Mode (CartoDB)">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          {/* Option 3: Satelit (Esri) */}
          <LayersControl.BaseLayer name="Satelit (Esri)">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Display Koordinat Kursor Real-time */}
        <CursorCoordinates />

        <DrawControl onShapeDrawn={onShapeDrawn} />
        <FlyToArea areaId={focusedAreaId} areas={monitoringAreas} />

        {/* Render Area Pantauan (Polygon & Point) */}
        {monitoringAreas.map((area) => {
          if (area.geometry.type === "Polygon") {
            const coordinates = (
              area.geometry.coordinates[0] as [number, number][]
            ).map(([lng, lat]) => [lat, lng] as [number, number]);

            return (
              <Polygon
                key={area.id}
                positions={coordinates}
                pathOptions={{
                  color: "#10b981",
                  fillColor: "#10b981",
                  fillOpacity: 0.25,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="font-sans text-sm">
                    <p className="font-semibold text-slate-100">{area.name}</p>
                    <p className="font-mono text-xs font-semibold text-emerald-400">
                      Luas:{" "}
                      {formatArea(
                        calculatePolygonAreaInKm2(
                          area.geometry.coordinates[0] as [number, number][]
                        )
                      )}
                    </p>
                    <p className="font-mono text-xs text-slate-300">
                      Kategori: {area.category}
                    </p>
                    {area.description && (
                      <p className="mt-1 text-xs text-slate-400">
                        {area.description}
                      </p>
                    )}
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
                    <p className="font-semibold text-slate-100">{area.name}</p>
                    <p className="font-mono text-xs text-slate-300">
                      Kategori: {area.category}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          }

          return null;
        })}

        {/* Render Titik Gempa */}
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
                fillOpacity: 0.65,
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="font-sans text-sm">
                  <p className="font-semibold text-slate-100">
                    {place ?? "Lokasi tidak diketahui"}
                  </p>
                  <p className="font-mono text-emerald-400 font-semibold">
                    Magnitudo: {mag ?? "N/A"} SR
                  </p>
                  <p className="font-mono text-xs text-slate-300">
                    {formatEarthquakeTime(time)}
                  </p>
                  <p className="font-mono text-xs text-slate-400">
                    Kedalaman: {depth} km
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}