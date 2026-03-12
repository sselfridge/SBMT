import React from "react";
import { Paper, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import Countdown from "./Countdown";

const MyPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

interface TempCountdownProps {
  banner?: string;
}

const TempCountdown: React.FC<TempCountdownProps> = ({ banner = "SBMT" }) => {
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

export default TempCountdown;
