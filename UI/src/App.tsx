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
import { getCurrentAthlete } from "services/sbmt";

import type { User } from "./types/StravaUserDTO";

function App() {
  const { dispatch, user } = React.useContext(AppContext);

  const commitHash = import.meta.env.VITE_GIT_COMMIT;
  console.log("commitHash: ", commitHash);

  const onSetUser = React.useCallback(
    (user: User) => {
      db("setUser");
      dispatch({ type: "setUser", user });
    },
    [dispatch],
  );

  const fetchOnce = React.useRef<Boolean | null>(true);
  React.useEffect(() => {
    const initUserFetch = async (retry = true) => {
      //init user here
      db("User Call");
      try {
        const currentAthlete = await getCurrentAthlete();
        onSetUser(currentAthlete);
      } catch (e) {
        // await new Promise((r) => setTimeout(r, 350));
        if (retry) initUserFetch(false);
      }
    };

    if (fetchOnce.current) {
      fetchOnce.current = null;
      initUserFetch();
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
