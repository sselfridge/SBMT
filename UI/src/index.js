import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import theme from "theme/theme";
import CssBaseline from "@mui/material/CssBaseline";

// import reportWebVitals from "./reportWebVitals";

import MeinRoutes from "./routes/MeinRoutes";
import ContextProvider from "ContextProvider";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ContextProvider>
        <MeinRoutes />
      </ContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
