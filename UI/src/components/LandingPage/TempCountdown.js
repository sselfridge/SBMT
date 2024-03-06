import React from "react";
import PropTypes from "prop-types";
import { Paper, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import Countdown from "./Countdown";

const MyPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const TempCountdown = (props) => {
  const { banner } = props;

  return (
    <MyPaper>
      <Box>{banner} live in:</Box>
      <Countdown />
    </MyPaper>
  );
};

TempCountdown.defaultProps = {
  banner: "SBMT",
};

TempCountdown.propTypes = {
  banner: PropTypes.string,
};

export default TempCountdown;
