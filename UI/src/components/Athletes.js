import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Grid,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ApiGet } from "api/api";
import { FilterList } from "@mui/icons-material";

const Athletes = () => {
  const [athletes, setAthletes] = useState([]);

  const [filter, setFilter] = useState("");
  useEffect(() => {
    ApiGet("/api/athletes", setAthletes);
  }, []);

  const filteredAthletes = athletes
    .filter((a) => {
      const lowerFilter = `${filter}`.toLowerCase();
      const fullName = `${a.firstname} ${a.lastname}`.toLowerCase();
      return fullName.includes(lowerFilter);
    })
    .sort((a, b) => {
      if (a.firstname > b.firstname) return 1;
      else return -1;
    });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: {
          sm: "95vw",
          md: "80vw",
        },
        justifyContent: "space-evenly",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ backgroundColor: "background.paper", borderRadius: 5 }}>
        <TextField
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          placeholder="Filter"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterList color={"primary"} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Grid container sx={{ justifyContent: "center" }}>
        {filteredAthletes.map((user) => (
          <Grid sx={{ margin: "5px" }}>
            <Paper
              sx={{
                display: "flex",
                padding: 2,
                height: "80px",
                width: "200px",
                alignItems: "center",
              }}
            >
              <Link to={`${user.athleteId}`}>
                <Avatar src={user.avatar} />
              </Link>
              <Link to={`${user.athleteId}`}>
                <Typography>
                  {user.firstname} {user.lastname}
                </Typography>
              </Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Athletes;
