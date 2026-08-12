// Menghitung luas polygon pada permukaan bumi (Spherical Area) dalam km²
export function calculatePolygonAreaInKm2(coordinates: [number, number][]): number {
  if (!coordinates || coordinates.length < 3) return 0;

  let area = 0;
  const radius = 6378137; // Radian bumi dalam meter

  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;
    const [lng1, lat1] = coordinates[i];
    const [lng2, lat2] = coordinates[j];

    const radLat1 = (lat1 * Math.PI) / 180;
    const radLat2 = (lat2 * Math.PI) / 180;
    const radLngDelta = ((lng2 - lng1) * Math.PI) / 180;

    area += radLngDelta * (2 + Math.sin(radLat1) + Math.sin(radLat2));
  }

  area = (Math.abs(area) * radius * radius) / 2; // m²
  return area / 1000000; // Konversi ke km²
}

// Format tampilan luas (m² jika < 1 km², km² jika ≥ 1 km²)
export function formatArea(areaKm2: number): string {
  if (areaKm2 < 1) {
    return `${(areaKm2 * 1000000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} m²`;
  }
  return `${areaKm2.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km²`;
}