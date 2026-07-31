import type { MonitoringArea } from "@/hooks/useMonitoringAreas";

export function downloadAreaAsGeoJSON(area: MonitoringArea) {
  const feature = {
    type: "Feature",
    properties: {
      name: area.name,
      category: area.category,
      description: area.description,
      created_at: area.created_at,
    },
    geometry: area.geometry,
  };

  const blob = new Blob([JSON.stringify(feature, null, 2)], {
    type: "application/geo+json",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${area.name.trim().replace(/\s+/g, "-").toLowerCase()}.geojson`;
  link.click();

  URL.revokeObjectURL(url);
}