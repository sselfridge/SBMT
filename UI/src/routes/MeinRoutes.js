import React from "react";
import App from "../App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import InfoScopes from "components/InfoScopes";
import Register from "components/Register";
import Beta from "components/Beta";
import BetaRedirect from "./BetaRedirect";
import Thanks from "components/Thanks";
import LandingPage from "components/LandingPage/LandingPage";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import config from "config";

mapboxgl.accessToken = config.mapBox;

const MeinRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <NavBar /> */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/" element={<App />}>
          <Route path="beta" element={<Beta />} />
          <Route path="beta/*" element={<BetaRedirect />} />
          <Route path="recent" element={<Recent />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="segments" element={<Segments />} />
          <Route path="segments/:segmentId" element={<SegmentDetails />} />
          <Route path="athletes" element={<Athletes />} />
          <Route path="athletes/:athleteId" element={<AthleteDetails />} />
          <Route path="demo" element={<FullFeaturedDemo />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="help" element={<HelpContact />} />
          <Route path="info">
            <Route path="" element={<Info />} />
            <Route path="scopes" element={<InfoScopes />} />
          </Route>
          <Route path="thanks" element={<Thanks />} />

          <Route path="register" element={<Register />} />

          <Route path="*" element={<DefaultRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MeinRoutes;
