import React from "react";
import { updateXoms } from "services/strava";
import {
  Button,
  Select,
  Paper,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { YEARS } from "utils/constants";

const AdminUtils = () => {
  const [xomYear, setXomYear] = React.useState(YEARS[0]);
  const [xomMsg, setXomMsg] = React.useState("");

  const handleUpdate = async () => {
    try {
      const count = await updateXoms(xomYear);
      setXomMsg(`Updated ${count} Xoms for this season`);
    } catch (e) {
      console.log("e: ", e);
      setXomMsg("Error updating Xoms");
    }
  };

  const handleChange = (e: SelectChangeEvent) => {
    const val = e.target.value;
    console.log("val: ", val);

    setXomYear(val);
  };

  return (
    <Paper sx={{ padding: 8 }}>
      <Button onClick={handleUpdate}>Update Xoms</Button>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={xomYear}
        label="Age"
        onChange={handleChange}
      >
        {YEARS.map((y) => (
          <MenuItem value={y}>{y}</MenuItem>
        ))}
      </Select>
      {xomMsg}
    </Paper>
  );
};

export default AdminUtils;
