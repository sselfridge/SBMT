import React, { useEffect, useRef } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";

import { Link } from "react-router-dom";

import { users } from "mockData/data";

export default function AppHeader() {
  const [user, setUser] = React.useState(null);
  const fetchOnce = useRef(true);
  console.info("AppHeader");
  useEffect(() => {
    if (fetchOnce.current) {
      fetchOnce.current = null;
      console.info("Fetch");
      fetch("/api/strava/athlete/id")
        .then((response) => {
          console.info("Response1");
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setUser(data);
        });

      console.info("End Fetch");
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontSize: 30 }}
          >
            <span className="sbmt" sx={{}}>
              SBMT
            </span>
          </Typography>{" "}
          {/* <img src={logo} alt="rabble" /> */}
          <Button color="inherit">{`${user?.firstname} ${user?.lastname}`}</Button>
        </Toolbar>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <button>
            <a href="https://www.strava.com/oauth/authorize?client_id=16175&redirect_uri=https://localhost:7179/api/strava/callback&response_type=code&approval_prompt=auto&scope=read_all,activity:read_all">
              Strava Login
            </a>
          </button>
          <Link to="/demo">
            <Button variant="standard" color="secondary">
              Demo
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="standard" color="secondary">
              Leaderboard
            </Button>
          </Link>
          <Link to="/segments">
            <Button variant="standard" color="secondary">
              Segments
            </Button>
          </Link>
          <Link to="/athletes">
            <Button variant="standard" color="secondary">
              Athletes
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
