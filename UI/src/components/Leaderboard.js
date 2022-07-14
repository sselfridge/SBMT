import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Link } from "react-router-dom";

const MyBox = styled(Box)(({ theme }) => {
  return {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: 8,
    borderRadius: 4,
  };
});

const NEWCOMP = (props) => {
  const { prop } = props;
  console.info("props: ", props);
  return (
    <MyBox>
      content
      <br />
      <Link to="/invoices">Invoices</Link> |{" "}
      <Link to="/expenses">Expenses</Link>|{" "}
      <Link to="/invoices/expenses">Invoice Expenses</Link>
    </MyBox>
  );
};

NEWCOMP.propTypes = {
  prop: PropTypes.string,
};

export default NEWCOMP;
