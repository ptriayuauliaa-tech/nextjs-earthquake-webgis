import type { EarthquakeFeatureCollection } from "@/types/earthquake";

const USGS_ENDPOINT =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

export async function fetchEarthquakes(): Promise<EarthquakeFeatureCollection> {
  const response = await fetch(USGS_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Gagal mengambil data gempa (status: ${response.status})`);
  }

  const data: EarthquakeFeatureCollection = await response.json();
  return data;
}