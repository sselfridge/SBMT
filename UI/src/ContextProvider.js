import React, { useReducer } from "react";
import PropTypes from "prop-types";
import AppContext from "AppContext";
import AppReducer, { INITIAL_STATE } from "./AppReducer";
import { ApiGet } from "api/api";
import { DateTime } from "luxon";
import { db } from "utils/helperFuncs";

function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);

  const { year } = state;

  React.useEffect(() => {
    db("settings call");
    ApiGet(`/api?year=${year}`, (arr) => {
      const [env, kickOffDate, endingDate, redirectUri] = arr;

      const endDate = DateTime.fromISO(endingDate).plus({ weeks: 1 });
      const startDate = DateTime.fromISO(kickOffDate);
      const isPostSeason = endDate < DateTime.now();
      const isPreSeason = DateTime.now() < startDate;

      const settings = {
        env,
        kickOffDate,
        endingDate,
        redirectUri,
        isPreSeason,
        isPostSeason,
        isOffSeason: isPostSeason || isPreSeason,
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
