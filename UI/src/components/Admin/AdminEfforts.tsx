import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import NewEffort from "components/NewEffort";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const AdminEfforts = () => {
  return (
    <MyBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <NewEffort />
    </MyBox>
  );
};

export default AdminEfforts;
