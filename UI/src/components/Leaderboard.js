import React, { useState } from "react";
import PropTypes from "prop-types";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { DataGrid } from "@mui/x-data-grid";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Filters from "./Filters";

import { ALL_COLUMNS, MOBILE_COLUMNS } from "utils/constants";
import { formattedTime, metersToMiles, metersToFeet } from "utils/helperFuncs";
import { ApiGet } from "api/api";
import { Link } from "react-router-dom";

const MyBox = styled(Box)(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.paper,
    padding: 8,
    borderRadius: 4,
  };
});

const LEADERBOARD_URL = "/api/leaderboard";

const columns = [
  {
    minWidth: 30,
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

    renderCell: (props) => {
      const { row } = props;
      const { athleteName, avatar, id } = row;
      return (
        <Link to={`/beta/athletes/${id}`}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Avatar src={avatar} />
            <>{athleteName}</>
          </Box>
        </Link>
      );
    },
  },
  {
    flex: 13,
    field: "completedDesktop",
    sortable: false,
    headerName: "Completed",
    align: "right",
    valueGetter: ({ row }) => row.completed,
  },
  {
    flex: 4,
    minWidth: 30,
    field: "completedMobile",
    sortable: false,
    headerName: "#",
    headerAlign: "right",
    align: "right",
    valueGetter: ({ row }) => row.completed,
  },
  {
    flex: 25,
    field: "totalDistance",
    sortable: false,
    headerName: "Distance Total",
    headerAlign: "right",
    align: "right",
    renderCell: ({ value }) => metersToMiles(value),
  },
  {
    field: "totalElevation",
    sortable: false,
    headerName: "Elevation Total",
    headerAlign: "right",
    align: "right",
    flex: 25,
    renderCell: ({ value }) => metersToFeet(value),
  },
  {
    field: "totalTimeDesktop",
    sortable: false,
    headerName: "Total Time",
    align: "center",
    headerAlign: "center",
    flex: 30,
    valueGetter: ({ row }) => row.totalTime,
    renderCell: (props) => {
      const { value } = props;
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
    renderCell: (props) => {
      const { value } = props;
      return formattedTime(value, true);
    },
  },
];

const Leaderboard = () => {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));

  const [columnVisible, setColumnVisible] = React.useState(ALL_COLUMNS);

  React.useEffect(() => {
    const newColumns = isMobile ? MOBILE_COLUMNS : ALL_COLUMNS;
    setColumnVisible(newColumns);
  }, [isMobile]);

  const [rows, setRows] = useState([]);

  const onApplyFilters = React.useCallback((filters) => {
    let url = LEADERBOARD_URL + "?";
    if (filters?.surface && filters.surface !== "ALL") {
      url += `&surface=${filters.surface}`;
    }

    if (filters?.gender && filters.gender !== "ALL") {
      url += `&gender=${filters.gender}`;
    }

    ApiGet(url, setRows);
  }, []);

  return (
    <MyBox
      sx={{
        height: "90vh",
        width: "95vw",
        maxWidth: 1000,
        overflow: "auto",
      }}
    >
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          boxShadow: "none",
          overflow: "scroll",
        }}
      >
        <Filters onApplyFilters={onApplyFilters} />
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          hideFooter={true}
          columnVisibilityModel={columnVisible}
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
          <Typography variant="h4">Current Leaderboard Rules</Typography>
          <ul>
            <li>
              All efforts on{" "}
              <Link style={{ margin: "4px 0" }} to="/beta/segments">
                {" "}
                SBMT segments{" "}
              </Link>{" "}
              from Friday Oct 21st to onward
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
    </MyBox>
  );
};

Leaderboard.propTypes = {
  prop: PropTypes.string,
};

export default Leaderboard;
