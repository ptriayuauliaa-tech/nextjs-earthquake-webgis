"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import type { DrawnShape } from "@/types/monitoring-area";

interface AreaFormProps {
  shape: DrawnShape;
  onCancel: () => void;
  onSaved: () => void;
}

export default function AreaForm({ shape, onCancel, onSaved }: AreaFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const { error: insertError } = await supabase.from("monitoring_areas").insert({
      name,
      category,
      description: description || null,
      geometry: shape.geojson.geometry,
    });

    setIsSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    onSaved();
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-line bg-panel p-5 shadow-xl">
      <h2 className="mb-4 text-sm font-semibold text-ink">
        {shape.type === "polygon" ? "Area Pantauan Baru" : "Titik Baru"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-xs text-ink-muted">Nama</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-line bg-deep px-3 py-2 text-sm text-ink outline-none focus:border-signal"
            placeholder="Contoh: Zona Rawan Longsor Garut"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-ink-muted">Kategori</label>
          <input
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded border border-line bg-deep px-3 py-2 text-sm text-ink outline-none focus:border-signal"
            placeholder="Contoh: Rawan Longsor"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-ink-muted">Deskripsi (opsional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded border border-line bg-deep px-3 py-2 text-sm text-ink outline-none focus:border-signal"
          />
        </div>

        {error && <p className="text-xs text-red-400">Gagal menyimpan: {error}</p>}

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded border border-line py-2 text-sm text-ink-muted hover:bg-deep"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 rounded bg-signal py-2 text-sm font-medium text-deep disabled:opacity-50"
          >
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}