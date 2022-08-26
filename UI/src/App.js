//https://stackoverflow.com/a/50948494
import "mapbox-gl/dist/mapbox-gl.css";
import { Outlet } from "react-router-dom";
import NavBar from "components/AppHeader";

function App(appProps) {
  return (
    <div className="App">
      <NavBar />
      <main className="App-Body">
        <Outlet /> {/* see MeinRoutes for value of outlet */}
      </main>
    </div>
  );
}

export default App;
