import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import theme from "theme/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers";
import MeinRoutes from "./routes/MeinRoutes";

import { db } from "utils/helperFuncs";
import ContextProvider from "ContextProvider";

db("Initial Root");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <ContextProvider>
          <MeinRoutes />
        </ContextProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
