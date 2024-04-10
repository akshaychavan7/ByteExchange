// define a custom hook to check if user is authenticated

import { useContext, useEffect } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import isAuthenticated from "../services/authenticationService";

export default function useIsAuthenticated() {
  const applicationCtx = useContext(ApplicationContext);

  useEffect(() => {
    (async () => {
      const response = await isAuthenticated();
      applicationCtx.dispatch({
        type: "SET_IS_AUTHENTICATED",
        payload: response,
      });
    })();
  }, []);
  return;
}
