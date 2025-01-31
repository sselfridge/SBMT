import React, { useReducer } from "react";
import PropTypes from "prop-types";
import AppContext from "AppContext";
import AppReducer, { INITIAL_STATE } from "./AppReducer";
import { ApiGet } from "api/api";
import { YEARS } from "utils/constants";
import { isAfter, parseISO } from "date-fns";
function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);

  React.useEffect(() => {
    const { search } = window.location;
    const params = new URLSearchParams(search);
    let year = params.get("year");
    if (YEARS.includes(year) === false) {
      // eslint-disable-next-line prefer-destructuring
      year = YEARS[0];
    }

    ApiGet(`/api?year=${year}`, (arr) => {
      const kickOffDate = parseISO(arr[1]);
      const now = new Date();
      const isPreLaunch = isAfter(kickOffDate, now);

      const settings = {
        env: arr[0],
        kickOffDate,
        endingDate: arr[2],
        redirectUri: arr[3],
        isPreLaunch,
      };
      dispatch({ type: "setSettings", settings });
    });
  }, []);

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
