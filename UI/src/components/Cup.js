import React from "react";
import PropTypes from "prop-types";
import { Tooltip, Badge, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 17.5,
    top: 12,
    fontSize: 16,
    fontWeight: 700,
    backgroundColor: "transparent",
  },
}));

const Cup = (props) => {
  const { rank } = props;

  if (!rank) return <Box sx={{ width: 35, height: 35 }} />;

  return (
    <Tooltip arrow title={"SBMT Rank at time of upload"}>
      <StyledBadge badgeContent={rank} color="primary">
        <EmojiEventsIcon sx={{ height: 35, width: 35, color: "strava.gold" }} />
      </StyledBadge>
    </Tooltip>
  );
};

Cup.propTypes = {
  rank: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
};

export default Cup;
