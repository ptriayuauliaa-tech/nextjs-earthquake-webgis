export function getMagnitudeColor(mag: number | null): string {
  if (mag === null) return "#9aa1ac"; // abu-abu, data tidak tersedia
  if (mag < 3) return "#4fb3a9";      // teal, magnitudo kecil - aman
  if (mag < 5) return "#e8a33d";      // amber, magnitudo sedang
  return "#e35b3f";                    // merah, magnitudo besar - waspada
}

export function getMagnitudeRadius(mag: number | null): number {
  if (mag === null) return 5;
  return Math.max(5, mag * 3.5);
}

export function formatEarthquakeTime(timestamp: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(timestamp));
}