import logo from "./logo.svg";
import "./App.css";
import Leaderboard from "./components/Leaderboard";
import { ThemeProvider, styled } from "@mui/material/styles";
import theme from "./theme/theme";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ThemeProvider theme={theme}>
          <Leaderboard />
        </ThemeProvider>
      </header>
    </div>
  );
}

export default App;
