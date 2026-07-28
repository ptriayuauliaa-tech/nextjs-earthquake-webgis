"use client";

import dynamic from "next/dynamic";

const EarthquakeMap = dynamic(
  () => import("@/components/map/EarthquakeMap"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <EarthquakeMap />
    </main>
  );
}