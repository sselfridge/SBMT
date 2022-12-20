import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactComponent as Insta } from "assets/insta.svg";
import { ReactComponent as StravaLogo } from "assets/stravaLogoOrange.svg";

import AppContext from "AppContext";

import StravaButton from "components/Shared/StravaButton";

const MyPaper = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const Thanks = () => {
  const { user } = useContext(AppContext);
  const [noClubScope, setNoClubScope] = React.useState(false);
  console.info("user: ", user);

  React.useEffect(() => {
    if (user?.scope?.includes("profile:read_all") === false) {
      setNoClubScope(true);
    }
  }, [user?.scope]);

  return (
    <MyPaper
      sx={{
        maxWidth: 500,
        height: "80vh",
        minHeight: 400,
        display: "flex",
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
      {noClubScope && (
        <>
          <StravaButton text='Add "Access Profile" scope' />
        </>
      )}
      <Typography variant="h5">
        Keep an eye on the instagram feed and strava club, for more
        announcements
      </Typography>
      <Typography variant="h5">
        Before long your segment efforts should start showing up in the 'recent'
        tab
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
      <a className="landingLink" href="https://www.strava.com/clubs/1051955">
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
    </MyPaper>
  );
};

Thanks.propTypes = {
  //   prop: PropTypes.string,
};

export default Thanks;
