import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { intervalToDuration, format, addSeconds } from "date-fns";

import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Filters from "./Filters";

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
  },
  {
    id: 22,
    athlete: "Bob Smith",
    rank: "2",
    completed: 4,
    totalTime: 1542,
  },
  {
    id: 33,
    athlete: "Nigel Pond",
    rank: "3",
    completed: 4,
    totalTime: 1542 + 1542,
  },
  {
    id: 44,
    athlete: "Hugh Rant",
    rank: "4",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
  },
  {
    id: 54,
    athlete: "Hugh Rant",
    rank: "5",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
  },
  {
    id: 62,
    athlete: "Bob Smith",
    rank: "6",
    completed: 4,
    totalTime: 1542,
  },
  {
    id: 73,
    athlete: "Nigel Pond",
    rank: "7",
    completed: 4,
    totalTime: 1542 + 1542,
  },
  {
    id: 84,
    athlete: "Hugh Hugh Hugh Hugh Rant",
    rank: "8",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
  },
  {
    id: 92,
    athlete: "Bob Smith",
    rank: "9",
    completed: 4,
    totalTime: 1542,
  },
  {
    id: 103,
    athlete: "Nigel Pond",
    rank: "10",
    completed: 4,
    totalTime: 1542 + 1542,
  },
  {
    id: 114,
    athlete: "Hugh Rant",
    rank: "11",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
  },
  {
    id: 122,
    athlete: "Bob Smith",
    rank: "12",
    completed: 4,
    totalTime: 1542,
  },
  {
    id: 133,
    athlete: "Nigel Pond",
    rank: "13",
    completed: 4,
    totalTime: 1542 + 1542,
  },
  {
    id: 144,
    athlete: "Hugh Rant",
    rank: "14",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
  },
  {
    id: 152,
    athlete: "Bob Smith",
    rank: "15",
    completed: 4,
    totalTime: 1542,
  },
  {
    id: 163,
    athlete: "Nigel Pond",
    rank: "16",
    completed: 4,
    totalTime: 1542 + 1542,
  },
  {
    id: 174,
    athlete: "Hugh Rant",
    rank: "17",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
  },
  {
    id: 182,
    athlete: "Bob Smith",
    rank: "18",
    completed: 4,
    totalTime: 1542,
  },
  {
    id: 193,
    athlete: "Nigel Pond",
    rank: "19",
    completed: 4,
    totalTime: 1542 + 1542,
  },
  {
    id: 204,
    athlete: "Hugh Rant",
    rank: "20",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
  },
  {
    id: 212,
    athlete: "Bob Smith",
    rank: "21",
    completed: 4,
    totalTime: 1542,
  },
  {
    id: 223,
    athlete: "Nigel Pond",
    rank: "22",
    completed: 4,
    totalTime: 1542 + 1542,
  },
  {
    id: 234,
    athlete: "Hugh Rant",
    rank: "23",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
  },
  {
    id: 242,
    athlete: "Bob Smith",
    rank: "24",
    completed: 4,
    totalTime: 1542,
  },
  {
    id: 253,
    athlete: "Nigel Pond",
    rank: "25",
    completed: 4,
    totalTime: 1542 + 1542,
  },
  {
    id: 264,
    athlete: "Hugh Rant",
    rank: "26",
    completed: 3,
    totalTime: 1542 + 1542 + 1542,
  },
];

function formattedTime(seconds) {
  var helperDate = addSeconds(new Date(0), seconds);
  return format(helperDate, "hh:mm:ss");
}

const columns = [
  { field: "rank", sortable: false, headerName: "Rank", width: 55 },
  {
    field: "athlete",
    sortable: false,
    headerName: "Athlete",
    width: 100,
    maxWidth: 150,
  },
  {
    field: "completed",
    sortable: false,
    headerName: "Completed",
    width: 150,
  },
  {
    field: "distance",
    sortable: false,
    headerName: "Distance",
    width: 150,
  },
  {
    field: "elevation",
    sortable: false,
    headerName: "Elevation",
    width: 150,
  },
  {
    field: "totalTime",
    sortable: false,
    headerName: "Total Time",
    width: 90,

    renderCell: (props) => {
      const { value } = props;
      return formattedTime(value);
    },
  },
];

const handleApplyClick = (settings) => {
  console.info("apply", settings);
};

const Leaderboard = (props) => {
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
        <Filters
          onApply={handleApplyClick}
          // size={size}
          // type={type}
          // theme={getActiveTheme()}
        />
        <DataGrid
          rows={rows}
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

Leaderboard.propTypes = {
  prop: PropTypes.string,
};

export default Leaderboard;
