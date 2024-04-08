import { useState, useContext } from "react";
import Header from "./Header/Header";
import Main from "./Main";
import { ApplicationContext } from "../context/ApplicationContext";
import UnauthorizedAccess from "./Login/UnauthorizedAccess";
import useIsAuthenticated from "../hooks/useIsAuthenticated";

export default function fakeStackOverflow({ app }) {
  const applicationCtx = useContext(ApplicationContext);
  const [search, setSearch] = useState("");
  const [mainTitle, setMainTitle] = useState("All Questions");
  useIsAuthenticated();

  const setQuestionPage = (search = "", title = "All Questions") => {
    setSearch(search);
    setMainTitle(title);
  };

  return applicationCtx.isAuthenticated ? (
    <>
      <Header setQuestionPage={setQuestionPage} search={search} />
      <Main
        search={search}
        setSearch={setSearch}
        app={app}
        title={mainTitle}
        setQuestionPage={setQuestionPage}
      />
    </>
  ) : (
    <UnauthorizedAccess />
  );
}
