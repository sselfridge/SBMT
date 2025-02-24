import React, { useReducer } from "react";
import PropTypes from "prop-types";
import AppContext from "AppContext";
import AppReducer, { INITIAL_STATE } from "./AppReducer";
import { ApiGet } from "api/api";
import { isAfter, parseISO } from "date-fns";
import { db } from "utils/helperFuncs";

function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);

  const { year } = state;

  React.useEffect(() => {
    db("settings call");
    ApiGet(`/api?year=${year}`, (arr) => {
      const kickOffDate = parseISO(arr[1]);
      const now = new Date();
      const isPreLaunch = isAfter(kickOffDate, now);

      const settings = {
        env: arr[0],
        kickOffDate: arr[1],
        endingDate: arr[2],
        redirectUri: arr[3],
        isPreLaunch,
      };
      dispatch({ type: "setSettings", settings });
    });
  }, [year]);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContextProvider;
