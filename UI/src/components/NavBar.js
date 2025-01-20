import React, { useState, useEffect } from "react";
import { AppBar, Box, Toolbar, Tab, Tabs, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import AppContext from "AppContext";

import UserMenu from "./UserMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as PwdByStrava } from "assets/stravaBrand/api_logo_pwrdBy_strava_horiz_light.svg";

const TitleLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: "none",
}));

const PwdBy = styled(PwdByStrava)(({ theme }) => ({
  height: "40px",
  position: "absolute",
  top: "-15px",
}));

export default function NavBar() {
  const [currentTabIdx, setCurrentTabIdx] = useState(false);

  const { user, env } = React.useContext(AppContext);

  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  React.useEffect(() => {
    if (
      user?.active === false &&
      pathname !== "/settings" &&
      pathname !== "/info/terms"
    ) {
      navigate("/settings?remind");
    }
  }, [navigate, pathname, user?.active]);

  useEffect(() => {
    switch (pathname) {
      case "/segments":
      case "/leaderboard":
      case "/athletes":
        setCurrentTabIdx(pathname);
        break;

      case "/recent":
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

  let titleText = "SBMT";

  switch (env) {
    case "LocalProd":
      titleText = " LocalProd";
      break;
    case "Development":
      titleText = " DEV";
      break;
    case "Staging":
      titleText = " STG";
      break;
    default:
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box
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
              <span className="sbmt">{titleText}</span>
              <Box
                sx={{
                  fontSize: 8,
                  fontWeight: 400,
                  width: "140px",
                  marginTop: "-14px", //TODO - remove hacky positioning
                  marginBottom: "8px",
                  letterSpacing: 1,
                  fontFamily: "roboto",
                }}
              >
                Starts May 23rd 2025!!
              </Box>
              <Box sx={{ position: "relative" }}>
                <PwdBy />
              </Box>
            </TitleLink>
            <UserMenu />
          </Box>
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
