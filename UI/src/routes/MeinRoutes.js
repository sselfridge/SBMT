import React from "react";
import App from "../App";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Invoices from "routes/invoices";
import Expenses from "routes/expenses";
import DefaultRoute from "routes/DefaultRoute";
import Leaderboard from "components/Leaderboard";
import Segments from "components/Segments";
import SegmentDetails from "components/SegmentDetails";
import Athletes from "components/Athletes";
import AthleteDetails from "components/AthleteDetail";
import FullFeaturedDemo from "components/DataGridDemo";
import UserSettings from "components/UserSettings";

const MeinRoutes = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <NavBar /> */}
        <Route path="/" element={<Navigate to="/leaderboard" />} />
        <Route path="/" element={<App />}>
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="segments" element={<Segments />} />
          <Route path="segments/:id" element={<SegmentDetails />} />
          <Route path="athletes" element={<Athletes />} />
          <Route path="athletes/:id" element={<AthleteDetails />} />
          <Route path="demo" element={<FullFeaturedDemo />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="invoices" element={<Invoices />}>
            <Route path="expenses" element={<Expenses />} />
          </Route>
          <Route path="*" element={<DefaultRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MeinRoutes;
