import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Tabs,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Tab } from "@mui/material";
import UserMenu from "./UserMenu";
import { Link } from "react-router-dom";

function LinkTab(props) {
  return (
    <Tab
      component={Link}
      sx={{
        color: "white",
        "&.Mui-selected": { color: "white", fontWeight: 800 },
      }}
      {...props}
    />
  );
}
LinkTab.propTypes = {
  to: PropTypes.string.isRequired,
};

export default function AppHeader() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
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
          <UserMenu />
        </Toolbar>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="nav tabs example"
          >
            {/* <LinkTab label="demo" to="/demo" /> */}
            <LinkTab label="Leaderboard" to="/leaderboard" />
            <LinkTab label="Segments" to="/segments" />
            <LinkTab label="Athletes" to="/athletes" />
          </Tabs>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
