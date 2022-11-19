import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Tab,
  Tabs,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import UserMenu from "./UserMenu";
import { Link, useLocation } from "react-router-dom";
import AppContext from "AppContext";

const TitleLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: "none",
}));

export default function NavBar() {
  const [currentTabIdx, setCurrentTabIdx] = useState(false);

  const { pathname } = useLocation();

  useEffect(() => {
    switch (pathname) {
      case "/beta/segments":
      case "/beta/leaderboard":
      case "/beta/recent":
      case "/beta/athletes":
        setCurrentTabIdx(pathname);
        break;

      default:
        setCurrentTabIdx(false);
        break;
    }
  }, [pathname]);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const tabs = ["leaderboard", "segments", "athletes"];

  if (!isMobile) tabs.unshift("recent");

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
            <TitleLink to="recent">
              <span className="sbmt">SBMT</span>
            </TitleLink>
            <AppContext.Consumer>
              {(context) => <UserMenu {...context} />}
            </AppContext.Consumer>
          </Typography>{" "}
        </Toolbar>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <Tabs value={currentTabIdx} aria-label="nav tabs example">
            {tabs.map((tabName) => (
              <Tab
                value={`/beta/${tabName}`}
                label={tabName}
                to={tabName}
                key={tabName}
                component={Link}
                sx={{
                  color: "white",
                  "&.Mui-selected": { color: "white", fontWeight: 800 },
                }}
              />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
