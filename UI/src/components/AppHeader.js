import * as React from "react";
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

import logo from "assets/logoV1.svg";

import { users } from "mockData/data";

const user = users[0];

export default function AppHeader() {
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
          <Button color="inherit">{`${user.firstname} ${user.lastname}`}</Button>
        </Toolbar>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
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
        </Toolbar>
      </AppBar>
    </Box>
  );
}
