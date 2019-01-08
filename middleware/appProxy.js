import crypto from "crypto";
import _ from "lodash/core";
const querystring = require("querystring");

module.exports = async (ctx, next) => {
  const queryString = ctx.request.url;
  const query = querystring.parse(queryString);
  const signature = query.signature;
  delete query["signature"];
  var input = [];
  _.forEach(query, function(v, k) {
    if (Array.isArray(v)) {
      var value = v.join(",");
    } else {
      var value = v;
    }
    if (k.includes("?shop")) {
      k = "shop";
    }
    var x = `${k}=${value}`;
    input.push(x);
  });
  const generated_hash = crypto
    .createHmac("sha256", process.env.SHOPIFY_SECRET)
    .update(input.sort().join(""))
    .digest("hex");
  if (signature !== generated_hash) {
    ctx.response.status = 403;
    console.log("error");
  } else {
    await next();
  }
};
