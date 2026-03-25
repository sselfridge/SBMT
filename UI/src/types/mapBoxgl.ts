//@ts-ignore
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import type { Map } from "mapbox-gl";


export interface MeinMarkers {
  markers: mapboxgl.Marker[];
  layers: string[];
  sources: string[];
}

export type MapWithMarkers = Map & { meinMarkers: MeinMarkers };