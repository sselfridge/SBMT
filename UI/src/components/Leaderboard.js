import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Button } from "@mui/material";
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

const Leaderboard = (props) => {
  const { prop } = props;
  console.info("props: ", props);
  return (
    <MyBox>
      Leaderboard
      <br />
      <Link to="/invoices">Invoices</Link> |{" "}
      <div>
        <Link to="/expenses">
          <Button variant="standard">Expenses1</Button>
          <Button variant="outlined">Expenses2</Button>
          <Button>Expenses3</Button>
          <Button variant="text">Expenses4</Button>
          <Button variant="contained">Expenses5</Button>
          <div>Allo</div>
          <Button color="secondary" variant="standard">
            Expenses6
          </Button>
          <Button color="secondary" variant="outlined">
            Expenses7
          </Button>
          <Button color="secondary">Expenses8</Button>
          <Button color="secondary" variant="text">
            Expenses9
          </Button>
          <Button color="secondary" variant="contained">
            Expenses10
          </Button>
        </Link>
      </div>
      | <Link to="/invoices/expenses">Invoice Expenses</Link>
    </MyBox>
  );
};

Leaderboard.propTypes = {
  prop: PropTypes.string,
};

export default Leaderboard;
