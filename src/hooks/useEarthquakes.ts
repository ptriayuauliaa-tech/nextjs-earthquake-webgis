"use client";

import { useEffect, useState } from "react";
import { fetchEarthquakes } from "@/lib/api/earthquakes";
import type { EarthquakeFeatureCollection } from "@/types/earthquake";

type FetchStatus = "loading" | "success" | "error";

interface UseEarthquakesResult {
  data: EarthquakeFeatureCollection | null;
  status: FetchStatus;
  errorMessage: string | null;
}

export function useEarthquakes(): UseEarthquakesResult {
  const [data, setData] = useState<EarthquakeFeatureCollection | null>(null);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setStatus("loading");
      try {
        const result = await fetchEarthquakes();
        if (!isCancelled) {
          setData(result);
          setStatus("success");
        }
      } catch (error) {
        if (!isCancelled) {
          const message =
            error instanceof Error ? error.message : "Terjadi kesalahan tidak diketahui";
          setErrorMessage(message);
          setStatus("error");
        }
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { data, status, errorMessage };
}