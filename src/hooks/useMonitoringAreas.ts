"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";

export interface MonitoringArea {
  id: string;
  name: string;
  description: string | null;
  category: string;
  geometry: GeoJSON.Geometry;
  created_at: string;
}

export function useMonitoringAreas() {
  const [areas, setAreas] = useState<MonitoringArea[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const fetchAreas = useCallback(async () => {
    setStatus("loading");
    const { data, error } = await supabase
      .from("monitoring_areas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus("error");
      return;
    }

    setAreas(data as MonitoringArea[]);
    setStatus("success");
  }, []);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  return { areas, status, refetch: fetchAreas };
}