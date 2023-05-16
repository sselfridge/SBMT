import React, { useReducer } from "react";
import PropTypes from "prop-types";
import AppContext from "AppContext";
import AppReducer, { INITIAL_STATE } from "./AppReducer";

function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);

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
