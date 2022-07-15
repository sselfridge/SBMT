import React from "react";
import App from "../App";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Invoices from "routes/invoices";
import Expenses from "routes/expenses";
import NavBar from "components/AppHeader";
import Leaderboard from "components/Leaderboard";
import Segments from "components/Segments";

const MeinRoutes = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <NavBar /> */}
        <Route path="/" element={<Navigate to="/expenses" />} />
        <Route path="/" element={<App />}>
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="segments" element={<Segments />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="invoices" element={<Invoices />}>
            <Route path="expenses" element={<Expenses />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MeinRoutes;
