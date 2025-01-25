import React, { useContext } from "react";
import App from "../App";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import TeresaWon from "./TeresaWon";
import NotFound from "routes/NotFound";
import Recent from "components/Recent";
import Leaderboard from "components/Leaderboard";
import Segments from "components/Segments";
import SegmentDetails from "components/SegmentDetail";
import Athletes from "components/Athletes";
import NewEffort from "components/NewEffort";
import AthleteDetails from "components/AthleteDetail";
import UserSettings from "components/UserSettings";
import HelpContact from "components/HelpContact";
import Info from "components/Info";
import InfoScopes from "components/InfoScopes";
import InfoTerms from "components/InfoTerms";
import UserInfo from "components/UserInfo";
import BetaRedirect from "./BetaRedirect";
import Landing from "components/LandingPage/LandingPage";

import Admin from "components/Admin/Admin";
import AdminSegments from "components/Admin/AdminSegments";

import AdminUsers from "components/Admin/AdminUsers";
import AdminFeedback from "components/Admin/AdminFeedback";
import AppContext from "AppContext";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import config from "config";
import StravaOops from "components/StravaOops";
// import TempCountdown from "components/LandingPage/TempCountdown";

mapboxgl.accessToken = config.mapBox;

const MeinRoutes = () => {
  const { user, isPreLaunch } = useContext(AppContext);

  const isAdmin = user?.athleteId === 1075670;

  const showLanding = !isAdmin && isPreLaunch; //TODO admin isn't loaded here so it always get redirected...

  return (
    <BrowserRouter>
      <Routes>
        {/* <NavBar /> */}
        {showLanding ? (
          <Route path="/" element={<Landing />} />
        ) : (
          <Route path="/" element={<Navigate to="/recent" />} />
        )}

        <Route path="/" element={<App />}>
          {showLanding ? (
            <Route path="*" element={<Navigate to="/" />} />
          ) : (
            <>
              <Route path="teresa" element={<TeresaWon />} />

              <Route path="beta/*" element={<BetaRedirect />} />
              <Route path="recent" element={<Recent />} />
              <Route path="leaderboard" element={<Leaderboard />} />

              <Route path="segments" element={<Segments />} />
              <Route path="segments/:segmentId" element={<SegmentDetails />} />
              <Route path="athletes" element={<Athletes />} />
              <Route path="athletes/:athleteId" element={<AthleteDetails />} />
              <Route path="newEffort" element={<NewEffort />} />
              <Route path="settings" element={<UserSettings />} />
              <Route path="help" element={<HelpContact />} />
              <Route path="info">
                <Route path="" element={<Info />} />
                <Route path="scopes" element={<InfoScopes />} />
                <Route path="terms" element={<InfoTerms />} />
              </Route>

              <Route path="UserInfo" element={<UserInfo />} />
              <Route path="StravaOops" element={<StravaOops />} />
            </>
          )}

          {isAdmin && (
            <Route path="admin">
              <Route path="" element={<Admin />} />
              <Route path="segments" element={<AdminSegments />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="feedback" element={<AdminFeedback />} />
            </Route>
          )}

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MeinRoutes;
