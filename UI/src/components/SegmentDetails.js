import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  useLocation,
  useMatch,
  useParams,
  useSearchParams,
} from "react-router-dom";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { addSegmentToMap } from "utils/mapUtils";

import marker from "assets/maki/marker.svg";

import redMarkerSvg from "assets/hackyColors/redMarker.svg";
import greenMarkerSvg from "assets/hackyColors/greenMarker.svg";
import { ReactComponent as ReactLogo } from "assets/maki/marker.svg";
import { segments } from "mockData/data";
import keys from "config";

mapboxgl.accessToken = keys.mapBox;

let addedIds = [];

let redMarker = new Image(15, 15);
redMarker.src = redMarkerSvg;
console.info("redMarker: ", redMarker);

let greenMarker = new Image(15, 15);
greenMarker.src = greenMarkerSvg;
console.info("greenMarker: ", greenMarker);

const MyBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: 8,
  borderRadius: 4,
}));

const Segments = (props) => {
  const { prop } = props;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-119.6769);
  const [lat, setLat] = useState(34.46313);
  const [dataIdx, setDataIdx] = useState(0);
  const [zoom, setZoom] = useState(11);
  const params = useParams();
  console.info("params: ", params);

  React.useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.addImage("redMarker", redMarker);
    map.current.addImage("greenMarker", greenMarker);
    map.current.on("load", () => {
      // function addMarkers() {
      //   /* For each feature in the GeoJSON object above: */
      //   for (const marker of stores.features) {
      //     /* Create a div element for the marker. */
      //     const el = document.createElement("div");
      //     /* Assign a unique `id` to the marker. */
      //     el.id = `marker-${marker.properties.id}`;
      //     /* Assign the `marker` class to each marker for styling. */
      //     el.className = "redMark";
      //     /**
      //      * Create a marker using the div element
      //      * defined above and add it to the map.
      //      **/
      //     new mapboxgl.Marker(el, { offset: [0, -23] })
      //       .setLngLat(marker.geometry.coordinates)
      //       .addTo(map);
      //   }
      // }
      // map.current.addSource("route", {
      //   type: "geojson",
      //   data: {
      //     type: "Feature",
      //     properties: {},
      //     geometry: {
      //       type: "LineString",
      //       coordinates: datas[dataIdx],
      //     },
      //   },
      // });
      // map.current.addLayer({
      //   id: "route",
      //   type: "line",
      //   source: "route",
      //   layout: {
      //     "line-join": "miter",
      //     "line-cap": "round",
      //   },
      //   paint: {
      //     "line-color": "#ff0088",
      //     "line-width": 4,
      //   },
      // });
    });
  });

  React.useEffect(() => {
    if (map?.current?.loaded()) {
      if (dataIdx !== segments.length) {
        const segment = segments[dataIdx];
        addSegmentToMap(map.current, segment);
        addedIds.push(segment.id);
      } else {
        console.info("CLEAR!!");
        addedIds.forEach((id) => {
          map.current.removeLayer(`${id}`);
          map.current.removeLayer(`${id}-start`);
          map.current.removeSource(`${id}`);
          map.current.removeSource(`${id}-start`);
        });
        addedIds = [];
      }
    }

    // new mapboxgl.Marker({
    //   color: "#FFFFFF",
    //   draggable: true,
    //   offset: [0, -50 / 2],
    // })
    //   .setLngLat([lng, lat])
    //   .addTo(map.current);
  }, [dataIdx]);

  const swapData = () => {
    setDataIdx((curr) => {
      const newVal = (curr + 1) % (segments.length + 1);
      return newVal;
    });
  };

  return (
    <MyBox>
      <header>Segment Detail {params.id}</header>

      <button onClick={swapData}>Do Stuff</button>
      <main>
        <div
          style={{ height: "80vh", width: "85vw" }}
          ref={mapContainer}
          className="map-container"
        />
      </main>
    </MyBox>
  );
};

Segments.propTypes = {
  prop: PropTypes.string,
};

export default Segments;
