import React from "react";
import PropTypes from "prop-types";
import {
  Typography,
  useMediaQuery,
  Link as MuiLink,
  Box,
  Button,
} from "@mui/material";

import { ReactComponent as ConnectStrava } from "assets/stravaBrand/btn_strava_connectwith_orange.svg";
import AppContext from "AppContext";
import { ApiDelete } from "api/api";

const StravaButton = (props) => {
  let { text } = props;

  const { redirectUri, user, dispatch } = React.useContext(AppContext);

  const onSetUser = React.useCallback(
    (user) => dispatch({ type: "setUser", user }),
    [dispatch]
  );

  const onLogout = () => {
    ApiDelete("/api/logout", onSetUser, {});
  };

  const stravaUrl = `https://www.strava.com/oauth/authorize?client_id=16175&redirect_uri=${redirectUri}/api/strava/callback&response_type=code&approval_prompt=auto&scope=read,activity:read,profile:read_all`;

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  if (user?.firstname) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {`${user.firstname} you're signed up for the next season!`}
        <Button onClick={onLogout}>Logout</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <MuiLink
        href={stravaUrl}
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
  text: PropTypes.string,
};

export default StravaButton;
