import React, { useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Paper,
  Typography,
  Tooltip,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { isBefore } from "date-fns";

import PRMedal from "./PRMedal";
import Cup from "./Cup";

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

const Recent = () => {
  const [recentEfforts, setRecentEfforts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const columns = React.useMemo(() => {
    const COLUMNS = [
      {
        mobile: true,
        field: "avatar",
        sortable: false,
        headerName: "",
        width: 55,
        renderCell: ({ value: v }) => (
          <Link to={`/athletes/${v.athleteId}`}>
            {" "}
            <Avatar src={v?.avatar} />
          </Link>
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
        flex: 4,
        renderCell: ({ value }) => value,
        valueGetter: ({ row }) => (
          <Link to={`/athletes/${row.athleteId}`}>{row.name}</Link>
        ),
      },
      {
        mobile: true,
        field: "segmentName",
        sortable: false,
        headerName: "Segment",
        renderCell: ({ value }) => value,
        valueGetter: ({ row }) => (
          <Link to={`/segments/${row.segmentId}`}>{row.segmentName}</Link>
        ),

        flex: 4,
      },
      {
        mobile: true,
        field: "elapsedTime",
        sortable: false,
        headerName: "Time",
        width: 75,
        align: "right",
        valueGetter: ({ row }) => ({
          id: row.id,
          activityId: row.activityId,
          time: row.elapsedTime,
          prRank: row.prRank,
          rank: row.rank,
        }),
        renderCell: ({ value }) => (
          <React.Fragment>
            <PRMedal rank={value.prRank} />
            <Cup rank={value.rank} />

            <a
              href={`https://www.strava.com/activities/${value.activityId}/segments/${value.id}`}
            >
              {formattedTime(value.time)}
            </a>
          </React.Fragment>
        ),
        flex: isMobile ? 4 : 2,
      },

      {
        field: "startDate",
        sortable: false,
        headerName: "Date Ridden",
        flex: 2.5,
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
              <Box>
                {formattedTimeAgo(value.startDate, { addSuffix: true })}
              </Box>
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

    let columns = COLUMNS;
    if (isMobile) {
      columns = columns.filter((c) => c.mobile);
    }
    return columns;
  }, [isMobile]);

  const onLoad = React.useCallback((data) => {
    setRecentEfforts(data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    ApiGet("/api/recentEfforts", onLoad);
  }, [onLoad]);

  const sortedEfforts = recentEfforts.slice().sort((a, b) => {
    const aDate = new Date(a.startDate);
    const bDate = new Date(b.startDate);

    if (isBefore(aDate, bDate)) {
      return 1;
    } else {
      return -1;
    }
  });

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
          rows={sortedEfforts}
          loading={loading}
          columns={columns}
          disableColumnMenu
          hideFooter={true}
          localeText={{ noRowsLabel: "No efforts to show yet" }}
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

export default Recent;
