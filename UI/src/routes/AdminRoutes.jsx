import { Route } from "react-router-dom";
import Admin from "components/Admin/Admin";
import AdminSegments from "components/Admin/AdminSegments";

const adminRoutes = [
  <Route path="admin">
    <Route path="" element={<Admin />} />
    <Route path="segments" element={<AdminSegments />} />
  </Route>,
];

export default adminRoutes;
