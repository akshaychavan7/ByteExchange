import React, { createContext, useReducer } from "react";
import { constants } from "../config";

// Create a context object
export const ApplicationContext = createContext();

const initialState = {
  isAuthenticated: "",
  isModerator: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case constants.SET_IS_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    case constants.SET_IS_MODERATOR:
      return { ...state, isModerator: action.payload };
    default:
      return state;
  }
};

// Create a provider component
export const ApplicationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ApplicationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ApplicationContext.Provider>
  );
};
