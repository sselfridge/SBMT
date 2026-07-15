import React from "react";
import { TextField, Button } from "@mui/material";
import { rescanAthleteActivity } from "@/services/sbmt";
const Rescan = () => {
  const [athleteId, setAthleteId] = React.useState("");
  const [activityId, setActivityId] = React.useState("");

  const submitRescan = () => {
    rescanAthleteActivity(activityId, athleteId);
  };

  return (
    <div>
      <TextField
        label="athleteId"
        value={athleteId}
        onChange={(e) => setAthleteId(e.target.value)}
      />
      <TextField
        label="activityId"
        value={activityId}
        onChange={(e) => setActivityId(e.target.value)}
      />
      <Button onClick={submitRescan}>Rescan</Button>
    </div>
  );
};

export default Rescan;
