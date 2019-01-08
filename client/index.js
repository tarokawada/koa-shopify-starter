import "isomorphic-fetch";
import * as React from "react";
import {render} from "react-dom";
import App from "../app/App.js";

function renderApp() {
  render(<App />, document.getElementById("app"));
}

renderApp();

if (module.hot) {
  module.hot.accept();
}
