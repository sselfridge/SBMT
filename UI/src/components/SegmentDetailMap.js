import React, { useState, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { addSegmentToMap, getBounds, getGeometry } from "utils/mapUtils";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const SegmentDetailMap = (props) => {
  const { segment } = props;
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (map) return; // initialize map only once
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-119.6769, 34.46313],
      zoom: 11,
    });
    newMap.meinMarkers = {
      markers: [],
      layers: [],
      sources: [],
    };
    newMap.on("load", () => {
      setIsLoaded(true);
    });
    setMap(newMap);
  }, [map]);

  useEffect(() => {
    if (_.isEmpty(segment) === false && isLoaded) {
      addSegmentToMap(map, segment);
      // const bounds = getBounds(
      //   [
      //     segment?.startLatlng.slice().reverse(),
      //     segment?.endLatlng.slice().reverse(),
      //   ],
      //   0.003
      // );
      const geo = getGeometry(segment);
      if (geo.coordinates) {
        map.fitBounds(getBounds(geo.coordinates, 0.003));
      }
    }

    return () => {
      if (map?.meinMarkers) {
        const { markers, layers, sources } = map.meinMarkers;
        markers.forEach((m) => m.remove());
        map.meinMarkers.markers = [];
        layers.forEach((l) => map.removeLayer(l));
        map.meinMarkers.layers = [];
        sources.forEach((s) => map.removeSource(s));
        map.meinMarkers.sources = [];
      }
    };
  }, [isLoaded, map, segment]);

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      ref={mapContainer}
      className="map-container"
    ></div>
  );
};

SegmentDetailMap.propTypes = {
  prop: PropTypes.string,
};

export default SegmentDetailMap;
