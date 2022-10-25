import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AppBar, Box, Toolbar, Typography, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";

import UserMenu from "./UserMenu";
import { Link, useLocation } from "react-router-dom";
import AppContext from "AppContext";
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

const TitleLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: "none",
}));

export default function AppHeader() {
  const [currentTabIdx, setCurrentTabIdx] = useState(0);

  const { pathname } = useLocation();

  useEffect(() => {
    switch (pathname) {
      case "/leaderboard":
        setCurrentTabIdx(0);
        break;
      case "/segments":
        setCurrentTabIdx(1);

        break;
      case "/athletes":
        setCurrentTabIdx(2);
        break;

      default:
        setCurrentTabIdx(false);
        break;
    }
  }, [pathname]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            align="left"
            sx={{
              flexGrow: 1,
              fontSize: 45,
              fontFamily: "coordinates, monospace;",
              fontWeight: 800,
              letterSpacing: -4,
            }}
          >
            <TitleLink to="segments">
              <span className="sbmt">SBMT</span>
            </TitleLink>
            <AppContext.Consumer>
              {(context) => <UserMenu {...context} />}
            </AppContext.Consumer>
          </Typography>{" "}
        </Toolbar>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <Tabs value={currentTabIdx} aria-label="nav tabs example">
            {/* <LinkTab label="recent" to="recent" /> */}
            {/* <LinkTab label="Leaderboard" to="leaderboard" /> */}
            <LinkTab label="Segments" to="segments" />
            <LinkTab label="Athletes" to="athletes" />
          </Tabs>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
