export interface DrawnShape {
  type: "marker" | "polygon";
  geojson: GeoJSON.Feature;
}