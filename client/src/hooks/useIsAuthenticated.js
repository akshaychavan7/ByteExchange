// define a custom hook to check if user is authenticated

import { useContext, useEffect } from "react";
import { ApplicationContext } from "../context/ApplicationContext";
import isAuthenticated from "../services/authenticationService";
import isModeratorAuthenticated from "../services/authenticationModeratorService";
import { constants } from "../config";
export default function useIsAuthenticated() {
  const applicationCtx = useContext(ApplicationContext);

  useEffect(() => {
    (async () => {
      const response = await isAuthenticated();
      applicationCtx.dispatch({
        type: constants.SET_IS_AUTHENTICATED,
        payload: response,
      });

      const moderatorResponse = await isModeratorAuthenticated();
      applicationCtx.dispatch({
        type: constants.SET_IS_MODERATOR,
        payload: moderatorResponse,
      });
    })();
  }, []);
  return;
}
