import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const MyBox = styled(Box)(({ theme }) => {
  console.info("theme: ", theme);

  return {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: 8,
    borderRadius: 4,
  };
});

const NEWCOMP = (props) => {
  const { prop } = props;
  return <MyBox>content</MyBox>;
};

NEWCOMP.propTypes = {
  prop: PropTypes.string,
};

export default NEWCOMP;
