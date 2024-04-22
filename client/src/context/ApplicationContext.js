import React, { createContext, useReducer } from "react";
import { constants } from "../config";

// Create a context object
export const ApplicationContext = createContext();

const initialState = {
  isAuthenticated: "",
  isModerator: "",
};

const reducer = (state, action) => {
  if (action.type === constants.SET_IS_AUTHENTICATED && action.payload) {
    return { ...state, isAuthenticated: action.payload };
  } else if (action.type === constants.SET_IS_MODERATOR) {
    return { ...state, isModerator: action.payload };
  } else {
    return { ...state, isAuthenticated: false, isModerator: false };
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
