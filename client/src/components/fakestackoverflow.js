import { useState, useContext, useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import { ApplicationContext } from "../context/ApplicationContext";
import UnauthorizedAccess from "./Login/UnauthorizedAccess";
import isAuthenticated from "../services/authenticationService";

export default function fakeStackOverflow({ app }) {
  const applicationCtx = useContext(ApplicationContext);
  const [search, setSearch] = useState("");
  const [mainTitle, setMainTitle] = useState("All Questions");

  useEffect(() => {
    (async () => {
      const response = await isAuthenticated();
      console.log("response", response);
    })();
  }, []);

  const setQuesitonPage = (search = "", title = "All Questions") => {
    setSearch(search);
    setMainTitle(title);
  };

  return applicationCtx.isAuthenticated ? (
    <>
      <Header setQuesitonPage={setQuesitonPage} search={search} />
      <Main
        search={search}
        setSearch={setSearch}
        app={app}
        title={mainTitle}
        setQuesitonPage={setQuesitonPage}
      />
    </>
  ) : (
    <UnauthorizedAccess />
  );
}
