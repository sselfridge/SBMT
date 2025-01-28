import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Box, Paper, Autocomplete, TextField, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ApiGet, ApiPut } from "api/api";
import AppContext from "AppContext";

const shortLinkRegex = /^https:\/\/strava.app.link\/.{8,20}$/;
const linkRegex = /^https:\/\/www.strava.com\/activities\/(\d{8,20})$/;
const hoursRegex = /^(\d?\d):?([0-5]\d):([0-5]\d)$/;
const minRegex = /^([0-5]?\d):([0-5]\d)$/;

function formatSeconds(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

const NewEffort = (props) => {
  const [users, setUsers] = React.useState([]);
  const [user, setUser] = React.useState(null);

  const [segments, setSegments] = React.useState([]);
  const [segment, setSegment] = React.useState(null);

  const [movingTime, setMovingTime] = React.useState(0);
  const [movingTimeInput, setMovingTimeInput] = React.useState("");
  const [movingTimeHelper, setMovingTimeHelper] = React.useState("");

  const [activityInput, setActivityInput] = React.useState("");
  const [activityId, setActivityId] = React.useState(0);
  const [activityHelper, setHelperText] = React.useState("");
  const [submitDisabled, setSubmit] = React.useState(false);
  const [date, setDate] = React.useState(null);

  const { kickOffDate, user: currentUser, endingDate } = useContext(AppContext);
  const isAdmin = currentUser.athleteId === 1075670;

  React.useEffect(() => {
    ApiGet("/api/segments", setSegments);
  }, []);

  React.useEffect(() => {
    if (isAdmin) {
      ApiGet("/api/admin/users", setUsers);
    }
  }, [isAdmin]);

  React.useEffect(() => {
    const num = Number(activityInput);

    if (Number.isNaN(num)) {
      if (shortLinkRegex.test(activityInput)) {
        setHelperText("");
        const urlEncoded = encodeURIComponent(activityInput);
        ApiGet(`/api/parseStravaLink/${urlEncoded}`, setActivityInput);

        return;
      } else if (linkRegex.test(activityInput)) {
        const result = linkRegex.exec(activityInput);
        const [, actId] = result;

        setActivityInput(`${actId}`);

        return;
      } else {
        setHelperText(
          <Box>
            <Box>Unsupported link format. Must paste as:</Box>
            <Box>https://strava.app.link/xxxxxxxxxx</Box>
            <Box>or</Box>
            <Box>https://www.strava.com/activities/xxxxxxxx</Box>
            <Box>Or enter just Activity ID number</Box>
          </Box>
        );
        return;
      }
    } else {
      setActivityId(num);
      return;
    }
  }, [activityInput]);

  React.useEffect(() => {
    if (activityId && activityId < 11042914109) {
      setHelperText("Number must be longer");
      setSubmit(false);
      return;
    }

    if (!segment) {
      setSubmit(false);
      return;
    }

    setHelperText("");
  }, [activityId, segment]);

  const calcTime = React.useCallback(() => {
    const num = Number(movingTimeInput);

    if (Number.isNaN(num)) {
      let result = minRegex.exec(movingTimeInput);
      if (result) {
        const [, min, sec] = result;

        const total = Number(min) * 60 + Number(sec);

        setMovingTimeHelper("");
        return total;
      }

      result = hoursRegex.exec(movingTimeInput);
      if (result) {
        const [, hour, min, sec] = result;
        setMovingTimeHelper("");
        const total = Number(hour) * 3600 + Number(min) * 60 + Number(sec);
        return total;
      }
      setMovingTimeHelper(
        <Box>
          <Box>Unsupported time format. Must be:</Box>
          <Box>Either total seconds</Box>
          <Box>Or HH:MM:SS or MM:SS</Box>
        </Box>
      );
    } else {
      return num;
    }
  }, [movingTimeInput]);

  React.useEffect(() => {
    calcTime();
  }, [calcTime]);

  const onBlur = () => {
    const newTime = calcTime();
    setMovingTime(newTime);
    setMovingTimeInput(formatSeconds(newTime));
  };

  const save = () => {
    const newEffort = {
      athleteId: user.athleteId,
      activityId,
      elapsedTime: movingTime,
      movingTime,
      segmentId: segment.id,
      startDate: date,
    };

    ApiPut("/api/admin/efforts", newEffort);
  };

  return (
    <Paper sx={{ p: 3, width: "500px" }}>
      <Box>New Effort</Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Autocomplete
          options={users}
          getOptionLabel={(o) =>
            o.firstname ? `${o.firstname} ${o.lastname}`.trim() : ""
          }
          value={user}
          onChange={(e, newVal) => {
            setUser(newVal);
          }}
          renderInput={(params) => <TextField {...params} label={"User"} />}
        />
        <Autocomplete
          options={segments}
          getOptionLabel={(o) => o.name || ""}
          value={segment}
          onChange={(e, newVal) => {
            setSegment(newVal);
          }}
          renderInput={(params) => <TextField {...params} label={"Segment"} />}
        />
        <DatePicker
          label="Effort Date"
          value={date}
          minDate={new Date(kickOffDate)}
          maxDate={new Date(endingDate)}
          onChange={(date, error) => {
            if (!error.validationError) {
              setDate(date);
            }
          }}
        />
        <TextField
          label="Moving Time"
          value={movingTimeInput}
          onChange={(e) => setMovingTimeInput(e.target.value)}
          onBlur={onBlur}
          error={!!movingTimeHelper}
          helperText={movingTimeHelper}
        />
        <TextField
          label="Activity URL or ID"
          value={activityInput}
          onChange={(e) => setActivityInput(e.target.value)}
          helperText={activityHelper}
          error={!!activityHelper}
        />
        <Button disabled={submitDisabled} onClick={save}>
          Save
        </Button>
      </Box>
      <Box sx={{ p: 3 }}>
        <Box>AthleteId: {user.athleteId || ""}</Box>
        <Box>Segment: {segment?.name || ""}</Box>
        <Box>Date: {date?.toString() || ""}</Box>
        <Box>MovingTime: {movingTime || ""}</Box>
        <Box>ActivityId: {activityId || ""}</Box>
      </Box>
    </Paper>
  );
};

NewEffort.propTypes = {
  prop: PropTypes.object,
};

export default NewEffort;
