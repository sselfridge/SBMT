import React, { useState, useEffect } from "react";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import {
  fetchFeedback,
  toggleRead,
  deleteFeedback,
} from "@/services/adminFeedback";
import { FeedbackDTO } from "@/types/FeedbackDTO";
import { formattedDate } from "@/utils/helperFuncs";

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackDTO[]>([]);
  const [showRead, setShowRead] = useState(false);

  const navigate = useNavigate();

  const onToggleRead = async (id: string) => {
    try {
      const { data: updated } = await toggleRead(id);
      console.log("updated: ", updated);
      setFeedback((prev) => {
        const newFeedbacks = prev.slice();
        const idx = newFeedbacks.findIndex((f) => f.id === id);
        newFeedbacks[idx] = updated;
        return newFeedbacks;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const refreshFeedback = React.useCallback(async () => {
    try {
      const newFeedback = await fetchFeedback();
      setFeedback(newFeedback);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    refreshFeedback();
  }, [refreshFeedback]);

  const handleDelete = React.useCallback(
    async (id: string) => {
      try {
        await deleteFeedback(id);
        refreshFeedback();
      } catch (error) {
        console.error(error);
      }
    },
    [refreshFeedback],
  );

  return (
    <TableContainer component={Paper}>
      <Box sx={{ display: "flex", gap: 2, p: 2 }}>
        <Button
          onClick={() => {
            navigate("/admin");
          }}
        >
          Back to Admin
        </Button>
        <Button onClick={() => setShowRead((v) => !v)}>Toggle show read</Button>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Athlete Id</TableCell>
            <TableCell align="right">Text</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell>Actions</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feedback
            .filter((f) => (showRead ? true : f.read === false))
            .map((f) => (
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
                <TableCell>{formattedDate(f.createdDate)}</TableCell>
                <TableCell align="right">
                  <Button
                    color={f.read ? "primary" : "warning"}
                    onClick={() => {
                      onToggleRead(f.id);
                    }}
                  >
                    Mark as {f.read ? "Unread" : "Read"}
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    color="error"
                    onClick={() => {
                      handleDelete(f.id);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminFeedback;
