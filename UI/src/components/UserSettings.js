import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const UserSettings = (props) => {
  const { prop } = props;
  return <MyBox>Well this is a user Settings page</MyBox>;
};

UserSettings.propTypes = {
  prop: PropTypes.string,
};

export default UserSettings;
