import dotenv from "dotenv";
import Koa from "koa";
import session from "koa-session";
import koaWebpack from "koa-webpack";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import shopifyAuth, {verifyRequest} from "@shopify/koa-shopify-auth";
import webpack from "webpack";
import proxy from "@shopify/koa-shopify-graphql-proxy";
import renderView from "./render-view.js";
const ShopifyAPIClient = require("shopify-api-node");
import webhookVerification from "../middleware/webhookVerification";
dotenv.config();

//todo: add sqlize and post
const registerWebhook = function(shopDomain, accessToken, webhook) {
  const shopify = new ShopifyAPIClient({
    shopName: shopDomain,
    accessToken: accessToken,
  });
  shopify.webhook
    .create(webhook)
    .then(
      (response) => console.log(`webhook '${webhook.topic}' created`),
      (err) =>
        console.log(
          `Error creating webhook '${webhook.topic}'. ${JSON.stringify(
            err.response.body,
          )}`,
        ),
    );
};
const {SHOPIFY_SECRET, SHOPIFY_API_KEY, SHOPIFY_APP_HOST} = process.env;
const app = new Koa();
app.keys = [SHOPIFY_SECRET];
app.use(session(app));
app.use(bodyParser());
const router = Router();
app.use(
  shopifyAuth({
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_SECRET,
    scopes: ["write_products", "read_themes", "write_themes"],
    afterAuth(ctx) {
      const {shop, accessToken} = ctx.session;
      registerWebhook(shop, accessToken, {
        topic: "themes/create",
        address: `${SHOPIFY_APP_HOST}/webhooks/themes/create`,
        format: "json",
      });
      registerWebhook(shop, accessToken, {
        topic: "themes/delete",
        address: `${SHOPIFY_APP_HOST}/webhooks/themes/delete`,
        format: "json",
      });
      ctx.redirect("/");
    },
  }),
);
router.use(["/test"], verifyRequest()); //request must be logged in
router.use(["/webhooks"], webhookVerification); //webhook skips verifyRequest but verified with hmac
router
  .post("/webhooks/themes/create", (ctx, next) => {
    console.log("We got a webhook!");
    console.log("Body:", ctx.request.body);
    ctx.response.status = 200;
  })
  .post("/webhooks/themes/delete", (ctx, next) => {
    console.log("We got a webhook!");
    console.log("Body:", ctx.request.body);
    ctx.response.status = 200;
  });
app.use(router.routes()).use(router.allowedMethods());
app.use(verifyRequest());
const config = require("../webpack.config.js");
const compiler = webpack(config);
koaWebpack({compiler}).then((middleware) => {
  app.use(middleware);
});
app.use(proxy()).use(renderView);
export default app;
