import { decode } from "@mapbox/polyline";

export const addSegmentToMap = (map, segment) => {
  const coordinates = getCoordinates(segment);
  const { id } = segment;

  if (!map.getSource(`${id}`)) {
    map.addSource(`${id}`, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates,
        },
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
};

const getCoordinates = (segment) => {
  const polyline = segment?.map?.polyline;
  let coords = [];
  if (polyline) {
    coords = decode(polyline);
    coords.forEach((a) => {
      let temp = a[0];
      a[0] = a[1];
      a[1] = temp;
    });
  }
  return coords;
};
