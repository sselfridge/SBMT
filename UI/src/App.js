import logo from "./logo.svg";
import "./App.css";

import Leaderboard from "./components/Leaderboard";
import { Outlet, Link } from "react-router-dom";
import NavBar from "./components/NavBar";

function App(appProps) {
  console.info("appProps: ", appProps);
  return (
    <div className="App">
      <NavBar />
      <header className="App-header">
        <Leaderboard />
        <Outlet />
      </header>
    </div>
  );
}

export default App;
