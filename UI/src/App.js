import logo from "./logo.svg";
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
