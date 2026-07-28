"use client";

import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";

const EarthquakeMap = dynamic(
  () => import("@/components/map/EarthquakeMap"),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col">
      <Header />
      <main className="flex-1">
        <EarthquakeMap />
      </main>
    </div>
  );
}