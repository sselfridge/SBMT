import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, TextField, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { ApiGet } from "api/api";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));

const RescanActivity = (props) => {
  const { prop } = props;

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
      {" "}
      <Typography
        variant="h2"
        sx={{ borderBottom: `3px solid`, borderColor: "secondary.main" }}
      >
        Activity Rescan
      </Typography>
      <Box>
        Segment not showing up?
        <br /> Enter the ActivityID here and we'll rescan it
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
          Submitted! Head over to the <Link to={"/recent"}>recent page</Link> to
          see if it worked
        </Box>
      )}
    </MyBox>
  );
};

RescanActivity.propTypes = {
  prop: PropTypes.object,
};

export default RescanActivity;
