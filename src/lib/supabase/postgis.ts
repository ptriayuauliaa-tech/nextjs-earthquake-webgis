import { supabase } from "./client";

/**
 * Menghitung luas area langsung dari database PostgreSQL menggunakan PostGIS ST_Area
 */
export async function getAreaCalculatedByPostGIS(areaId: string): Promise<number | null> {
  try {
    const { data, error } = await supabase.rpc("get_area_sqkm", {
      area_id: areaId,
    });

    if (error) throw error;
    return data as number;
  } catch (err) {
    console.error("Gagal menghitung luas via PostGIS RPC:", err);
    return null;
  }
}