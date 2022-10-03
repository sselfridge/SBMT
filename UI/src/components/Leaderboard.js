import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Filters from "./Filters";

import { ALL_COLUMNS, MOBILE_COLUMNS } from "utils/constants";
import { formattedTime } from "utils/helperFuncs";

const MyBox = styled(Box)(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.paper,
    padding: 8,
    borderRadius: 4,
  };
});

const rows = [
  {
    id: 12,
    athlete: "Sam Smith SmithSmithSmith",
    rank: "1",
    completed: 4,
    totalTime: 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 22,
    athlete: "Bob Smith",
    rank: "2",
    completed: 4,
    totalTime: 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 33,
    athlete: "Nigel Pond",
    rank: "3",
    completed: 4,
    totalTime: 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 44,
    athlete: "Hugh Rant",
    rank: "4",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 54,
    athlete: "Hugh Rant",
    rank: "5",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 62,
    athlete: "Bob Smith",
    rank: "6",
    completed: 4,
    totalTime: 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 73,
    athlete: "Nigel Pond",
    rank: "7",
    completed: 4,
    totalTime: 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 84,
    athlete: "Hugh Hugh Hugh Hugh Rant",
    rank: "8",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 92,
    athlete: "Bob Smith",
    rank: "9",
    completed: 4,
    totalTime: 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 103,
    athlete: "Nigel Pond",
    rank: "10",
    completed: 4,
    totalTime: 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 114,
    athlete: "Hugh Rant",
    rank: "11",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 122,
    athlete: "Bob Smith",
    rank: "12",
    completed: 4,
    totalTime: 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 133,
    athlete: "Nigel Pond",
    rank: "13",
    completed: 4,
    totalTime: 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 144,
    athlete: "Hugh Rant",
    rank: "14",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 152,
    athlete: "Bob Smith",
    rank: "15",
    completed: 4,
    totalTime: 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 163,
    athlete: "Nigel Pond",
    rank: "16",
    completed: 4,
    totalTime: 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 174,
    athlete: "Hugh Rant",
    rank: "17",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 182,
    athlete: "Bob Smith",
    rank: "18",
    completed: 4,
    totalTime: 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 193,
    athlete: "Nigel Pond",
    rank: "19",
    completed: 4,
    totalTime: 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 204,
    athlete: "Hugh Rant",
    rank: "20",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 212,
    athlete: "Bob Smith",
    rank: "21",
    completed: 4,
    totalTime: 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 223,
    athlete: "Nigel Pond",
    rank: "22",
    completed: 4,
    totalTime: 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 234,
    athlete: "Hugh Rant",
    rank: "23",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 242,
    athlete: "Bob Smith",
    rank: "24",
    completed: 4,
    totalTime: 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 253,
    athlete: "Nigel Pond",
    rank: "25",
    completed: 4,
    totalTime: 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
  {
    id: 264,
    athlete: "Hugh Rant",
    rank: "26",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
    distance: 333,
    elevation: 34189,
  },
];

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
    field: "distance",
    sortable: false,
    headerName: "Distance Total",
    headerAlign: "right",
    align: "right",
  },
  {
    field: "elevation",
    sortable: false,
    headerName: "Elevation Total",
    headerAlign: "right",
    align: "right",
    flex: 25,
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

const onApplyFilters = (filters) => {};

const Leaderboard = (props) => {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));

  const [columnVisible, setColumnVisible] = React.useState(ALL_COLUMNS);
  React.useEffect(() => {
    const newColumns = isMobile ? MOBILE_COLUMNS : ALL_COLUMNS;
    setColumnVisible(newColumns);
  }, [isMobile]);

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
          initialState={{
            sorting: {
              sortModel: [{ field: "rank", sort: "desc" }],
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
      </Paper>
    </MyBox>
  );
};

Leaderboard.propTypes = {
  prop: PropTypes.string,
};

export default Leaderboard;
