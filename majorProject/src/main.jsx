import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Appapp from "./Appapp.jsx";
import "./index.css"; // optional, but usually exists
import HomePage from "./HomePage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Appapp/>
  </React.StrictMode>
);
