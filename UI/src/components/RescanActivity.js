import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  TextField,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";
import { ApiGet } from "api/api";
import AppContext from "AppContext";
import StravaButton from "./Shared/StravaButton";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const linkRegex = /^https:\/\/strava.app.link\/.{8,20}$/;

const RescanActivity = () => {
  const { user } = useContext(AppContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [input, setInput] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [helperText, setHelperText] = useState("");

  const handleSubmit = () => {
    const num = Number(input);

    if (Number.isNaN(num)) {
      const urlEncoded = encodeURIComponent(input);
      ApiGet(`/api/rescanActivityLink/${urlEncoded}`, () => {
        setSubmitted(true);
        setInput("");
      });
    } else {
      //activity number

      ApiGet(`/api/rescanActivity/${num}`, () => {
        setSubmitted(true);
        setInput("");
      });
    }
  };

  useEffect(() => {
    setDisabled((isDisabled) => {
      const num = Number(input);

      if (Number.isNaN(num)) {
        if (linkRegex.test(input)) {
          setHelperText("");

          return false;
        } else {
          setHelperText(
            <Box>
              <Box>Unsupported link format. Must be:</Box>
              <Box>https://strava.app.link/xxxxxxxxxx</Box>
              <Box>Or just Activity ID number</Box>
            </Box>
          );
          return true;
        }
      } else {
        if (num && num < 11042914109) {
          setHelperText("Number must be longer");
          return true;
        }
        setHelperText("");
        return false;
      }
    });
  }, [input]);

  return (
    <MyBox
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h2"
        sx={{ borderBottom: `3px solid`, borderColor: "secondary.main" }}
      >
        Activity Rescan
      </Typography>
      {user?.athleteId ? (
        <Box>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ fontSize: "1.3em", textAlign: "center" }}>
              Segment not showing up??
            </Box>
            <br /> Enter the ActivityID or StravaLink here to rescan.
            <br />
            <br /> If you're still having issues, contact me via one of the
            methods below
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ minWidth: isMobile ? "100px" : "350px" }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button disabled={disabled} onClick={handleSubmit}>
                Submit
              </Button>
              <Box sx={{ fontSize: 14, color: "error.main" }}>{helperText}</Box>
            </Box>
          </Box>
          {submitted && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CheckCircleIcon sx={{ color: "success.main" }} />
                Submitted!
              </Box>
              Head over to the <Link to={"/recent"}>recent page</Link> to see if
              it worked
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <StravaButton text="Login to rescan your activity" />
        </Box>
      )}
    </MyBox>
  );
};

RescanActivity.propTypes = {
  prop: PropTypes.object,
};

export default RescanActivity;
