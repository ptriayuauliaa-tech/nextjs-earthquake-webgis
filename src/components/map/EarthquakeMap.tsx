"use client";

import { MapContainer, TileLayer } from "react-leaflet";

const INDONESIA_CENTER: [number, number] = [-2.5489, 118.0149];
const DEFAULT_ZOOM = 5;

export default function EarthquakeMap() {
  return (
    <MapContainer
      center={INDONESIA_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}