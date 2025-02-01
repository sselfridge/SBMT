import React from "react";
import PropTypes from "prop-types";
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

const SbmtTitle = (props) => {
  const { children } = props;
  return <SbmtBox>{children ? children : "SBMT"}</SbmtBox>;
};

SbmtTitle.propTypes = {
  children: PropTypes.node,
};

export default SbmtTitle;
