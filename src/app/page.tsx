"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Toast } from "@/components/ui/Toast";
import { useEarthquakes } from "@/hooks/useEarthquakes";
import { useMonitoringAreas } from "@/hooks/useMonitoringAreas";
import { supabase } from "@/lib/supabase/client";
import type { DrawnShape } from "@/types/monitoring-area";

const EarthquakeMap = dynamic(
  () => import("@/components/map/EarthquakeMap"),
  { ssr: false }
);

interface AreaFormModalProps {
  isOpen: boolean;
  shapeType?: string;
  onClose: () => void;
  onSave: (data: { name: string; description: string; category: string }) => void;
}

function AreaFormModal({ isOpen, shapeType, onClose, onSave }: AreaFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Zona Rawan Gempa");

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, description, category });
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[#1a3d35] bg-[#091714] p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#16332d] pb-2.5 mb-3.5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Simpan {shapeType === "marker" || shapeType === "Point" ? "Titik Lokasi" : "Area Pantauan"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d221e] text-[#94a3b8] hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="mb-1 block font-medium text-[#cbd5e1]">Nama Wilayah</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sesar Lembang..."
              className="w-full rounded-xl border border-[#1a3d35] bg-[#0d221e] px-3 py-2 text-white placeholder-[#5a736c] focus:border-[#34d399] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-[#cbd5e1]">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-[#1a3d35] bg-[#0d221e] px-3 py-2 text-white focus:border-[#34d399] focus:outline-none cursor-pointer"
            >
              <option value="Zona Rawan Gempa">Zona Rawan Gempa</option>
              <option value="Jalur Sesar / Patahan">Jalur Sesar / Patahan</option>
              <option value="Area Evakuasi">Area Evakuasi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-medium text-[#cbd5e1]">Deskripsi (Opsional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan..."
              className="w-full rounded-xl border border-[#1a3d35] bg-[#0d221e] px-3 py-1.5 text-white placeholder-[#5a736c] focus:border-[#34d399] focus:outline-none"
            />
          </div>

          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full bg-[#112a24] border border-[#1e463d] py-2 font-semibold text-[#cbd5e1] hover:bg-[#183a32] transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-[#2d5c56] hover:bg-[#38736b] py-2 font-bold text-white transition cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Home() {
  const eqHook = useEarthquakes() as any;
  const earthquakeData = eqHook.data ?? eqHook.earthquakes ?? null;
  const isLoading = eqHook.isLoading ?? false;
  const error = eqHook.error ?? null;

  const monitoringHook = useMonitoringAreas() as any;
  const areas = monitoringHook.areas ?? [];
  const refetchAreas = monitoringHook.refetch;

  const [currentDrawnShape, setCurrentDrawnShape] = useState<DrawnShape | null>(null);
  const [focusedAreaId, setFocusedAreaId] = useState<string | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<[number, number] | null>(null);
  const [minMagnitude, setMinMagnitude] = useState<number>(0);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  function showToast(message: string, type: "success" | "error" = "success") {
    setToastMessage(message);
    setToastType(type);
  }

  const filteredEarthquakeData = useMemo(() => {
    if (!earthquakeData?.features) return null;
    return {
      ...earthquakeData,
      features: earthquakeData.features.filter(
        (f: any) => (f.properties?.mag ?? 0) >= minMagnitude
      ),
    };
  }, [earthquakeData, minMagnitude]);

  async function handleSearchLocation(query: string) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=id&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setSearchedLocation([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        showToast(`Menuju ke ${data[0].display_name.split(",")[0]}`, "success");
      } else {
        showToast("Wilayah tidak ditemukan di Indonesia.", "error");
      }
    } catch (e) {
      showToast("Gagal melakukan pencarian.", "error");
    }
  }

  function handleShapeDrawn(shape: DrawnShape) {
    setCurrentDrawnShape(shape);
  }

  async function handleSaveArea(data: {
    name: string;
    description: string;
    category: string;
  }) {
    if (!currentDrawnShape) return;

    try {
      const geometry =
        (currentDrawnShape as any).geometry ??
        (currentDrawnShape as any).layer?.toGeoJSON?.().geometry;

      const { error: insertError } = await supabase
        .from("monitoring_areas")
        .insert({
          name: data.name,
          description: data.description,
          category: data.category,
          geometry: geometry,
        });

      if (insertError) throw insertError;

      if (refetchAreas) await refetchAreas();
      setCurrentDrawnShape(null);
      showToast("Area pantauan berhasil disimpan!", "success");
    } catch (err: any) {
      console.error(err);
      showToast("Gagal menyimpan area pantauan.", "error");
    }
  }

  async function handleDeleteArea(id: string) {
    try {
      const { error: deleteError } = await supabase
        .from("monitoring_areas")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      if (refetchAreas) await refetchAreas();
      showToast("Area pantauan berhasil dihapus.", "success");
    } catch (err: any) {
      console.error(err);
      showToast("Gagal menghapus area pantauan.", "error");
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-[#081412] overflow-hidden text-[#e2e8f0]">
      <Header
        earthquakeCount={filteredEarthquakeData?.features?.length ?? 0}
        areaCount={areas.length}
        minMagnitude={minMagnitude}
        onMagnitudeChange={setMinMagnitude}
        onSearchLocation={handleSearchLocation}
      />

      <main className="relative flex flex-1 flex-col md:flex-row overflow-hidden">
        <div className="relative flex-1 h-full w-full">
          {isLoading && (
            <div className="absolute inset-0 z-[1200] flex items-center justify-center bg-[#081412]/80 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 rounded-full border border-[#1a3d35] bg-[#091714] px-4 py-2 text-xs text-[#6ee7b7]">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#34d399] border-t-transparent" />
                <span>Memuat data gempa...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute top-3 right-3 z-[1200] rounded-xl border border-red-500/40 bg-red-950/90 px-3.5 py-2 text-xs text-red-200">
              {error.message}
            </div>
          )}

          <EarthquakeMap
            onShapeDrawn={handleShapeDrawn}
            monitoringAreas={areas}
            earthquakeData={filteredEarthquakeData}
            focusedAreaId={focusedAreaId}
            searchedLocation={searchedLocation}
          />
        </div>

        <Sidebar
          areas={areas}
          earthquakeData={filteredEarthquakeData}
          onFocusArea={setFocusedAreaId}
          onDeleteArea={handleDeleteArea}
        />
      </main>

      {currentDrawnShape && (
        <AreaFormModal
          isOpen={!!currentDrawnShape}
          shapeType={(currentDrawnShape as any).type}
          onClose={() => setCurrentDrawnShape(null)}
          onSave={handleSaveArea}
        />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}