import React from "react";
import "mapbox-gl/dist/mapbox-gl.css"; //https://stackoverflow.com/a/50948494
import { Outlet } from "react-router-dom";
import NavBar from "components/NavBar";

import AppContext from "AppContext";
import { ApiGet } from "api/api";

import "./global.css";

import Feedback from "components/Feedback";
import { CircularProgress } from "@mui/material";
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

  return (
    <div className="App">
      <NavBar />
      <main className="App-Body">
        {!user ? <CircularProgress /> : <Outlet />}
      </main>
      <Feedback />
    </div>
  );
}

export default App;
