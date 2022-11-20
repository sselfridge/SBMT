import React, { useContext } from "react";
import App from "../App";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFound from "routes/NotFound";
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
import Beta from "components/Beta";
import Thanks from "components/Thanks";
import LandingPage from "components/LandingPage/LandingPage";

import Admin from "components/Admin/Admin";
import AdminSegments from "components/Admin/AdminSegments";

import AppContext from "AppContext";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import keys from "config";

mapboxgl.accessToken = keys.mapBox;

const MeinRoutes = (props) => {
  const { user } = useContext(AppContext);

  const isAdmin = user?.athleteId === 1075670;

  return (
    <BrowserRouter>
      <Routes>
        {/* <NavBar /> */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/beta" element={<App />}>
          <Route
            path="/beta"
            element={
              <AppContext.Consumer>
                {(context) => <Beta {...context} />}
              </AppContext.Consumer>
            }
          />
          <Route path="recent" element={<Recent />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="segments" element={<Segments />} />
          <Route path="segments/:segmentId" element={<SegmentDetails />} />
          <Route path="athletes" element={<Athletes />} />
          <Route path="athletes/:athleteId" element={<AthleteDetails />} />
          <Route path="demo" element={<FullFeaturedDemo />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="help" element={<HelpContact />} />
          <Route path="info" element={<Info />} />
          <Route path="thanks" element={<Thanks />} />

          <Route path="register" element={<Register />} />

          {isAdmin && (
            <Route path="admin">
              <Route path="" element={<Admin />} />
              <Route path="segments" element={<AdminSegments />} />
            </Route>
          )}

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MeinRoutes;
