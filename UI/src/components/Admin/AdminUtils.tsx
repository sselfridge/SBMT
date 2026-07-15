import React from "react";
import { Paper } from "@mui/material";
import Xoms from "./Utils/Xoms";
import Rescan from "./Utils/Rescan";

const AdminUtils = () => {
  return (
    <Paper
      sx={{ padding: 8, display: "flex", flexDirection: "column", gap: 3 }}
    >
      <Xoms />
      <Rescan />
    </Paper>
  );
};

export default AdminUtils;
