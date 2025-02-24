import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const EditProfile = (props) => {
  return <MyBox>Edit Profile</MyBox>;
};

EditProfile.propTypes = {
  prop: PropTypes.string,
};

export default EditProfile;
