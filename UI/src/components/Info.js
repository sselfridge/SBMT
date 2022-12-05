import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Link as MuiLink,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { ReactComponent as Logo } from "assets/logoV1.svg";

import { styled } from "@mui/material/styles";
import { ApiGet } from "api/api";
const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));
const ArticleBox = styled(Box)(({ theme }) => ({ margin: "0 15%" }));
const TitleTypography = styled(Typography)(({ theme }) => ({
  borderBottom: `3px solid`,
  borderColor: theme.palette.secondary.main,
}));
const SubTiltleTypo = styled(Typography)(({ theme }) => ({
  borderBottom: `3px solid`,
  borderColor: theme.palette.secondary.main,
  margin: "0 20%",
}));

const Info = (props) => {
  const [segments, setSegments] = React.useState([]);

  console.info("segments: ", segments);

  React.useEffect(() => {
    ApiGet("/api/admin/segments", setSegments);
  }, []);

  return (
    <MyBox>
      <Paper
        sx={{
          width: "80vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "80vw", sm: "20vw" },
            maxHeight: { xs: "80vw", sm: "20vw" },
          }}
        >
          <Logo style={{ width: "100%", height: "100%" }} />
        </Box>
        <ArticleBox>
          <TitleTypography variant="h2">
            What is <span className="sbmt">SBMT</span> ?
          </TitleTypography>
          Inspired by the
          <MuiLink
            sx={{ color: "black", margin: "0px 5px" }}
            href="http://www.smmtchallenge.com"
          >
            SMMT
          </MuiLink>
          the Santa Barbara Mountain Challenge{" "}
          <span className="sbmt">SBMT</span> is the same idea here in Santa
          Barbara. <br />
          We'll have a list of 10-15 local cycling climbs and a leaderboard
          running. Starts Memorial Day weekend and runs til just before labor
          day weekend
          <br />
          <br />
          Ranking is done 1st by number of segments completed, then total
          cumulative time. <br />
          <br />
          We'll have plenty of sub categories so you can compete against people
          you're competitive with.
          <br />
          <br />I discovered the SMMT during COVID and really enjoyed it, plus
          it got me to some areas of the Santa Monicas I probably wouldn't have
          done otherwise. Hoping to bring something similar to SB!
          <br />
          <br />
          <br />
        </ArticleBox>
        <ArticleBox sx={{ margin: "0 15%" }}>
          <TitleTypography variant="h2">Beta Updates</TitleTypography>
          <SubTiltleTypo variant="h4">Thanksgiving Update</SubTiltleTypo>
          <List sx={{ fontSize: ".8em" }}>
            <ListItem>
              Removed BETA from most URLs, now only goes to the beta explanation
              page
            </ListItem>
            <ListItem>
              Ported this info page over from the landing page as well as adding
              this BETA progress list.
            </ListItem>
            <ListItem>
              Reduced scope of requested strava permissions. Might need more to
              add in other functionality later on, but looks like the core way
              the app works will be good with just read,activity_read
              permissions. Planning to add in a page that explains everything
              that is needed for each of the additional permissions.
            </ListItem>
          </List>
          <SubTiltleTypo variant="h4">Pre-This list</SubTiltleTypo>
          <List sx={{ fontSize: ".8em" }}>
            <ListItem>
              Most of the core functionality is implemented already.
              <br /> Only unknown issue is 1 time I got a push notification for
              a ride creation but that ride never got processed. I've added more
              logging since then, so hopefully that will be able to analyze it
              more if/when it happens again.
            </ListItem>
            <ListItem>
              BE TODOs are to switch over fully to using dotnet auth cookies
              instead of my homebrew JWT one that is currently powering auth.
            </ListItem>
          </List>
        </ArticleBox>
      </Paper>
    </MyBox>
  );
};

Info.propTypes = {
  prop: PropTypes.string,
};

export default Info;
