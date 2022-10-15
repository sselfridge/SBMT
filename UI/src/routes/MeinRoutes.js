import React from "react";
import App from "../App";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Invoices from "routes/invoices";
import Expenses from "routes/expenses";
import DefaultRoute from "routes/DefaultRoute";
import Recent from "components/Recent";
import Leaderboard from "components/Leaderboard";
import Segments from "components/Segments";
import SegmentDetails from "components/SegmentDetail";
import Athletes from "components/Athletes";
import AthleteDetails from "components/AthleteDetail";
import FullFeaturedDemo from "components/DataGridDemo";
import UserSettings from "components/UserSettings";
import HelpContact from "components/HelpContact";
import Info from "components/Info";
import Register from "components/Register";

import AppContext from "AppContext";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import keys from "config";

mapboxgl.accessToken = keys.mapBox;

const MeinRoutes = (props) => {
  console.info("MeinRoutes");
  return (
    <BrowserRouter>
      <Routes>
        {/* <NavBar /> */}
        <Route path="/" element={<Navigate to="/recent" />} />
        <Route path="/" element={<App />}>
          <Route path="recent" element={<Recent />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="segments" element={<Segments />} />
          <Route path="segments/:id" element={<SegmentDetails />} />
          <Route path="athletes" element={<Athletes />} />
          <Route path="athletes/:id" element={<AthleteDetails />} />
          <Route path="demo" element={<FullFeaturedDemo />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="help" element={<HelpContact />} />
          <Route path="info" element={<Info />} />

          <Route
            path="register"
            element={
              <AppContext.Consumer>
                {(context) => <Register {...context} />}
              </AppContext.Consumer>
            }
          />

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
