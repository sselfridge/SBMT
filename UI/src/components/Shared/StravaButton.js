import React from "react";
import PropTypes from "prop-types";
import { Typography, useMediaQuery, Link as MuiLink, Box } from "@mui/material";
import {} from "react-router-dom";

const StravaButton = (props) => {
  const { text } = props;

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  let redirect_uri;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    redirect_uri = "https://localhost:5001";
  } else {
    redirect_uri = "https://www.sbmtchallenge.com";
  }

  return (
    <Box sx={{ display: "flex" }}>
      <MuiLink
        href={`https://www.strava.com/oauth/authorize?client_id=16175&redirect_uri=${redirect_uri}/api/strava/callback&response_type=code&approval_prompt=auto&scope=read,activity:read,profile:read_all`}
        sx={{
          display: "flex",
          backgroundColor: "strava.main",
          padding: "10px 20px",
          borderRadius: 2,
          textDecoration: "none",
          "&:hover": {
            backgroundColor: "strava.light",
          },
        }}
      >
        <Typography
          sx={{
            color: "strava.contrastText",
            fontWeight: 800,
            letterSpacing: "0.05em",
          }}
          variant={isMobile ? undefined : "h6"}
        >
          {text}
        </Typography>
      </MuiLink>
    </Box>
  );
};

StravaButton.propTypes = {
  prop: PropTypes.object,
};

export default StravaButton;
