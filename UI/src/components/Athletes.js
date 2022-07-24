import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

import { users } from "mockData/data";

const MyBox = styled(Box)(({ theme }) => ({
  padding: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
}));

const Athletes = (props) => {
  const { prop } = props;
  return (
    <MyBox>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Sex</TableCell>
            <TableCell>Weight</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={`${user.id}`}>
              <TableCell>
                {console.info(user)}
                <Link to={`${user.id}`}>
                  {user.firstname} {user.lastname}
                </Link>
              </TableCell>
              <TableCell>{user.sex}</TableCell>
              <TableCell>{(user.weight * 2.2).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MyBox>
  );
};

Athletes.propTypes = {
  prop: PropTypes.string,
};

export default Athletes;
