import React, { useReducer } from "react";
import PropTypes from "prop-types";
import AppContext from "AppContext";
import AppReducer, { INITIAL_STATE } from "./AppReducer";
import { ApiGet } from "api/api";

function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);

  React.useEffect(() => {
    ApiGet("/api", (arr) => {
      const settings = {
        env: arr[0],
        kickOffDate: arr[1],
        endingDate: arr[2],
        redirectUri: arr[3],
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
