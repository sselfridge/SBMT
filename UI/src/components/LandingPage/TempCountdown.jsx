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
    <Box
      sx={{
        height: "80%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MyPaper
        sx={{
          height: "300px",
          width: "80%",
          maxWidth: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>{banner} live in:</Box>
        <Countdown />
      </MyPaper>
    </Box>
  );
};

TempCountdown.defaultProps = {
  banner: "SBMT",
};

TempCountdown.propTypes = {
  banner: PropTypes.string,
};

export default TempCountdown;
