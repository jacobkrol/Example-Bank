import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

if (window.location.pathname.match(/(?<=\/Example-Book\/)\w+/)) {
  window.location.replace(
    "/Example-Book/#/" +
      window.location.pathname.replace("/Example-Book/", "") +
      window.location.search
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();
reportWebVitals();
