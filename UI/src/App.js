import React from "react";
import "mapbox-gl/dist/mapbox-gl.css"; //https://stackoverflow.com/a/50948494
import { Outlet } from "react-router-dom";
import NavBar from "components/NavBar";

import AppContext from "AppContext";
import { ApiGet } from "api/api";

import "./global.css";
import Feedback from "components/Feedback";
import { CircularProgress } from "@mui/material";

function App() {
  const { dispatch } = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(true);

  const onSetUser = React.useCallback(
    (user) => {
      dispatch({ type: "setUser", user });
      setLoading(false);
    },
    [dispatch]
  );

  const fetchOnce = React.useRef(true);
  React.useEffect(() => {
    if (fetchOnce.current) {
      fetchOnce.current = null;
      //init user here
      ApiGet("/api/athletes/current", onSetUser, {});
    }
  }, [onSetUser]);

  return (
    <div className="App">
      <NavBar />
      <main className="App-Body">
        {loading && <CircularProgress />}
        {!loading && <Outlet />} {/* see MeinRoutes for value of outlet */}
      </main>
      <Feedback />
    </div>
  );
}

export default App;
