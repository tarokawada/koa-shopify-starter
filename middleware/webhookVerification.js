import crypto from "crypto";

module.exports = (ctx, next) => {
  const hmac = ctx.get("X-Shopify-Hmac-Sha256");
  const generated_hash = crypto
    .createHmac("sha256", process.env.SHOPIFY_SECRET)
    .update(ctx.request.rawBody, "utf8", "hex")
    .digest("base64");
  if (generated_hash == hmac) {
    next();
  } else {
    ctx.response.status = 403;
    console.log("webhook error");
  }
};
