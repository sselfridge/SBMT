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

import { segments } from "mockData/data";
import keys from "config";

mapboxgl.accessToken = keys.mapBox;

const datas = [
  [
    [-122.483696, 37.833818],
    [-122.483482, 37.833174],
    [-122.483396, 37.8327],
    [-122.483568, 37.832056],
    [-122.48404, 37.831141],
    [-122.48404, 37.830497],
    [-122.483482, 37.82992],
    [-122.483568, 37.829548],
    [-122.48507, 37.829446],
    [-122.4861, 37.828802],
    [-122.486958, 37.82931],
    [-122.487001, 37.830802],
    [-122.487516, 37.831683],
    [-122.488031, 37.832158],
    [-122.488889, 37.832971],
    [-122.489876, 37.832632],
    [-122.490434, 37.832937],
    [-122.49125, 37.832429],
    [-122.491636, 37.832564],
    [-122.492237, 37.833378],
    [-122.493782, 37.833683],
  ],
  [
    [-122.487001, 37.830802],
    [-122.487516, 37.831683],
    [-122.488031, 37.832158],
    [-122.488889, 37.832971],
    [-122.489876, 37.832632],
    [-122.490434, 37.832937],
    [-122.49125, 37.832429],
    [-122.491636, 37.832564],
    [-122.492237, 37.833378],
    [-122.493782, 37.833683],
  ],
  [
    [-122.483696, 37.833818],
    [-122.483482, 37.833174],
    [-122.483396, 37.8327],
    [-122.483568, 37.832056],
    [-122.48404, 37.831141],
    [-122.48404, 37.830497],
    [-122.483482, 37.82992],
    [-122.483568, 37.829548],
    [-122.48507, 37.829446],
    [-122.4861, 37.828802],
    [-122.486958, 37.82931],
  ],
];

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

    // map.current.on("load", () => {
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
    // });
  });

  React.useEffect(() => {
    if (map.current && dataIdx !== 0) {
      console.info("Add Segment");
      const segment = segments[dataIdx];
      console.info("segment: ", segment.name);
      addSegmentToMap(map.current, segment);
    }
  }, [dataIdx]);

  const swapData = () => {
    setDataIdx((curr) => {
      const newVal = (curr + 1) % segments.length;
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
