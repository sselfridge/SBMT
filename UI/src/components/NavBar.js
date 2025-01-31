import React, { useState, useEffect } from "react";
import { AppBar, Box, Toolbar, Tab, Tabs, useMediaQuery } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import DownIcon from "@mui/icons-material/ArrowDropDown";
import AppContext from "AppContext";

import UserMenu from "./UserMenu";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ReactComponent as PwdByStrava } from "assets/stravaBrand/api_logo_pwrdBy_strava_horiz_light.svg";
import { YEARS } from "utils/constants";
import { format, parseISO } from "date-fns";
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

  const { user, env, dispatch, year, kickOffDate } =
    React.useContext(AppContext);
  const [, setSearchParams] = useSearchParams();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const selectYear = (year) => {
    dispatch({ type: "setYear", year });
    setSearchParams((p) => {
      p.set("year", year);
      return p;
    });
    setMenuOpen(false);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const yearMenuRef = React.useRef();

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
    if (title !== "") {
      title = title[0].toUpperCase() + title.slice(1);
      document.title = `SBMT - ${title}`;
    }
  }, [isMobile, pathname]);

  const tabs = ["leaderboard", "segments", "athletes"];

  if (!isMobile && YEARS[0] === year) tabs.unshift("recent");

  let titleText = "SBMT";

  switch (env) {
    case "LocalProd":
      titleText = " LocProd";
      break;
    case "Development":
      titleText = " DEV";
      break;
    case "Staging":
      titleText = " STG";
      break;
    default:
  }

  let kickOffLabel = "";
  try {
    if (kickOffDate) {
      const date = parseISO(kickOffDate);
      kickOffLabel = format(date, "EEE LLL do, yyyy");
    }
  } catch (error) {
    console.error("error: ", error);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box>
            <Box sx={{ display: "flex", fontFamily: "roboto", gap: 1 }}>
              <TitleLink to="recent">
                <span className="sbmt">{titleText}</span>
              </TitleLink>
              <Box
                ref={yearMenuRef}
                onClick={() => setMenuOpen(true)}
                sx={{ display: "flex", alignItems: "center", fontSize: 12 }}
              >
                {year}
                <DownIcon />
              </Box>
              <Menu
                id="basic-menu"
                anchorEl={yearMenuRef.current}
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {YEARS.map((year) => (
                  <MenuItem key={year} onClick={() => selectYear(year)}>
                    {year}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
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
              {kickOffLabel && `Starts ${kickOffLabel}!!`}
            </Box>
            <Box sx={{ position: "relative" }}>
              <PwdBy />
            </Box>

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
