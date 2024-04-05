// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import React from "react";
import "./stylesheets/App.css";
import FakeStackOverflow from "./components/fakestackoverflow.js";
import data from "./data/model.js";
import Application from "./models/application";
function App() {
  const app = new Application(data);
  return <FakeStackOverflow app={app} />;
}

export default App;
