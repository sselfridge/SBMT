import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Filters from "./Filters";

import { formattedTime } from "utils/helperFuncs";

import Api from "api/api";

const MyBox = styled(Box)(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.paper,
    padding: 8,
    borderRadius: 4,
  };
});

const AvatarBox = styled(Box)(({ theme }) => ({
  "& img": {
    borderRadius: 25,
    width: 35,
  },
}));

const columns = [
  {
    field: "avatar",
    sortable: false,
    headerName: "",
    width: 55,
    renderCell: ({ value }) => (
      <AvatarBox>
        <img alt="avatar" src={value} />
      </AvatarBox>
    ),
    // flex: 1,
  },
  {
    field: "name",
    sortable: false,
    headerName: "Name",
    width: 200,
    // maxWidth: 150,
    flex: 1,
  },
  {
    field: "segmentId",
    sortable: false,
    headerName: "Segment",
    // width: 150,
    renderCell: ({ value }) => (
      <a href={`https://www.strava.com/segments/${value}`}>Segment</a>
    ),
    flex: 1,
  },
  {
    field: "elapsedTime",
    sortable: false,
    headerName: "Time",
    width: 75,
    renderCell: ({ value }) => formattedTime(value),
    flex: 1,
  },
  {
    field: "activityId",
    sortable: false,
    headerName: "Activity",
    width: 90,

    renderCell: ({ value }) => (
      <a href={`https://www.strava.com/activities/${value}`}>Activity</a>
    ),
    flex: 1,
  },
];

const Recent = (props) => {
  const [recentEfforts, setRecentEfforts] = useState([]);
  console.info("recentEfforts: ", recentEfforts);

  React.useEffect(() => {
    Api.get("/api/recentEfforts")
      .then((response) => {
        if (response.status === 200) setRecentEfforts(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <MyBox sx={{ height: "90vh", width: "95vw", maxWidth: 1000 }}>
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          boxShadow: "none",
          overflow: "scroll",
        }}
      >
        <DataGrid
          rows={recentEfforts}
          columns={columns}
          disableColumnMenu
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
      </Paper>
    </MyBox>
  );
};

Recent.propTypes = {
  prop: PropTypes.string,
};

export default Recent;
