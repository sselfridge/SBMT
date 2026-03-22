import React from "react";
import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const MyPaper = styled(Paper)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const Admin = () => {
  return (
    <MyPaper sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant={"h3"}>Admin Utilities</Typography>
      <Link to="segments">Segments</Link>
      <Link to="users">Users</Link>
      <Link to="feedback">Feedback</Link>
      <Link to="efforts">Efforts</Link>
    </MyPaper>
  );
};

export default Admin;
