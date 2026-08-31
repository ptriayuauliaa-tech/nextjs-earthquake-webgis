"use client";

import { useState, useRef, useEffect } from "react";
import { useMap } from "react-leaflet";

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function SearchLocation() {
  const map = useMap();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=id&limit=5`
      );
      const data = await response.json();
      setResults(data);
      setIsOpen(true);
    } catch (error) {
      console.error("Gagal mencari lokasi:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectLocation(lat: string, lon: string) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    map.flyTo([latitude, longitude], 12, { duration: 1.5 });
    setIsOpen(false);
    setQuery("");
  }

  return (
    <div ref={searchRef} className="relative w-56 sm:w-64 font-sans">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari wilayah/kota..."
          className="w-full rounded-full border border-[#1b3d36] bg-[#0c1f1b]/95 py-2 pl-9 pr-8 text-xs text-white placeholder-[#64748b] backdrop-blur-md transition focus:border-[#34d399] focus:outline-none focus:ring-1 focus:ring-[#34d399] shadow-lg"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3.5 text-[#6ee7b7]"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        {isLoading && (
          <span className="absolute right-3 h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#34d399] border-t-transparent" />
        )}
      </form>

      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto rounded-2xl border border-[#1b3d36] bg-[#0c1f1b]/98 p-1.5 backdrop-blur-md shadow-2xl z-50">
          {results.map((item) => (
            <li
              key={item.place_id}
              onClick={() => handleSelectLocation(item.lat, item.lon)}
              className="cursor-pointer rounded-xl px-3 py-2 text-xs text-[#cbd5e1] transition hover:bg-[#15332c] hover:text-[#86efac]"
            >
              <p className="line-clamp-2 leading-relaxed">{item.display_name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}