import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import SegmentMap from "./SegmentMap";

import { segments } from "mockData/data";

const MyBox = styled(Box)(({ theme }) => ({
  height: "80vh",
  width: "95vw",
  padding: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  flexDirection: "column",
}));

const rows = [
  { id: 4, name: "Painted Cave", time: 0, attempts: 15 },
  { id: 3, name: "OSM", time: 3400, attempts: 25 },
  { id: 1, name: "Gibraltar", time: 1234, attempts: 35 },
  { id: 2, name: "Arroyo Burro", time: 2345, attempts: 5 },
];

const columns = [
  {
    field: "name",
    headerName: "Name",
    width: 200,
    renderCell: (props) => {
      const { value, id } = props;
      return <Link to={`${id}`}>{value}</Link>;
    },
  },
  { field: "time", headerName: "Time", width: 100 },
  {
    field: "attempts",
    headerName: "Attempts",
    width: 100,
    renderCell: (props) => {
      return props.value;
    },
  },
];

const Segments = (props) => {
  const { prop } = props;
  return (
    <MyBox>
      <SegmentMap segments={segments} />
      <DataGrid
        rows={rows}
        columns={columns}
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
