import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { addSegmentToMap } from "utils/mapUtils";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const SegmentMap = (props) => {
  const { segments } = props;

  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-119.6769, 34.46313],
      zoom: 8.25,
    });
    newMap.addControl(new mapboxgl.NavigationControl());
    // newMap.scrollZoom.disable();
    newMap.meinMarkers = {
      markers: [],
      layers: [],
      sources: [],
    };
    newMap.on("load", () => {
      setIsLoaded(true);
    });

    setMap(newMap);
  }, []);

  useEffect(() => {
    console.info("map?.loaded: ", map?.loaded);
    if (isLoaded) {
      console.info("Add segments");
      console.info("segments: ", segments);
      segments.forEach((seg) => addSegmentToMap(map, seg));
    }

    return () => {
      if (map?.meinMarkers) {
        const { markers, layers, sources } = map.meinMarkers;
        console.info("clear", markers);
        console.info("clear", layers);
        console.info("clear", sources);
      }
    };
  }, [isLoaded, map, segments]);

  return <div style={{ height: "100%", width: "100%" }} ref={mapRef} />;
};

SegmentMap.propTypes = {
  prop: PropTypes.array.isRequired,
};

export default SegmentMap;
