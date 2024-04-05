import { useState, useContext } from "react";
import Header from "./Header";
import Main from "./Main";
import { ApplicationContext } from "../context/ApplicationContext";
import UnauthorizedAccess from "./Login/UnauthorizedAccess";

export default function fakeStackOverflow({ app }) {
  const { isAuthenticated } = useContext(ApplicationContext);
  const [search, setSearch] = useState("");
  const [mainTitle, setMainTitle] = useState("All Questions");

  const setQuesitonPage = (search = "", title = "All Questions") => {
    setSearch(search);
    setMainTitle(title);
  };

  return isAuthenticated ? (
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
