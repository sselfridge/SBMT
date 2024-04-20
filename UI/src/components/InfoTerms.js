import React from "react";
import PropTypes from "prop-types";
import { Box, Button, List, ListItem, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
          <TitleTypography variant="h2">Mandatory Terms</TitleTypography>
          Whats a modern website / service / app without a bunch of mandatory
          terms?!?
          <SubTitleTypo variant="h5">Don't be a Dick*</SubTitleTypo>
          <List>
            <ListItem>
              When you're going for segment times, don't put yourself or other
              in danger or other wise be a nuisance on the road/trail <br />
              "I was going for a Strava Segment" is the worst excuse for anyone
              getting hurt.
            </ListItem>
            <ListItem>All segments are public places, be respectful </ListItem>
          </List>
          <SubTitleTypo variant="h5">Don't get hurt</SubTitleTypo>
          <List>
            <ListItem>
              I've tried to avoid hazardous segments, but keep you head up and
              don't ride outside your limits.
            </ListItem>
          </List>
          <SubTitleTypo variant="h5">We use cookies</SubTitleTypo>
          <List>
            <ListItem>
              I don't think this matters since no one should be using this from
              Europe and won't fall under GDPR but just in case. The only thing
              we keep in the cookie is if you're logged in or not. No tracking
              or data harvesting.
            </ListItem>
          </List>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button onClick={() => navigate("/settings")}>
              Back to Profile
            </Button>
          </Box>
        </ArticleBox>
        *Insert your own term for an inconsiderate jerk as needed here
      </Paper>
    </MyBox>
  );
};

InfoScopes.propTypes = {
  prop: PropTypes.string,
};

export default InfoScopes;
