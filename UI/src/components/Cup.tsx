import React from "react";
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

interface CupProps {
  rank: number;
}

const Cup = (props: CupProps) => {
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

export default Cup;
