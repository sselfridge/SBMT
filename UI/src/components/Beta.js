import React, { useContext } from "react";
import _ from "lodash";
import { Box, Typography, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import AppContext from "AppContext";
import StravaButton from "./Shared/StravaButton";

const MyPaper = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const Beta = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
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
        Segments are taken from Oct 21st onwards.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <StravaButton text={"Register for Beta"} />
      </Box>

      <Typography variant="h6">
        Data Use Notification: No data is sold and the minimal amount is stored.
        You can remove yourself at anytime in User Profile -{">"} Settings
      </Typography>
    </MyPaper>
  );
};

export default Beta;
