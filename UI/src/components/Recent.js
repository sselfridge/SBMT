import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper, Typography } from "@mui/material";
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

const CACHE = [
  {
    id: 2887087080316464336,
    name: "Sam  Wise | LG",
    athleteId: 1075670,
    avatar:
      "https://dgalywyr863hv.cloudfront.net/pictures/athletes/1075670/948003/4/medium.jpg",
    activityId: 6156488864,
    created: "2022-09-27T03:06:27.743006Z",
    elapsedTime: 2276,
    segmentId: 658277,
    segmentName: "Gibraltar Climb",
    surfaceType: "road",
  },
  {
    id: 2887087080313862352,
    name: "Sam  Wise | LG",
    athleteId: 1075670,
    avatar:
      "https://dgalywyr863hv.cloudfront.net/pictures/athletes/1075670/948003/4/medium.jpg",
    activityId: 6156488864,
    created: "2022-09-27T03:06:27.742971Z",
    elapsedTime: 432,
    segmentId: 881465,
    segmentName: "Ladera Lane",
    surfaceType: "road",
  },
  {
    id: 2999914709367658400,
    name: "Sam  Wise | LG",
    athleteId: 1075670,
    avatar:
      "https://dgalywyr863hv.cloudfront.net/pictures/athletes/1075670/948003/4/medium.jpg",
    activityId: 7729059578,
    created: "0001-01-01T00:00:00",
    elapsedTime: 1533,
    segmentId: 1290381,
    segmentName: "Official Old San Marcos Pass",
    surfaceType: "road",
  },
  {
    id: 2999914709365410720,
    name: "Sam  Wise | LG",
    athleteId: 1075670,
    avatar:
      "https://dgalywyr863hv.cloudfront.net/pictures/athletes/1075670/948003/4/medium.jpg",
    activityId: 7729059578,
    created: "0001-01-01T00:00:00",
    elapsedTime: 1334,
    segmentId: 813814,
    segmentName: "Arroyo Burro to almost La Cumbre Peak",
    surfaceType: "road",
  },
  {
    id: 2999914709365022624,
    name: "Sam  Wise | LG",
    athleteId: 1075670,
    avatar:
      "https://dgalywyr863hv.cloudfront.net/pictures/athletes/1075670/948003/4/medium.jpg",
    activityId: 7729059578,
    created: "0001-01-01T00:00:00",
    elapsedTime: 1839,
    segmentId: 637362,
    segmentName: "Painted Cave",
    surfaceType: "road",
  },
];

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
];

const Recent = (props) => {
  const [recentEfforts, setRecentEfforts] = useState([]);

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
    <MyBox sx={{ height: "80vh", width: "95vw", maxWidth: 1000 }}>
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          boxShadow: "none",
          overflow: "scroll",
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
