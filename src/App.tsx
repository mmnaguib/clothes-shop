import React from "react";
import logo from "./logo.svg";
import "./App.css";
import SettingsPage from "./Pages/settings/Config";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <SettingsPage />
      <ToastContainer />
    </div>
  );
}

export default App;
