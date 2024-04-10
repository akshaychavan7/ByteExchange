import { useState, useContext } from "react";
import Header from "./Header/Header";
import Main from "./Main/Main";
import { ApplicationContext } from "../context/ApplicationContext";
import UnauthorizedAccess from "./Login/UnauthorizedAccess";
import useIsAuthenticated from "../hooks/useIsAuthenticated";
import Loader from "./Utility/Loader/Loader";

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

  return applicationCtx.isAuthenticated ? (
    <>
      <Header setQuestionPage={setQuestionPage} search={search} />
      <Main
        search={search}
        setSearch={setSearch}
        title={mainTitle}
        setQuestionPage={setQuestionPage}
      />
    </>
  ) : (
    <UnauthorizedAccess />
  );
}
