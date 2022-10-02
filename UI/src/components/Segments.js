import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import SegmentMap from "./SegmentMap";

import segments from "mockData/segments";

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
    headerName: "Segment Name",
    flex: 4,
    renderCell: (props) => {
      const { value, id } = props;
      return <Link to={`${id}`}>{value}</Link>;
    },
  },
  {
    field: "effort_count",
    headerName: "Attempts",
    flex: 2,
    renderCell: (props) => {
      return props.value;
    },
  },
];
console.info("segments: ", segments);

const Segments = (props) => {
  const { prop } = props;
  return (
    <MyBox>
      <MapBox>
        <SegmentMap segments={segments} />
      </MapBox>

      <DataGrid
        rows={segments}
        columns={columns}
        hideFooter={true}
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
  prop: PropTypes.string,
};

export default Segments;
