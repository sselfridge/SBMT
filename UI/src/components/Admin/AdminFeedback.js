import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";

import { ApiGet } from "api/api";

const AdminFeedback = (props) => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    ApiGet("/api/admin/feedback", setFeedback);
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Athlete Id</TableCell>
            <TableCell align="right">Text</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feedback.map((f) => (
            <TableRow
              key={f.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link to={`/athletes/${f.athleteId}`} key={f.id}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={f.avatar} />
                    {f.name}
                  </Box>
                </Link>
              </TableCell>
              <TableCell sx={{ maxWidth: 500 }} align="right">
                {f.text}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

AdminFeedback.propTypes = {
  prop: PropTypes.object,
};

export default AdminFeedback;
