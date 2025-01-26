import React, { useState, useContext, useEffect } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { Box, Paper, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ApiGet, ApiPost } from "api/api";
import NewEffort from "components/NewEffort";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const AdminEfforts = (props) => {
  return (
    <MyBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <NewEffort />
    </MyBox>
  );
};

AdminEfforts.propTypes = {
  prop: PropTypes.object,
};

export default AdminEfforts;
