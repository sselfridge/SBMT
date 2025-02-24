import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Grid,
  Paper,
  TextField,
  IconButton,
  Typography,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ApiGet } from "api/api";
import { FilterList } from "@mui/icons-material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import AppContext from "AppContext";
const viewTypes = ["standard", "dots", "list"];

const Athletes = () => {
  const [athletes, setAthletes] = useState([]);
  const [viewIndex, setViewIndex] = useState(0);

  const { year } = React.useContext(AppContext);

  const [filter, setFilter] = useState("");
  useEffect(() => {
    ApiGet(`/api/athletes?year=${year}`, setAthletes);
  }, [year]);

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
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
        }}
      >
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
        <IconButton
          onClick={() => setViewIndex((t) => (t + 1) % viewTypes.length)}
        >
          {viewTypes[viewIndex] === "dots" ? (
            <ViewStreamIcon />
          ) : viewTypes[viewIndex] === "standard" ? (
            <DragIndicatorIcon />
          ) : (
            <ViewModuleIcon />
          )}
        </IconButton>
      </Box>
      {viewTypes[viewIndex] === "standard" && (
        <Grid container sx={{ justifyContent: "center" }}>
          {filteredAthletes.map((user) => (
            <Grid sx={{ margin: "5px" }} key={user.athleteId}>
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
      )}
      {viewTypes[viewIndex] === "dots" && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {filteredAthletes.map((user) => (
            <Box
              sx={{
                display: "flex",
                padding: 1,
                // height: "80px",
                // width: "200px",
                alignItems: "center",
              }}
            >
              <Tooltip title={`${user.firstname} ${user.lastname}`}>
                <Link to={`${user.athleteId}`}>
                  <Avatar src={user.avatar} />
                </Link>
              </Tooltip>
            </Box>
          ))}
        </Box>
      )}
      {viewTypes[viewIndex] === "list" && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {filteredAthletes.map((user) => (
            <Paper
              sx={{
                display: "flex",
                padding: 1,
                height: "80px",
                width: "400px",
                alignItems: "center",
              }}
            >
              <Tooltip title={`${user.firstname} ${user.lastname}`}>
                <Link to={`${user.athleteId}`}>
                  <Avatar sx={{ ml: 2 }} src={user.avatar} />
                </Link>
              </Tooltip>
              <Link to={`${user.athleteId}`}>
                <Typography>
                  {user.firstname} {user.lastname}
                </Typography>
              </Link>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Athletes;
