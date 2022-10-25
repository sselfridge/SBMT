import React from "react";
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
      navigate("segments");
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
        At first just getting user reg running smoothly. Next up will be getting
        segment efforts from rides when they're uploaded then next will pulling
        all efforts from recent ride history.
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

      <Typography variant="h5">
        Data Use: No data is sold and the minimal amount is stored. The 'delete
        my data' button doesn't work yet, but if you want out send me an email
        or instagram DM and I'll delete you.
      </Typography>
    </MyPaper>
  );
};

Beta.propTypes = {
  //   prop: PropTypes.string,
};

export default Beta;
