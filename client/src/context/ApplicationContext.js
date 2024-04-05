import React, { createContext, useState } from "react";

// Create a context object
export const ApplicationContext = createContext();

// Create a provider component
export const ApplicationContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to set the token
  const handleIsAuthenticated = (flag) => {
    setIsAuthenticated(flag);
  };

  // Context value to be passed to consumers
  const applicationContextValue = {
    isAuthenticated,
    setIsAuthenticated: handleIsAuthenticated,
  };

  return (
    <ApplicationContext.Provider value={applicationContextValue}>
      {children}
    </ApplicationContext.Provider>
  );
};
