import crypto from "crypto";
import dotenv from "dotenv";
import {Context} from "koa";
dotenv.config();

const {SHOPIFY_WH} = process.env;

module.exports = (ctx, next) => {
  const hmac = ctx.get("X-Shopify-Hmac-Sha256");
  const generated_hash = crypto
    .createHmac("sha256", SHOPIFY_WH)
    .update(ctx.request.rawBody, "utf8", "hex")
    .digest("base64");
  if (generated_hash == hmac) {
    next();
  } else {
    ctx.response.status = 403;
    console.log("webhook error");
  }
};
