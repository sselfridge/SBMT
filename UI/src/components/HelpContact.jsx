import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Typography, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";

import RescanActivity from "./RescanActivity";

import { ReactComponent as Insta } from "assets/insta.svg";
import { Link } from "react-router-dom";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const HelpContact = (props) => {
  return (
    <MyBox
      sx={{
        "& .MuiPaper-root": {
          marginTop: "16px",
        },
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "75vw",
          "& > .MuiBox-root": {
            padding: "24px",
          },
          "& > .MuiDivider-root": {
            color: "grey.600",
            width: "75vw",
          },
        }}
      >
        <RescanActivity />
      </Paper>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "75vw",
          "& > .MuiBox-root": {
            padding: "24px",
          },
          "& > .MuiDivider-root": {
            color: "grey.600",
            width: "75vw",
          },
        }}
      >
        <Typography
          variant="h2"
          sx={{ borderBottom: `3px solid`, borderColor: "secondary.main" }}
        >
          Contact
        </Typography>
        <Box>
          <Typography align="center" variant="h5">
            Email Me
          </Typography>
          <Typography variant="h5">
            <a href="mailTo:Sam.Selfridge@gmail.com?subject=SBMT">
              Sam.Selfridge@gmail.com
            </a>
          </Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            // padding: 0,
            "& .cls-1": { fill: "#545454" },
            "& a": {
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "center",
            },
          }}
        >
          <a href="https://www.instagram.com/sbmtchallenge/">
            <Insta
              style={{ minWidth: "45px", maxWidth: "45px", margin: "20px" }}
            />
            @SBMTChallenge
          </a>
        </Box>
      </Paper>

      <Paper sx={{ padding: "24px" }}>
        <Typography align="center" variant="h2">
          FAQ
        </Typography>
        <Typography variant="h5">
          Interested in what the strava permissions we ask for are?{" "}
          <Link to="/info/scopes">Check out my explanation here.</Link>
        </Typography>
      </Paper>
    </MyBox>
  );
};

HelpContact.propTypes = {
  prop: PropTypes.string,
};

export default HelpContact;
