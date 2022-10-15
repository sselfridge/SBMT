import React, { useReducer } from "react";
import "mapbox-gl/dist/mapbox-gl.css"; //https://stackoverflow.com/a/50948494
import { Outlet } from "react-router-dom";
import NavBar from "components/NavBar";
import AppReducer from "./AppReducer";
import AppContext from "AppContext";

function App(appProps) {
  const [state, dispatch] = useReducer(AppReducer, { user: {}, rank: 12 });

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
