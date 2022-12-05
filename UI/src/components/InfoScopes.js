import React from "react";
import PropTypes from "prop-types";
import { Box, List, ListItem, Paper, Typography } from "@mui/material";
import { ReactComponent as Logo } from "assets/logoV1.svg";

import { styled } from "@mui/material/styles";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));
const ArticleBox = styled(Box)(({ theme }) => ({ margin: "0 15%" }));
const TitleTypography = styled(Typography)(({ theme }) => ({
  borderBottom: `3px solid`,
  borderColor: theme.palette.secondary.main,
}));
const SubTitleTypo = styled(Typography)(({ theme }) => ({
  borderBottom: `3px solid`,
  borderColor: theme.palette.secondary.main,
  margin: "0 20%",
}));

const InfoScopes = (props) => {
  return (
    <MyBox>
      <Paper
        sx={{
          width: "80vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: "0.75em",
        }}
      >
        <ArticleBox>
          <TitleTypography variant="h2">Strava Permissions</TitleTypography>
          In order to get your data from strava we need your permission. This is
          granted in different levels or 'scopes' There are several of levels of
          these and each has its own functionality associated with it.
          <SubTitleTypo variant="h5">Default/Required scopes</SubTitleTypo>
          <List>
            <ListItem>
              'read' - Access basic information about your strava profile.
            </ListItem>
            <ListItem>'activity:read' - View your public activities.</ListItem>
          </List>
          <SubTitleTypo variant="h5">Additional scopes</SubTitleTypo>
          These aren't required for the basic SBMT but they'll enhance the
          experience.
          <List>
            <ListItem>
              'read_all' - Think this is for getting users last 4-8 weeks
              activity levels. I really like the idea of making the leaderboard
              able to show you how you compare to people who ride a similar
              amount as you, to the level that I might make it a required
              permission....
            </ListItem>
            <ListItem>
              'profile:read_all' - Needed to get what clubs you're a part of for
              club based leaderboard
            </ListItem>
            <ListItem>
              'activity:read_all' - I think this is needed for getting your PRs
              on segments.
            </ListItem>
          </List>
        </ArticleBox>
      </Paper>
    </MyBox>
  );
};

InfoScopes.propTypes = {
  prop: PropTypes.string,
};

export default InfoScopes;
