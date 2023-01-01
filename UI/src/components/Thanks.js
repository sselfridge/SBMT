import React, { useContext, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactComponent as Insta } from "assets/insta.svg";
import { ReactComponent as StravaLogo } from "assets/stravaLogoOrange.svg";

import AppContext from "AppContext";

import StravaButton from "components/Shared/StravaButton";
import { Link } from "react-router-dom";

const MyPaper = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const Thanks = () => {
  const { user } = useContext(AppContext);
  const [noClubScope, setNoClubScope] = useState(false);
  const [noActivityScope, setNoActivityScope] = useState(false);

  React.useEffect(() => {
    if (user?.scope?.includes("profile:read_all") === false) {
      setNoClubScope(true);
    }

    if (user?.scope?.includes("activity:read") === false) {
      setNoActivityScope(true);
    }
  }, [user?.scope]);

  return (
    <MyPaper
      sx={{
        maxWidth: 600,
        // height: "80vh",
        minHeight: 800,
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <Box>
        {user?.firstname && (
          <Typography variant="h3">Hey {user.firstname},</Typography>
        )}
        thanks for signing up!
      </Box>
      {noActivityScope ? (
        <Box>
          <Typography variant="h6">
            Looks like you haven't enabled view activity scope. Without this
            permission SBMT won't be able to get any info for your rides.
          </Typography>
          <br />
          <Typography variant="h6">
            In order to proceed, click the link below and make sure the checkbox
            for <br />
            <b>View data about your activities</b>
            <br /> is enabled.
          </Typography>
          <br />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <StravaButton text='Add "Activity" scope' />
          </Box>
        </Box>
      ) : (
        <React.Fragment>
          {noClubScope && (
            <>
              <Paper
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 3,
                }}
              >
                <Typography
                  sx={{ color: "warning.main", fontWeight: 800 }}
                  variant="h4"
                >
                  Warning
                </Typography>
                <Typography>
                  You haven't given 'complete profile' permission, without this
                  you won't be able to view or be seen on club based
                  leaderboards.
                </Typography>
                <StravaButton text='Add "View Complete Profile" scope' />
              </Paper>
            </>
          )}
          <Typography variant="h5">
            Keep an eye on the instagram feed and strava club, for more
            announcements
          </Typography>
          <Typography variant="h5">
            All your efforts up to this point should be on the{" "}
            <Link to="/leaderboard">leaderboard</Link>
          </Typography>
          <Typography variant="h5">
            In the meantime, let me know if anything is broken here and ride the
            segments when you can!
          </Typography>
          <a href="https://www.instagram.com/sbmtchallenge/">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Insta
                style={{ minWidth: "45px", maxWidth: "45px", margin: "20px" }}
              />
              @SBMTChallenge
            </Box>
          </a>
          <a
            className="landingLink"
            href="https://www.strava.com/clubs/1051955"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <StravaLogo style={{ height: 40 }} id="stravaIco" />
              Strava Club
            </Box>
          </a>
        </React.Fragment>
      )}
    </MyPaper>
  );
};

Thanks.propTypes = {
  //   prop: PropTypes.string,
};

export default Thanks;
