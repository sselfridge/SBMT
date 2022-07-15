import logo from "./logo.svg";
import "./App.css";

import Leaderboard from "./components/Leaderboard";
import { Outlet } from "react-router-dom";
import NavBar from "components/AppHeader";

function App(appProps) {
  console.info("appProps: ", appProps);
  return (
    <div className="App">
      <NavBar />
      <header className="App-header">
        <Outlet />
      </header>
    </div>
  );
}

export default App;
