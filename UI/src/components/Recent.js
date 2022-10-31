import React, { useState } from "react";
import PropTypes from "prop-types";

import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper, Typography, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

import {
  formattedDate,
  formattedTime,
  formattedTimeAgo,
} from "utils/helperFuncs";

import { ApiGet } from "api/api";

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
    renderCell: ({ value: v }) => (
      <a href={`https://www.strava.com/athletes/${v.athleteId}`}>
        <AvatarBox>
          <img alt="avatar" src={v.avatar} />
        </AvatarBox>
      </a>
    ),
    valueGetter: ({ row }) => ({
      avatar: row.avatar,
      athleteId: row.athleteId,
    }),
  },
  {
    field: "name",
    sortable: false,
    headerName: "Athlete",
    width: 200,
    flex: 2,
    renderCell: ({ value }) => value,
    valueGetter: ({ row }) => (
      <a href={`https://www.strava.com/athletes/${row.athleteId}`}>
        {row.name}
      </a>
    ),
  },
  {
    field: "segmentName",
    sortable: false,
    headerName: "Segment",
    renderCell: ({ value }) => value,
    valueGetter: ({ row }) => (
      <a href={`https://www.strava.com/segments/${row.segmentId}`}>
        {row.segmentName}
      </a>
    ),

    flex: 4,
  },
  {
    field: "elapsedTime",
    sortable: false,
    headerName: "Time",
    width: 75,
    renderCell: ({ value }) => (
      <a href={`https://www.strava.com/activities/${value.id}`}>
        {formattedTime(value.time)}
      </a>
    ),
    valueGetter: ({ row }) => ({ id: row.activityId, time: row.elapsedTime }),
    flex: 1,
  },
  {
    field: "created",
    sortable: false,
    headerName: "Date Uploaded",
    flex: 1.5,
    width: 75,
    renderCell: ({ value }) => {
      const title = (
        <div>
          <section>Effort Time:</section>
          <section>{formattedDate(value.startDate)}</section>
          <section>Uploaded at:</section>
          <section>{formattedDate(value.created)}</section>
        </div>
      );

      return (
        <Tooltip arrow title={title}>
          <a href={`https://www.strava.com/activities/${value.id}`}>
            {formattedTimeAgo(value.created, { addSuffix: true })}
          </a>
        </Tooltip>
      );
    },
    valueGetter: ({ row }) => ({
      id: row.activityId,
      startDate: row.startDate,
      created: row.created,
    }),
  },
];

const Recent = (props) => {
  const [recentEfforts, setRecentEfforts] = useState([]);

  React.useEffect(() => {
    ApiGet("/api/recentEfforts", setRecentEfforts);
  }, []);

  return (
    <MyBox sx={{ width: "95vw", maxWidth: 1000 }}>
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          boxShadow: "none",
          overflow: "auto",
        }}
      >
        <Typography variant="h4">Recent Efforts</Typography>
        <DataGrid
          rows={recentEfforts}
          columns={columns}
          disableColumnMenu
          hideFooter={true}
          sx={{
            boxShadow: 2,
            border: 2,
            height: "80vh",
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
