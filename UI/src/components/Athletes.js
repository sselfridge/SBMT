import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { ApiGet } from "api/api";

const MyBox = styled(Box)(({ theme }) => ({
  padding: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
}));

const Athletes = () => {
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
            {/* <TableCell>Weight</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {athletes.map((user) => (
            <TableRow key={`${user.athleteId}`}>
              <TableCell>
                <Link to={`${user.athleteId}`}>
                  <Avatar src={user.avatar} />
                </Link>
              </TableCell>
              <TableCell>
                <Link to={`${user.athleteId}`}>
                  {user.firstname} {user.lastname}
                </Link>
              </TableCell>
              <TableCell>{user.sex}</TableCell>
              {/* <TableCell>{(user.weight * 2.2).toFixed(2)}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MyBox>
  );
};

export default Athletes;
