import React from "react";
import { toGeoJSON } from "@mapbox/polyline";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import * as ReactDOMServer from "react-dom/server";

export const addSegmentToMap = (map, segment, markerArr) => {
  const geometry = getGeometry(segment);
  const { id, startLatlng } = segment;

  const startCoord = startLatlng.slice().reverse();
  if (markerArr) markerArr.push(startCoord);

  const idString = `${id}`;

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
    id: idString,
    type: "line",
    source: idString,
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
  // const popup = new mapboxgl.Popup({
  //   closeButton: false,
  //   closeOnClick: false,
  // });

  const markerGreen = new mapboxgl.Marker({
    id: idString,
    color: "#008000",
    // draggable: true,
    // offset: [0, -50 / 2],
    scale: 0.5,
  });
  markerGreen.setLngLat(startCoord).addTo(map);

  map.meinMarkers.markers.push(markerGreen);
};

export const addSegmentPopupToMap = (map, segment) => {
  const { name, id } = segment;
  const idString = `${id}`;

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on("mouseenter", idString, (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    // }

    const popupHTML = (
      <h4>
        <a href={`/segments/${idString}`}>{name}</a>
      </h4>
    );

    popup
      .setLngLat(e.lngLat)
      .setHTML(ReactDOMServer.renderToStaticMarkup(popupHTML))
      .addTo(map);
  });

  map.on("mouseleave", idString, () => {
    map.getCanvas().style.cursor = "";
    setTimeout(() => {
      popup.remove();
    }, 1500);
    //TODO detect if cursor is over popup and keep alive
  });
};

export const getGeometry = (segment) => {
  const polyline = segment?.polyline;
  let geoJson = {
    type: "lineString",
    coordinates: [],
  };
  if (polyline) {
    geoJson = toGeoJSON(polyline);
  }
  return geoJson;
};

export const getBounds = (arr, padding = 0.015) => {
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

  return [
    [minLat - padding, minLng - padding],
    [maxLat + padding, maxLng + padding],
  ];
};
