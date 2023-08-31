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

const TitleLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: "none",
}));

export default function NavBar() {
  const [currentTabIdx, setCurrentTabIdx] = useState(false);

  const location = useLocation();
  const { pathname } = location;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    switch (pathname) {
      case "/segments":
      case "/leaderboard":
      case "/recent":
      case "/athletes":
        setCurrentTabIdx(pathname);
        break;

      case "/beta/recent":
        if (isMobile) {
          setCurrentTabIdx(false);
        } else {
          setCurrentTabIdx(pathname);
        }
        break;

      default:
        setCurrentTabIdx(false);
        break;
    }

    let title = pathname.replace("/", "");
    title = title[0].toUpperCase() + title.slice(1);
    document.title = `SBMT - ${title}`;
  }, [isMobile, pathname]);

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
              <Box
                sx={{
                  fontSize: 8,
                  fontWeight: 400,
                  letterSpacing: 1,
                  fontFamily: "roboto",
                }}
              >
                Ends Sep 4th at 11:59pm
              </Box>
            </TitleLink>
            <UserMenu />
          </Typography>
        </Toolbar>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <Tabs value={currentTabIdx} aria-label="nav tabs example">
            {tabs.map((tabName) => (
              <Tab
                value={`/${tabName}`}
                key={tabName}
                label={tabName}
                to={tabName}
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
