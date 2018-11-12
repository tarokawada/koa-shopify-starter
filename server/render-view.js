import React from "react";
import {renderToString} from "react-dom/server";
import HTML, {DOCTYPE} from "@shopify/react-html";
import App from "../app/App";

export default (ctx, next) => {
  ctx.body =
    DOCTYPE +
    renderToString(
      <HTML scripts={[{path: "bundle.js"}]}>
        <App />
      </HTML>,
    );
  next();
};
