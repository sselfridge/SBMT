import React, { useState } from "react";
// import PropTypes from "prop-types";
import { Box, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import SegmentMap from "./SegmentMap";

import SEGMENTS from "mockData/segments";
import { ApiGet } from "api/api";

import { surfaceList } from "utils/constants";
import AppContext from "AppContext";

const MyBox = styled(Box)(({ theme }) => ({
  height: "90vh",
  width: "95vw",
  maxWidth: "1000px",
  padding: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  flexDirection: "column",
}));
const MapBox = styled(Box)(({ theme }) => ({
  height: "30vh",
  width: "calc(100%)",
}));

const columns = [
  {
    field: "name",
    headerName: "Segment",
    flex: 4,
    renderCell: (props) => {
      const { value, id } = props;
      return <Link to={`${id}`}>{value}</Link>;
    },
  },
  // {
  //   field: "effort_count",
  //   headerName: "Attempts",
  //   flex: 2,
  //   renderCell: (props) => {
  //     return props.value;
  //   },
  // },
];

const Segments = () => {
  const [tabVal, setTabVal] = useState("road");
  const [allSegments, setAllSegments] = useState([]);
  const [segments, setSegments] = useState(SEGMENTS);

  const [loading, setLoading] = useState(true);

  const { year } = React.useContext(AppContext);

  const handleTabChange = (event, newValue) => {
    setTabVal(newValue);
  };

  const onLoad = React.useCallback((data) => {
    setAllSegments(data);
    setLoading(false);

    const noRoad = !data.some((x) => x.surfaceType === "road");
    const noGravel = !data.some((x) => x.surfaceType === "gravel");

    if (noRoad && !noGravel) {
      setTabVal("gravel");
    } else if (noRoad && noGravel) {
      setTabVal("trail");
    }
  }, []);

  React.useEffect(() => {
    ApiGet(`api/segments/?year=${year}`, onLoad);
  }, [onLoad, year]);

  React.useEffect(() => {
    let filterFunc;
    if (surfaceList.includes(tabVal) === false)
      throw new Error("Invalid surface type");
    if (tabVal === "ALL") {
      filterFunc = () => true;
    } else {
      filterFunc = (s) => s.surfaceType === tabVal;
    }

    setSegments((seg) => allSegments.filter(filterFunc));
    return () => {};
  }, [allSegments, tabVal]);

  return (
    <MyBox>
      <MapBox>
        <SegmentMap segments={segments} />
      </MapBox>
      <Tabs
        value={tabVal}
        onChange={handleTabChange}
        aria-label="nav tabs example"
      >
        <Tab label="Road" value={"road"} />
        <Tab label="Gravel" value={"gravel"} />
        <Tab label="Trail Run" value={"trail"} />
        <Tab label="Show All" value={"ALL"} />
      </Tabs>
      <DataGrid
        rows={segments}
        loading={loading}
        columns={columns}
        hideFooter={true}
        initialState={{
          sorting: {
            sortModel: [{ field: "name", sort: "asc" }],
          },
        }}
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: "primary.light",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
      />
    </MyBox>
  );
};

Segments.propTypes = {
  // prop: PropTypes.string,
};

export default Segments;
