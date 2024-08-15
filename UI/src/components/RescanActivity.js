import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, TextField, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { ApiGet } from "api/api";
import AppContext from "AppContext";
import StravaButton from "./Shared/StravaButton";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const RescanActivity = () => {
  const { user } = useContext(AppContext);

  const [activityId, setActivityId] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    ApiGet(`/api/rescanactivity/${activityId}`, () => {
      setSubmitted(true);
    });
  };

  useEffect(() => {
    setDisabled((isDisabled) => {
      const num = Number(activityId);

      if (Number.isNaN(num)) {
        return true;
      }

      if (num < 11048166319) {
        return true;
      }

      return false;
    });
  }, [activityId]);

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
          <Box>
            Segment not showing up??
            <br /> Enter the ActivityID here and we'll rescan it
            <br /> Url / Share scan is work in progress - but for now you'll
            have to grab the activity ID from the URL of the activity.
          </Box>
          <Box>
            <TextField
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
            />
            <Button disabled={disabled} onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
          {submitted && (
            <Box>
              Submitted! Head over to the{" "}
              <Link to={"/recent"}>recent page</Link> to see if it worked
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
