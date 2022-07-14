import React from "react";
import App from "../App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invoices from "routes/invoices";
import Expenses from "routes/expenses";
import NavBar from "components/AppHeader";

const MeinRoutes = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <NavBar /> */}
        <Route path="/" element={<App />}>
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
