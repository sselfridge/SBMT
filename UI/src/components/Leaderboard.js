import React, { useState } from "react";
import PropTypes from "prop-types";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Filters from "./Filters";

import { ALL_COLUMNS, MOBILE_COLUMNS } from "utils/constants";
import { formattedTime, metersToMiles, metersToFeet } from "utils/helperFuncs";
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
    marginRight: 8,
  },
}));

const LEADERBOARD_URL = "/api/leaderboard";

const columns = [
  {
    flex: 8,
    field: "rank",
    sortable: false,
    headerName: "Rank",
  },
  {
    flex: 35,
    field: "athlete",
    sortable: false,
    headerName: "Athlete",

    renderCell: (props) => {
      const { row } = props;
      const { athleteName, avatar } = row;
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <AvatarBox>
            <img alt="avatar" src={avatar} />
          </AvatarBox>
          <Typography>{athleteName}</Typography>
        </Box>
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
    flex: 5,
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
    flex: 30,
    valueGetter: ({ row }) => row.totalTime,
    renderCell: (props) => {
      const { value } = props;
      return formattedTime(value, true);
    },
  },
];

const Leaderboard = (props) => {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));

  const [columnVisible, setColumnVisible] = React.useState(ALL_COLUMNS);
  React.useEffect(() => {
    const newColumns = isMobile ? MOBILE_COLUMNS : ALL_COLUMNS;
    setColumnVisible(newColumns);
  }, [isMobile]);

  const [rows, setRows] = useState([]);

  React.useEffect(() => {
    ApiGet(LEADERBOARD_URL, setRows);
  }, []);

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
    <MyBox sx={{ height: "95vh", width: "95vw", maxWidth: 1000 }}>
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
          }}
        />
      </Paper>
    </MyBox>
  );
};

Leaderboard.propTypes = {
  prop: PropTypes.string,
};

export default Leaderboard;
