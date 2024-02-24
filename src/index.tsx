import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

if (window.location.search) {
  console.log(
    `index: replacing ${window.location.href} with ${
      window.location.pathname + window.location.hash + window.location.search
    }`
  );
  window.location.replace(
    window.location.pathname + window.location.hash + window.location.search
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
