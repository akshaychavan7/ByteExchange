// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./stylesheets/App.css";
import FakeStackOverflow from "./components/fakestackoverflow.js";
import data from "./data/model.js";
import Application from "./models/application";
import Login from "./components/Login/Login.js";
import SignUp from "./components/Login/SignUp/SignUp.js";
function App() {
  const app = new Application(data);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<FakeStackOverflow app={app} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
