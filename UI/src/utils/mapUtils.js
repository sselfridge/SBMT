import { toGeoJSON } from "@mapbox/polyline";

export const addSegmentToMap = (map, segment) => {
  const geometry = getGeometry(segment);
  const { id, start_latlng, end_latlng } = segment;

  const startCoord = start_latlng.slice().reverse();
  const endCoord = end_latlng.slice().reverse();

  console.info("red\t", map.hasImage("redMarker"));
  console.info("green\t", map.hasImage("greenMarker"));

  if (!map.getSource(`${id}`)) {
    map.addSource(`${id}`, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry,
      },
    });
    map.addSource(`${id}-start`, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: { ...segment },
        geometry: { type: "Point", coordinates: startCoord },
      },
    });
    map.addSource(`${id}-end`, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: { ...segment },
        geometry: { type: "Point", coordinates: endCoord },
      },
    });

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

    map.addLayer({
      id: `${id}-start`,
      type: "symbol",
      source: `${id}-start`,
      layout: {
        "icon-image": "greenMarker", // reference the image
        "icon-size": 1,
      },
    });
    map.addLayer({
      id: `${id}-end`,
      type: "symbol",
      source: `${id}-end`,
      layout: {
        "icon-image": "greenMarker", // reference the image
        "icon-size": 1,
      },
    });
    console.info(map.getSource(`${id}`));
    console.info(map.getSource(`${id}-start`));
    console.info(map.getSource(`${id}-end`));

    console.info(map.getLayer(`${id}`));
    console.info(map.getLayer(`${id}-start`));
    console.info(map.getLayer(`${id}-end`));
    // const checkSource = map.getSource(`${id}-start`);
    // console.info("checkSource: ", checkSource);
  }
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
