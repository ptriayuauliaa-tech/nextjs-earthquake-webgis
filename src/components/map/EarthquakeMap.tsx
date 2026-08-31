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
  searchedLocation: [number, number] | null;
}

function FlyHandler({
  areaId,
  areas,
  searchedLocation,
}: {
  areaId: string | null;
  areas: MonitoringArea[];
  searchedLocation: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (searchedLocation) {
      map.flyTo(searchedLocation, 11, { duration: 1.5 });
      return;
    }

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
  }, [areaId, areas, searchedLocation, map]);

  return null;
}

export default function EarthquakeMap({
  onShapeDrawn,
  monitoringAreas,
  earthquakeData,
  focusedAreaId,
  searchedLocation,
}: EarthquakeMapProps) {
  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={INDONESIA_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={MIN_ZOOM}
        scrollWheelZoom={true}
        className="h-full w-full bg-[#081412]"
      >
        {/* Basemap Switcher */}
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap (Standard)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Dark Mode (CartoDB)">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satelit (Esri)">
            <TileLayer
              attribution="Tiles &copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <CursorCoordinates />
        <DrawControl onShapeDrawn={onShapeDrawn} />
        <FlyHandler
          areaId={focusedAreaId}
          areas={monitoringAreas}
          searchedLocation={searchedLocation}
        />

        {/* Render Area Pantauan */}
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
                  color: "#34d399",
                  fillColor: "#34d399",
                  fillOpacity: 0.25,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="font-sans text-xs">
                    <p className="font-bold text-white text-sm">{area.name}</p>
                    <p className="font-mono text-[#6ee7b7] font-semibold mt-1">
                      Luas:{" "}
                      {formatArea(
                        calculatePolygonAreaInKm2(
                          area.geometry.coordinates[0] as [number, number][]
                        )
                      )}
                    </p>
                    <p className="text-[#94a3b8]">Kategori: {area.category}</p>
                    {area.description && (
                      <p className="mt-1 text-[#cbd5e1]">{area.description}</p>
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
                  <div className="font-sans text-xs">
                    <p className="font-bold text-white text-sm">{area.name}</p>
                    <p className="text-[#94a3b8]">Kategori: {area.category}</p>
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
                fillOpacity: 0.7,
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="font-sans text-xs">
                  <p className="font-bold text-white text-sm">
                    {place ?? "Lokasi tidak diketahui"}
                  </p>
                  <p className="font-mono text-[#34d399] font-bold mt-1">
                    Magnitudo: {mag ?? "N/A"} SR
                  </p>
                  <p className="text-[#94a3b8]">{formatEarthquakeTime(time)}</p>
                  <p className="text-[#cbd5e1]">Kedalaman: {depth} km</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}