import type { EarthquakeFeature } from "@/types/earthquake";

// Algoritma Ray-Casting untuk mengecek apakah titik (lat, lng) ada di dalam Polygon
export function isPointInPolygon(
  point: [number, number], // [lat, lng]
  polygon: [number, number][] // array of [lat, lng]
): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0],
      yi = polygon[i][1];
    const xj = polygon[j][0],
      yj = polygon[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

// Menghitung total titik gempa yang berada di dalam polygon tertentu
export function countEarthquakesInPolygon(
  polygonCoords: [number, number][],
  earthquakes: EarthquakeFeature[]
): number {
  if (!polygonCoords || polygonCoords.length < 3 || !earthquakes) return 0;

  return earthquakes.filter((feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    return isPointInPolygon([lat, lng], polygonCoords);
  }).length;
}