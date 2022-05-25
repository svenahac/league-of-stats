import React from "react";
import ReactDOM from "react-dom/client";
import { Router, Routes } from "react-router-dom";
import "./assets/index.css";
import { Home } from "./pages";
import { PlayerPage } from "./pages";
import { BrowserRouter, Route, Link } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Home />}></Route>
        <Route path="/summoners/:id" element={<PlayerPage />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
