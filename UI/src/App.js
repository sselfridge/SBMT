import React from "react";
import "mapbox-gl/dist/mapbox-gl.css"; //https://stackoverflow.com/a/50948494
import { Outlet } from "react-router-dom";
import NavBar from "components/NavBar";

import AppContext from "AppContext";
import { ApiGet } from "api/api";

import "./global.css";
import Feedback from "components/Feedback";
import { CircularProgress } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { YEARS } from "utils/constants";

function App() {
  const { dispatch, year } = React.useContext(AppContext);
  const [loading, setLoading] = React.useState({ user: true, year: true });

  const [, setSearchParams] = useSearchParams();
  const onSetUser = React.useCallback(
    (user) => {
      dispatch({ type: "setUser", user });
      setLoading((loading) => {
        loading.user = false;
        return { ...loading };
      });
    },
    [dispatch]
  );

  React.useEffect(() => {
    let newYear = year;
    if (YEARS.includes(newYear) === false) {
      // eslint-disable-next-line prefer-destructuring
      newYear = YEARS[0];

      setSearchParams((search) => {
        search.set("year", newYear);
        return search;
      });
      dispatch({ type: "setYear", year: newYear });
    } else {
      setLoading((loading) => {
        loading.year = false;
        return { ...loading };
      });
    }
  }, [dispatch, setSearchParams, year]);

  const fetchOnce = React.useRef(true);
  React.useEffect(() => {
    //TODO - move this sooner in the render chain
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
        {loading.user || loading.year ? <CircularProgress /> : <Outlet />}
      </main>
      <Feedback />
    </div>
  );
}

export default App;
