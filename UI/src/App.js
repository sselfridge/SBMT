import logo from "./logo.svg";
//https://stackoverflow.com/a/50948494
import "mapbox-gl/dist/mapbox-gl.css";

import "./App.css";

import Leaderboard from "./components/Leaderboard";
import { Outlet } from "react-router-dom";
import NavBar from "components/AppHeader";

function App(appProps) {
  return (
    <div className="App">
      <NavBar />
      <main className="App-header">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
