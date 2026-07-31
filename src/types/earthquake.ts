export interface EarthquakeProperties {
  mag: number | null;
  place: string | null;
  time: number;
  updated: number;
  depth?: number;
}

export interface EarthquakeGeometry {
  type: "Point";
  coordinates: [number, number, number];
}

export interface EarthquakeFeature {
  type: "Feature";
  id: string;
  properties: EarthquakeProperties;
  geometry: EarthquakeGeometry;
}

export interface EarthquakeFeatureCollection {
  type: "FeatureCollection";
  metadata: {
    generated: number;
    title: string;
    count: number;
  };
  features: EarthquakeFeature[];
}