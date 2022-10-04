import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { addSegmentToMap, getBounds } from "utils/mapUtils";

import keys from "config";

mapboxgl.accessToken = keys.mapBox;

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

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
      zoom: 1.0,
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

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    // map.on("mouseenter", "places", (e) => {
    //   // Change the cursor style as a UI indicator.
    //   map.getCanvas().style.cursor = "pointer";

    //   // Copy coordinates array.
    //   const coordinates = e.features[0].geometry.coordinates.slice();
    //   const description = e.features[0].properties.description;

    //   // Ensure that if the map is zoomed out such that multiple
    //   // copies of the feature are visible, the popup appears
    //   // over the copy being pointed to.
    //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    //   }

    //   // Populate the popup and set its coordinates
    //   // based on the feature found.
    //   popup.setLngLat(coordinates).setHTML(description).addTo(map);
    // });

    // map.on("mouseleave", "places", () => {
    //   map.getCanvas().style.cursor = "";
    //   popup.remove();
    // });

    setMap(newMap);
  }, []);

  useEffect(() => {
    const startMarkers = [];
    if (isLoaded) {
      segments.forEach((seg) => addSegmentToMap(map, seg, startMarkers));
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
  // prop: PropTypes.array.isRequired,
};

export default SegmentMap;
