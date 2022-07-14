import React from "react";
import App from "../App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invoices from "./invoices";
import Expenses from "./expenses";

const RootRoute = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="expenses" element={<Expenses />} />
          <Route path="invoices" element={<Invoices />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RootRoute;
