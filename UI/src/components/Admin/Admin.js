import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const MyPaper = styled(Paper)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const Admin = (props) => {
  const { prop } = props;

  return (
    <MyPaper>
      <Typography variant={"h3"}>Admin Utilities</Typography>
      <Link to="segments">Segments</Link>
    </MyPaper>
  );
};

Admin.propTypes = {
  prop: PropTypes.object,
};

export default Admin;
