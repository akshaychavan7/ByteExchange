import { useState } from "react";
import Header from "./Header";
import Main from "./Main";

export default function fakeStackOverflow({ app }) {
  const [search, setSearch] = useState("");
  const [mainTitle, setMainTitle] = useState("All Questions");

  const setQuesitonPage = (search = "", title = "All Questions") => {
    setSearch(search);
    setMainTitle(title);
  };

  return (
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
  );
}
