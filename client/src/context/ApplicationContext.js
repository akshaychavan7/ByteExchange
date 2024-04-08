import React, { createContext, useReducer } from "react";

// Create a context object
export const ApplicationContext = createContext();

const initialState = {
  isAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_IS_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };
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
