import { toGeoJSON } from "@mapbox/polyline";

export const addSegmentToMap = (map, segment) => {
  const geometry = getGeometry(segment);
  const { id } = segment;

  if (!map.getSource(`${id}`)) {
    map.addSource(`${id}`, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry,
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
  }
  map.on("mouseover", `${id}`, () => {
    console.info("id:", id);
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
