import React from "react";
import config from "config";
import PropTypes from "prop-types";
import { Typography, useMediaQuery, Link as MuiLink, Box } from "@mui/material";

import { ReactComponent as ConnectStrava } from "assets/stravaBrand/btn_strava_connectwith_orange.svg";

const StravaButton = (props) => {
  const { text } = props;

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex" }}>
      <MuiLink
        href={config.stravaUrl}
        sx={{
          display: "flex",
          backgroundColor: "strava.main",
          padding: !!text ? "10px 20px" : "",
          borderRadius: 2,
          textDecoration: "none",
          "&:hover": {
            backgroundColor: "strava.light",
          },
        }}
      >
        {!!text ? (
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
        ) : (
          <ConnectStrava />
        )}
      </MuiLink>
    </Box>
  );
};

StravaButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default StravaButton;
