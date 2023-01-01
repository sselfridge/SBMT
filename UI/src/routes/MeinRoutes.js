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
import InfoScopes from "components/InfoScopes";
import UserInfo from "components/UserInfo";
import Beta from "components/Beta";
import BetaRedirect from "./BetaRedirect";
import Thanks from "components/Thanks";
import LandingPage from "components/LandingPage/LandingPage";

import Admin from "components/Admin/Admin";
import AdminSegments from "components/Admin/AdminSegments";

import AdminUsers from "components/Admin/AdminUsers";

import AppContext from "AppContext";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import config from "config";
import StravaOops from "components/StravaOops";

mapboxgl.accessToken = config.mapBox;

const MeinRoutes = () => {
  const { user } = useContext(AppContext);

  const isAdmin = user?.athleteId === 1075670;

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

          <Route path="UserInfo" element={<UserInfo />} />
          <Route path="StravaOops" element={<StravaOops />} />

          {isAdmin && (
            <Route path="admin">
              <Route path="" element={<Admin />} />
              <Route path="segments" element={<AdminSegments />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          )}

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MeinRoutes;
