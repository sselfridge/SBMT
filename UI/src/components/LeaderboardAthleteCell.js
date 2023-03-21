import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper, Box, CardHeader, Avatar, Popover } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const TooltipRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  "& > span:first-of-type": {
    paddingRight: 12,
  },
}));

const LeaderboardAthleteCell = (props) => {
  const { row } = props;
  const { athleteName, avatar, id, recentDistance, recentElevation, category } =
    row;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          cursor: "pointer",
        }}
      >
        <Avatar src={avatar} />
        {athleteName}
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 1 }}>
          <TooltipRow>
            <span>Recent Distance:</span>
            <span>{recentDistance} mi / wk</span>
          </TooltipRow>
          <TooltipRow>
            <span>Recent Elevation:</span>
            <span>{recentElevation} ft / wk</span>
          </TooltipRow>
          <TooltipRow>
            <span>Category:</span>
            <span>{category}</span>
          </TooltipRow>
          <Link
            style={{ fontSize: "1.1em", width: "100%" }}
            to={`/athletes/${id}`}
          >
            View Profile
          </Link>
        </Box>
      </Popover>
    </React.Fragment>
    // </Link>
  );
};

LeaderboardAthleteCell.propTypes = {
  prop: PropTypes.object,
};

export default LeaderboardAthleteCell;
