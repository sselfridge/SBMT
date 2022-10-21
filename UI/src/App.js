import React, { useReducer } from "react";
import "mapbox-gl/dist/mapbox-gl.css"; //https://stackoverflow.com/a/50948494
import { Outlet } from "react-router-dom";
import NavBar from "components/NavBar";

import AppReducer, { INITIAL_STATE } from "./AppReducer";

import AppContext from "AppContext";

import "./global.css";

function App(appProps) {
  const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      <div className="App">
        <NavBar />
        <main className="App-Body">
          <Outlet /> {/* see MeinRoutes for value of outlet */}
        </main>
      </div>
    </AppContext.Provider>
  );
}

export default App;
