import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Filters from "./Filters";

import { ALL_COLUMNS, MOBILE_COLUMNS } from "utils/constants";
import { formattedTime, metersToMiles, metersToFeet } from "utils/helperFuncs";
import { ApiGet } from "api/api";
import { Link, useSearchParams } from "react-router-dom";

import LeaderboardAthleteCell from "./LeaderboardAthleteCell";
import AppContext from "AppContext";

const MainBox = styled(Box)(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.paper,
    padding: 8,
    borderRadius: 4,
    height: "90vh",
    width: "95vw",
    maxWidth: 1000,
    overflow: "auto",
  };
});

const LEADERBOARD_URL = "/api/leaderboard";

const Leaderboard = () => {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));

  const [searchParams, setSearchParams] = useSearchParams();

  const [columnVisible, setColumnVisible] = React.useState(ALL_COLUMNS);
  const [loading, setLoading] = useState(true);

  const { year } = React.useContext(AppContext);

  React.useEffect(() => {
    setSearchParams((currParams) => {
      currParams.set("year", year);
      return currParams;
    });
  }, [setSearchParams, year]);

  React.useEffect(() => {
    const newColumns = isMobile ? MOBILE_COLUMNS : ALL_COLUMNS;
    setColumnVisible(newColumns);
  }, [isMobile]);

  const [rows, setRows] = useState([]);

  const onLoad = React.useCallback((data) => {
    setRows(data);
    setLoading(false);
  }, []);

  const onApplyFilters = React.useCallback(
    (filters) => {
      setSearchParams((params) => {
        const simpleFilters = [
          "surface",
          "gender",
          "age",
          "category",
          "distance",
          "elevation",
        ];

        simpleFilters.forEach((name) => {
          if (filters?.[name] && filters[name] !== "ALL") {
            params.set(name, filters[name]);
          } else {
            params.delete(name);
          }
        });

        if (filters?.club !== "0") {
          params.set("club", filters.club);
        } else {
          params.delete("club");
        }

        // setSearchParams(params);
        let url = LEADERBOARD_URL + "/?" + params.toString();

        ApiGet(url, onLoad);
        return params;
      });
    },
    [onLoad, setSearchParams]
  );

  const columns = useMemo(
    () => [
      {
        minWidth: 40,
        flex: 4,
        field: "rank",
        sortable: false,
        headerName: "",
      },
      {
        flex: 35,
        field: "athlete",
        sortable: false,
        headerName: "Athlete",

        renderCell: LeaderboardAthleteCell,
      },
      {
        flex: 13,
        field: "completedDesktop",
        sortable: false,
        headerName: "Completed",
        align: "right",
        // valueGetter: ({ row }) => `${row.completed}`,
        renderCell: (cell) => {
          const { row } = cell;
          const { completed, segmentCount } = row;

          const completedTotalPercent = Math.floor(
            (completed / segmentCount) * 100
          );

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                flexDirection: "column",
                flexGrow: 50,
              }}
            >
              {completed}
              <Box sx={{ display: "flex", width: "100%" }}>
                <Box
                  sx={{
                    width: `${completedTotalPercent}%`,
                    backgroundColor: "secondary.main",
                    height: "5px",
                  }}
                />
                <Box
                  sx={{
                    width: `${100 - completedTotalPercent}%`,
                    backgroundColor: "primary.main",
                    height: "5px",
                  }}
                />
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 8,
        minWidth: 30,
        field: "completedMobile",
        sortable: false,
        headerName: "#",
        headerAlign: "right",
        align: "right",
        renderCell: (cell) => {
          const { row } = cell;
          const { completed, segmentCount } = row;

          const completedTotalPercent = Math.floor(
            (completed / segmentCount) * 100
          );

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                flexGrow: 50,
              }}
            >
              <Box>{completed}</Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  height: "40px",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: `5px`,
                    backgroundColor: "primary.main",
                    height: `${100 - completedTotalPercent}%`,
                  }}
                />
                <Box
                  sx={{
                    width: "5px",
                    backgroundColor: "secondary.main",
                    height: `${completedTotalPercent}%`,
                  }}
                />
              </Box>
            </Box>
          );
        },
      },
      {
        flex: 25,
        field: "totalDistance",
        sortable: false,
        headerName: "Distance Total",
        headerAlign: "right",
        align: "right",
        renderCell: ({ value }) => `${metersToMiles(value)} mi`,
      },
      {
        field: "totalElevation",
        sortable: false,
        headerName: "Elevation Total",
        headerAlign: "right",
        align: "right",
        flex: 25,
        renderCell: ({ value }) => `${metersToFeet(value)} ft`,
      },
      {
        field: "totalTimeDesktop",
        sortable: false,
        headerName: "Total Time",
        align: "center",
        headerAlign: "center",
        flex: 30,
        valueGetter: ({ row }) => row.totalTime,
        renderCell: (cell) => {
          const { value } = cell;
          return formattedTime(value);
        },
      },
      {
        field: "totalTimeMobile",
        sortable: false,
        headerName: "Total Time",
        align: "right",
        headerAlign: "right",
        flex: 18,
        valueGetter: ({ row }) => row.totalTime,
        renderCell: (cell) => {
          const { value } = cell;
          return formattedTime(value, true);
        },
      },
    ],
    []
  );

  return (
    <MainBox sx={{}}>
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          boxShadow: "none",
          overflow: "scroll",
        }}
      >
        <Filters onApplyFilters={onApplyFilters} searchParams={searchParams} />
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          disableColumnMenu
          hideFooter={true}
          columnVisibilityModel={columnVisible}
          localeText={{ noRowsLabel: "The leaderboard is empty...for now" }}
          initialState={
            {
              //need to sort by 2 fields, only supported by MDG pro so handling sort on server
              //sorting: {sortModel: [{ field: "rank", sort: "asc" }],},
            }
          }
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
            // maxHeight: "85vh",
          }}
        />
        <Paper sx={{ fontSize: ".8em" }}>
          <Link to="../recent">
            <Button sx={{ mb: 3 }}>View Recent Efforts</Button>
          </Link>
          <Typography variant="h4">Current Leaderboard Rules</Typography>
          <ul>
            <li>
              All efforts on{" "}
              <Link style={{ margin: "4px 0" }} to="/segments">
                {" "}
                SBMT segments{" "}
              </Link>{" "}
              from Friday May 24th onward
            </li>
            <li>
              Ranking is based first on total segments completed and second on
              lowest total time.
            </li>
            <li>Each segment only counts once, lowest total time is taken</li>
            <li>Sub-leaderboards based on segment surface + gender</li>
          </ul>
        </Paper>
      </Paper>
    </MainBox>
  );
};

Leaderboard.propTypes = {
  prop: PropTypes.string,
};

export default Leaderboard;
