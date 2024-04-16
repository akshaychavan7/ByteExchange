import { useState, useContext } from "react";
import Main from "./Main/Main";
import { ApplicationContext } from "../context/ApplicationContext";
import UnauthorizedAccess from "./Login/UnauthorizedAccess";
import useIsAuthenticated from "../hooks/useIsAuthenticated";
import Loader from "./Utility/Loader/Loader";
import Moderator from "./Moderator/Moderator";

export default function fakeStackOverflow() {
  const applicationCtx = useContext(ApplicationContext);
  const [search, setSearch] = useState("");
  const [mainTitle, setMainTitle] = useState("All Questions");
  useIsAuthenticated();

  const setQuestionPage = (search = "", title = "All Questions") => {
    setSearch(search);
    setMainTitle(title);
  };

  if (applicationCtx.isAuthenticated === "") {
    return <Loader />;
  }

  if (applicationCtx.isAuthenticated && !applicationCtx.isModerator) {
    return (
      <>
        <Main
          search={search}
          setSearch={setSearch}
          title={mainTitle}
          setQuestionPage={setQuestionPage}
        />
      </>
    );
  } else if (applicationCtx.isAuthenticated && applicationCtx.isModerator) {
    return (
      <>
        <Moderator />
      </>
    );
  } else {
    return <UnauthorizedAccess />;
  }
}
