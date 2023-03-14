import React from "react";
import "mapbox-gl/dist/mapbox-gl.css"; //https://stackoverflow.com/a/50948494
import { Outlet } from "react-router-dom";
import NavBar from "components/NavBar";

import "./global.css";
import Feedback from "components/Feedback";

function App() {
  return (
    <div className="App">
      <NavBar />
      <main className="App-Body">
        <Outlet /> {/* see MeinRoutes for value of outlet */}
      </main>
      <Feedback />
    </div>
  );
}

export default App;
