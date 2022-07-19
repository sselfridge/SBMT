import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Table, TableRow, TableHead, TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const Athletes = (props) => {
  const { prop } = props;
  return (
    <MyBox>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>ID</TableCell>
          </TableRow>
        </TableHead>
        <TableRow>
          <TableCell>Bob</TableCell>
          <TableCell>
            <Link to="1234">1234</Link>
          </TableCell>
        </TableRow>
      </Table>
    </MyBox>
  );
};

Athletes.propTypes = {
  prop: PropTypes.string,
};

export default Athletes;
