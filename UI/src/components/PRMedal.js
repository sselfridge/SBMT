import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "@mui/material";

import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";

const COLOR_MAP = {
  1: { color: "strava.gold", label: "PR" },
  2: { color: "strava.silver", label: "2nd fastest time" },
  3: { color: "strava.bronze", label: "3rd fastest time" },
};

const Cup = (props) => {
  const { rank } = props;

  if (!rank) return null;

  return (
    <Tooltip arrow title={`${COLOR_MAP[rank].label} on this segment`}>
      <MilitaryTechIcon
        sx={{ height: 35, width: 35, color: COLOR_MAP[rank].color }}
      />
    </Tooltip>
  );
};

Cup.propTypes = {
  rank: PropTypes.oneOf([0, 1, 2, 3]),
};

export default Cup;
