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

import { Link } from "react-router-dom";

import Api from "api/api";

export default function AppHeader() {
  const [user, setUser] = React.useState(null);
  const fetchOnce = useRef(true);
  useEffect(() => {
    if (fetchOnce.current) {
      fetchOnce.current = null;
      Api.get("/api/strava/athlete/id")
        .then((response) => {
          if (response.status === 200) setUser(response.data);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const onLogout = () => {
    Api.delete("/api/strava/logout")
      .then((res) => {
        console.info(res);
        setUser(null);
      })
      .catch((err) => console.error(err));
  };

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
            sx={{
              flexGrow: 1,
              fontSize: 45,
              textAlign: "center",
              fontFamily: "coordinates, monospace;",
              fontWeight: 800,
              letterSpacing: -4,
            }}
          >
            <span className="sbmt">SBMT</span>
          </Typography>{" "}
          {user && (
            <Button color="inherit">
              {`${user?.firstname} ${user?.lastname}`}
              <img style={{ borderRadius: 50 }} alt="" src={user.avatar} />
            </Button>
          )}
          <Button onClick={onLogout} sx={{ color: "white" }}>
            Logout
          </Button>
        </Toolbar>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          {!user && (
            <button>
              <a href="https://www.strava.com/oauth/authorize?client_id=16175&redirect_uri=https://localhost:7179/api/strava/callback&response_type=code&approval_prompt=auto&scope=read_all,activity:read_all">
                Strava Login
              </a>
            </button>
          )}
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
