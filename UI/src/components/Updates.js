import React from "react";
import PropTypes from "prop-types";
import { List, ListItem } from "@mui/material";

const Updates = (props) => {
  const { TitleTypography, ArticleBox, SubTitleTypo } = props;

  return (
    <ArticleBox sx={{ margin: "0 15%" }}>
      <TitleTypography variant="h2">Beta Updates</TitleTypography>
      <SubTitleTypo variant="h4">Ides of March</SubTitleTypo>
      <List sx={{ fontSize: ".8em" }}>
        <ListItem>
          Added more filters (distance, elevation, age, category)
        </ListItem>
        <ListItem>
          updated post login landing page to recent or settings for existing
          users
        </ListItem>
      </List>
      <SubTitleTypo variant="h4">Late Feb update</SubTitleTypo>
      <List sx={{ fontSize: ".8em" }}>
        <ListItem>Added feedback request floating button</ListItem>
      </List>
      <SubTitleTypo variant="h4">PostChistmas-preNew years</SubTitleTypo>
      <List sx={{ fontSize: ".8em" }}>
        <ListItem>
          Discovered that I'm not handling the case where people click, cancel
          on the strava auth request...oops.
        </ListItem>
      </List>
      <SubTitleTypo variant="h4">Christmas Update</SubTitleTypo>
      <List sx={{ fontSize: ".8em" }}>
        <ListItem>
          Pushed a small config update and realized that ENV variables are set
          to `Development` by my debugger and that dotnet doesn't automatically
          set them, so had a few minutes of scramble while getting that sorted
          out. If you uploaded a ride during those times, it might have gotten
          lost.
        </ListItem>
        <ListItem>
          Also added a small progress bar icon to the leaderboard, but thats
          small potatoes when dealing with a site outage...so much for my 100%
          uptime rating
        </ListItem>
      </List>
      <SubTitleTypo variant="h4">Second update of December</SubTitleTypo>
      <List sx={{ fontSize: ".8em" }}>
        <ListItem>
          Implemented strava push responses, so efforts should go away when you
          delete or make them private etc.
        </ListItem>
      </List>
      <SubTitleTypo variant="h4">First update of December</SubTitleTypo>
      <List sx={{ fontSize: ".8em" }}>
        <ListItem>
          Switched over to dotnet authenticate / authorize instead of using home
          brewed JWT
        </ListItem>
        <ListItem>
          Added Admin page for me so I don't have to do things manually in SQL,
          because I have to look up syntax for every query every time...
        </ListItem>
        <ListItem>
          Tweaked a few segments. Casitas climb west bound starts from the fire
          station, Toro canyon starts from Via Real, and Tunnel Road ends at the
          gate.
        </ListItem>
      </List>
      <SubTitleTypo variant="h4">Thanksgiving Update</SubTitleTypo>
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
          Reduced scope of requested strava permissions. Might need more to add
          in other functionality later on, but looks like the core way the app
          works will be good with just read,activity_read permissions. Planning
          to add in a page that explains everything that is needed for each of
          the additional permissions.
        </ListItem>
      </List>
      <SubTitleTypo variant="h4">Pre-This list</SubTitleTypo>
      <List sx={{ fontSize: ".8em" }}>
        <ListItem>
          Most of the core functionality is implemented already.
          <br /> Only unknown issue is 1 time I got a push notification for a
          ride creation but that ride never got processed. I've added more
          logging since then, so hopefully that will be able to analyze it more
          if/when it happens again.
        </ListItem>
        <ListItem>
          BE TODOs are to switch over fully to using dotnet auth cookies instead
          of my homebrew JWT one that is currently powering auth.
        </ListItem>
      </List>
    </ArticleBox>
  );
};

Updates.propTypes = {
  TitleTypography: PropTypes.object,
  ArticleBox: PropTypes.element,
  SubTitleTypo: PropTypes.string,
};

export default Updates;
