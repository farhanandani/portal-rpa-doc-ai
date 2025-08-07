import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import TanstackQueryProvider from "./lib/TanstackQueryProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <TanstackQueryProvider>
        <App />
      </TanstackQueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
