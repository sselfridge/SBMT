import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Autocomplete, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ApiGet } from "api/api";

const MyBox = styled(Box)(({ theme }) => ({ padding: 8, borderRadius: 4 }));
const linkRegex = /^https:\/\/strava.app.link\/.{8,20}$/;

const NewEffort = (props) => {
  const { prop } = props;

  const [segments, setSegments] = React.useState([]);
  const [segment, setSegment] = React.useState({});

  const [movingTime, setMovingTime] = React.useState("");
  const [activityId, setActivityId] = React.useState("");
  const [helperText, setHelperText] = React.useState("");
  const [disabled, setDisabled] = React.useState(false);

  console.info("segments: ", segments);

  React.useEffect(() => {
    ApiGet("/api/segments", setSegments);
  }, []);

  React.useEffect(() => {
    setDisabled((isDisabled) => {
      const num = Number(activityId);

      if (Number.isNaN(num)) {
        if (linkRegex.test(activityId)) {
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
  }, [activityId]);

  return (
    <Paper sx={{ p: 3, width: "300px" }}>
      <Box>New Effort</Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Autocomplete
          options={segments}
          getOptionLabel={(o) => o.name || ""}
          value={segment}
          onChange={(e, newVal) => {
            setSegment(newVal);
          }}
          renderInput={(params) => <TextField {...params} label={"Segment"} />}
        />
        <DatePicker label="Effort Date" />
        <TextField
          label="Moving Time"
          value={movingTime}
          onChange={(e) => setMovingTime(e.target.value)}
        />
        <TextField
          label="Activity"
          value={activityId}
          onChange={(e) => setActivityId(e.target.value)}
          helperText={helperText}
        />
        <Button>Save</Button>
      </Box>
    </Paper>
  );
};

NewEffort.propTypes = {
  prop: PropTypes.object,
};

export default NewEffort;
