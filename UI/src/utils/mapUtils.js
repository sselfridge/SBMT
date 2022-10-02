import { toGeoJSON } from "@mapbox/polyline";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

export const addSegmentToMap = (map, segment, markerArr) => {
  const geometry = getGeometry(segment);
  const { id, start_latlng } = segment;

  const startCoord = start_latlng.slice().reverse();
  if (markerArr) markerArr.push(startCoord);

  const idString = `${id}`;
  console.info("idString: ", idString);

  map.addSource(idString, {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry,
    },
  });
  map.meinMarkers.sources.push(idString);
  // map.addSource(`${id}-start`, {
  //   type: "geojson",
  //   data: {
  //     type: "Feature",
  //     properties: { ...segment },
  //     geometry: { type: "Point", coordinates: startCoord },
  //   },
  // });
  // map.addSource(`${id}-end`, {
  //   type: "geojson",
  //   data: {
  //     type: "Feature",
  //     properties: { ...segment },
  //     geometry: { type: "Point", coordinates: endCoord },
  //   },
  // });

  map.addLayer({
    id: `${id}`,
    type: "line",
    source: `${id}`,
    layout: {
      "line-join": "miter",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#ff0088",
      "line-width": 4,
    },
  });
  map.meinMarkers.layers.push(idString);

  // const markerRed = new mapboxgl.Marker({
  //   color: "#ff0000",
  //   // draggable: true,
  //   offset: [0, -50 / 2],
  //   scale: 0.5,
  // })
  //   .setLngLat(endCoord)
  //   .addTo(map);

  // if (map.meinMarkers) map.meinMarkers.push(markerRed);

  const markerGreen = new mapboxgl.Marker({
    color: "#008000",
    // draggable: true,
    // offset: [0, -50 / 2],
    scale: 0.5,
  })
    .setLngLat(startCoord)
    .addTo(map);

  map.meinMarkers.markers.push(markerGreen);
  map.on("mouseover", `${id}`, () => {
    console.info("mouse over seg id:", id);
  });
};

const getGeometry = (segment) => {
  const polyline = segment?.map?.polyline;
  let geoJson = {
    type: "lineString",
    coordinates: [],
  };
  if (polyline) {
    geoJson = toGeoJSON(polyline);
  }
  return geoJson;
};

export const getBounds = (arr) => {
  let minLat = Number.POSITIVE_INFINITY,
    maxLat = Number.NEGATIVE_INFINITY,
    minLng = Number.POSITIVE_INFINITY,
    maxLng = Number.NEGATIVE_INFINITY;

  arr.forEach(([lat, lng]) => {
    if (lat < minLat) minLat = lat;
    if (lng < minLng) minLng = lng;
    if (lat > maxLat) maxLat = lat;
    if (lng > maxLng) maxLng = lng;
  });

  const PADDING = 0.01;

  return [
    [minLat - PADDING, minLng - PADDING],
    [maxLat + PADDING, maxLng + PADDING],
  ];
};
