import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormHelperText,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as DOMPurify from "dompurify";

import { ReactComponent as Insta } from "assets/insta.svg";
import { Link } from "react-router-dom";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const STATUS_LIST = ["Submit", "Submitting...", "Submitted"];

const HelpContact = (props) => {
  const [contactField, setContactField] = useState("");
  const [submittedStatus, setSubmittedStatus] = useState(STATUS_LIST[0]);

  const onSubmit = () => {
    setSubmittedStatus(STATUS_LIST[1]);
    setTimeout(() => {
      setSubmittedStatus(STATUS_LIST[2]);
      setContactField("");
    }, 900);
  };

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
        <Divider />
        <Box>
          <FormControl>
            {/* <InputLabel htmlFor="my-input">Email address</InputLabel> */}
            {submittedStatus === STATUS_LIST[2] ? (
              <Button onClick={() => setSubmittedStatus(STATUS_LIST[0])}>
                Wait I had more!!
              </Button>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <TextField
                  multiline
                  value={contactField}
                  onChange={(e) => {
                    let clean = DOMPurify.sanitize(e.target.value);
                    setContactField(clean);
                  }}
                  // maxRows={15}
                  label={"Message to Developer"}
                  placeholder="Your message here."
                  minRows={4}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      onSubmit();
                    }
                  }}
                  sx={{
                    minWidth: "225px",
                    width: "50vw",
                    maxWidth: "700px",
                  }}
                />
                <FormHelperText id="my-helper-text">
                  (Ctrl/Cmd + Enter to submit)
                </FormHelperText>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={onSubmit}
                  disabled={
                    contactField === "" || submittedStatus === "Submitting..."
                  }
                >
                  {submittedStatus}
                </Button>
              </Box>
            )}
          </FormControl>
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
