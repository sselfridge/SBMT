import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const SbmtBox = styled(Box)(({ theme }) => ({
  fontFamily: "coordinates, monospace",
  letterSpacing: "-1px",
  fontWeight: "800",
  fontSize: "45px",
  flexGrow: "1",
  display: "inline",
}));

interface SbmtTitleProps {
  children?: React.ReactNode;
}

const SbmtTitle: React.FC<SbmtTitleProps> = ({ children }) => {
  return <SbmtBox>{children ? children : "SBMT"}</SbmtBox>;
};

export default SbmtTitle;
