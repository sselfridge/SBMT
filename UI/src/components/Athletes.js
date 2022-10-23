import React, { useState, useEffect } from "react";
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
import { ApiGet } from "api/api";

const MyBox = styled(Box)(({ theme }) => ({
  padding: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
}));

const Athletes = (props) => {
  const [athletes, setAthletes] = useState([]);

  useEffect(() => {
    ApiGet("/api/athletes", setAthletes);
  }, []);

  return (
    <MyBox>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Sex</TableCell>
            <TableCell>Weight</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {athletes.map((user) => (
            <TableRow key={`${user.athleteId}`}>
              <TableCell>
                <img
                  style={{ height: 40, borderRadius: "50px" }}
                  src={user.avatar}
                  alt="avatar"
                />
              </TableCell>
              <TableCell>
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
