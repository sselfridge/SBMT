import React, { useState, useCallback, useRef } from "react";
import * as ReactDOM from "react-dom";
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

import { segments as datas } from "mockData/data";

import markerSvg from "assets/maki/marker.svg";

import redMarkerSvg from "assets/hackyColors/redMarker.svg";
import greenMarkerSvg from "assets/hackyColors/greenMarker.svg";
import { ReactComponent as ReactLogo } from "assets/maki/marker.svg";
import segments from "mockData/segments";
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

  const markerRef = useRef(null);

  React.useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.meinMarkers = {
      markers: [],
      layers: [],
      sources: [],
    };
    console.info("map.current.meinMarkers: ", map.current.meinMarkers);
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
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: datas[dataIdx],
          },
        },
      });
      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "miter",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff0088",
          "line-width": 4,
        },
      });
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
        if (map.current.meinMarkers) {
          console.info(map.current.meinMarkers);
          map.current.meinMarkers.sources.forEach((m) => m.remove());
        }
        addedIds.forEach((id) => {
          try {
            map.current.removeLayer(`${id}`);
            map.current.removeLayer(`${id}-start`);
            map.current.removeLayer(`${id}-end`);
            map.current.removeSource(`${id}`);
            map.current.removeSource(`${id}-start`);
            map.current.removeSource(`${id}-end`);
          } catch (error) {}
        });
        addedIds = [];
      }
    }

    //  new mapboxgl.Marker({
    //   color: "#FFFFFF",
    //   draggable: true,
    //   offset: [0, -50 / 2],
    // })
    //   .setLngLat([lng, lat])
    //   .addTo(map.current);

    // new mapboxgl.Marker({ element: markerRef })
    //   .setLngLat([lng + 0.001, lat + 0.001])
    //   .addTo(map.current);

    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            message: "Foo",
            iconSize: [60, 60],
          },
          geometry: {
            type: "Point",
            coordinates: [-66.324462, -16.024695],
          },
        },
        {
          type: "Feature",
          properties: {
            message: "Bar",
            iconSize: [50, 50],
          },
          geometry: {
            type: "Point",
            coordinates: [-61.21582, -15.971891],
          },
        },
        {
          type: "Feature",
          properties: {
            message: "Baz",
            iconSize: [40, 40],
          },
          geometry: {
            type: "Point",
            coordinates: [-63.292236, -18.281518],
          },
        },
      ],
    };

    const featus = map.current.queryRenderedFeatures();

    const obj = {};
    const set = new Set();
    featus.forEach((f) => {
      const keys = Object.keys(f);
      keys.forEach((k) => set.add(k));
      if (obj[f.sourceLayer]) {
        obj[f.sourceLayer]++;
      } else {
        obj[f.sourceLayer] = 1;
      }
    });
    console.info(obj);
    console.info(set);

    // Create a DOM element for each marker.
    // const el = document.createElement("div");
    // const width = 30;
    // const height = 30;
    // el.className = "marker";
    // el.style.backgroundImage = `url(${markerSvg})`;
    // el.style.width = `${width}px`;
    // el.style.height = `${height}px`;
    // el.style.backgroundSize = "100%";

    // // Add markers to the map.
    // new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map.current);
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
      <img alt="asdf" sx={{ height: 20, width: 20 }} src={redMarkerSvg} />

      <button onClick={swapData}>Do Stuff</button>
      <main>
        <div
          style={{ height: "80vh", width: "85vw" }}
          ref={mapContainer}
          className="map-container"
        ></div>
      </main>
    </MyBox>
  );
};

Segments.propTypes = {
  prop: PropTypes.string,
};

export default Segments;
