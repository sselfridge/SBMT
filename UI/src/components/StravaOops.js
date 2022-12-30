import React from "react";
import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import StravaButton from "./Shared/StravaButton";
import { Link } from "react-router-dom";

const MyPaper = styled(Paper)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const StravaOops = (props) => {
  return (
    <MyPaper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      OOPS!
      <Typography>
        Looks like there was a problem authenticating with strava.
      </Typography>
      <StravaButton text={"Try again here"} />
      <Typography sx={{ marginTop: "25px" }}>
        If you continue to have issues, please let me know.
      </Typography>
      <Link to="/help">Help Page</Link>
    </MyPaper>
  );
};

StravaOops.propTypes = {
  //   prop: PropTypes.object,
};

export default StravaOops;
