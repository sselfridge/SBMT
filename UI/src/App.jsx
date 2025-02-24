import React from "react";
import "mapbox-gl/dist/mapbox-gl.css"; //https://stackoverflow.com/a/50948494
import { Outlet } from "react-router-dom";
import NavBar from "components/NavBar";

import AppContext from "AppContext";
import { ApiGet } from "api/api";

import "./global.css";

import Feedback from "components/Feedback";
import { CircularProgress, Box } from "@mui/material";
import { db } from "utils/helperFuncs";

function App() {
  const { dispatch, user } = React.useContext(AppContext);

  const onSetUser = React.useCallback(
    (user) => {
      db("setUser");
      dispatch({ type: "setUser", user });
    },
    [dispatch]
  );

  const fetchOnce = React.useRef(true);
  React.useEffect(() => {
    if (fetchOnce.current) {
      fetchOnce.current = null;
      //init user here
      db("User Call");
      ApiGet("/api/athletes/current", onSetUser, {});
    }
  }, [onSetUser]);

  const navBar = document.getElementById("SBMTmainNavBar");
  const navBarHeight = navBar?.offsetHeight || 150;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <NavBar />
      <Box
        sx={{
          backgroundColor: "#282c34",
          minHeight: `calc(100vh - ${navBarHeight}px)`,
          display: "flex",
          WebkitFlexDirection: "column",
          MsFlexDirection: "column",
          flexDirection: "column",
          WebkitAlignItems: "center",
          WebkitBoxAlign: "center",
          MsFlexAlign: "center",
          alignItems: "center",
          fontSize: "calc(10px + 1vmin)",
          color: "white",
        }}
      >
        {!user ? <CircularProgress /> : <Outlet />}
      </Box>
      <Feedback />
    </Box>
  );
}

export default App;
