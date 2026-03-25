import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import SegmentMap from "./SegmentMap";

import { ApiGet } from "api/api";

import { surfaceList } from "utils/constants";
import AppContext from "AppContext";

import { SURFACE } from "utils/constants";

import type { Segment } from "@/types/db/Segment";

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
const MapBox = styled(Box)(() => ({
  height: "30vh",
  width: "calc(100%)",
}));

const columns = [
  {
    field: "name",
    headerName: "Segment",
    flex: 4,
    renderCell: (props: GridRenderCellParams) => {
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
  const [tabVal, setTabVal] = useState(SURFACE.all);
  const [allSegments, setAllSegments] = useState<Segment[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);

  const [loading, setLoading] = useState(true);

  const { year } = React.useContext(AppContext);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabVal(newValue);
  };

  const onLoad = React.useCallback((data: Segment[]) => {
    setAllSegments(data);
    setLoading(false);

    const noRoad = !data.some((x) => x.surfaceType === SURFACE.road);
    const noGravel = !data.some((x) => x.surfaceType === SURFACE.gravel);

    if (noRoad && !noGravel) {
      setTabVal(SURFACE.gravel);
    } else if (noRoad && noGravel) {
      setTabVal(SURFACE.trail);
    }
  }, []);

  React.useEffect(() => {
    ApiGet(`api/segments/?year=${year}`, onLoad);
  }, [onLoad, year]);

  const roadCount = allSegments.filter(
    (s) => s.surfaceType === SURFACE.road,
  ).length;
  const gravelCount = allSegments.filter(
    (s) => s.surfaceType === SURFACE.gravel,
  ).length;
  const trailCount = allSegments.filter(
    (s) => s.surfaceType === SURFACE.trail,
  ).length;
  const allCount = allSegments.length;

  React.useEffect(() => {
    let filterFunc: (s: Segment) => boolean;
    if (surfaceList.includes(tabVal) === false)
      throw new Error("Invalid surface type");
    if (tabVal === SURFACE.all) {
      filterFunc = () => true;
    } else {
      filterFunc = (s) => s.surfaceType === tabVal;
    }
    const filteredSegments = allSegments.filter(filterFunc);
    setSegments(filteredSegments);
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
        variant="scrollable"
      >
        <Tab label={`Show All (${allCount})`} value={SURFACE.all} />
        <Tab label={`Road (${roadCount})`} value={SURFACE.road} />
        <Tab label={`Gravel (${gravelCount})`} value={SURFACE.gravel} />
        <Tab label={`Trail Run (${trailCount})`} value={SURFACE.trail} />
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

export default Segments;
