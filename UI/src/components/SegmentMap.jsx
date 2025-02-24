import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import {
  addSegmentToMap,
  addSegmentPopupToMap,
  getBounds,
} from "utils/mapUtils";

import config from "config";

mapboxgl.accessToken = config.mapBox;

const SegmentMap = (props) => {
  const { segments } = props;

  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  //TODO - see about only doing the zoom in animation on initial load,
  //  gets kind of old going back and forth

  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-119.6769, 34.46313],
      zoom: 5.0,
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
    const startMarkers = [];
    if (isLoaded) {
      segments.forEach((seg) => {
        addSegmentToMap(map, seg, startMarkers);
        addSegmentPopupToMap(map, seg);
      });
    }

    //TODO - this doesn't look great on mobile, maybe start from all then zoom in to DT area?

    if (startMarkers.length > 0) {
      map.fitBounds(getBounds(startMarkers));
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
  }, [isLoaded, map, segments]);

  return <div style={{ height: "100%", width: "100%" }} ref={mapRef} />;
};

SegmentMap.propTypes = {
  segments: PropTypes.array.isRequired,
};

export default SegmentMap;
