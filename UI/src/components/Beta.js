import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Box, Typography, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const MyPaper = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const Beta = ({ user }) => {
  let redirect_uri;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    redirect_uri = "https://localhost:5001";
  } else {
    redirect_uri = "https://www.sbmtchallenge.com";
  }

  const navigate = useNavigate();
  React.useEffect(() => {
    if (user !== null && !_.isEmpty(user)) {
      navigate("recent");
    }
  }, [navigate, user]);

  return (
    <MyPaper
      sx={{
        maxWidth: 500,
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <Typography variant="h3">Open for early beta!</Typography>
      <Typography variant="h5">
        Now with working Leaderboard!! <br />
        Segments are taken from Oct 21st (day before the SB100) onwards.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Link
          href={`https://www.strava.com/oauth/authorize?client_id=16175&redirect_uri=${redirect_uri}/api/strava/callback&response_type=code&approval_prompt=auto&scope=read_all,activity:read_all,profile:read_all`}
          sx={{
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
            variant="h6"
          >
            Register for Beta
          </Typography>
        </Link>
      </Box>

      <Typography variant="h6">
        Data Use Notification: No data is sold and the minimal amount is stored.
        You can remove yourself at anytime in User Profile -{">"} Settings
      </Typography>
    </MyPaper>
  );
};

Beta.propTypes = {
  user: PropTypes.object,
};

export default Beta;
