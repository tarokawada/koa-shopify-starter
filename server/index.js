import dotenv from "dotenv";
import Koa from "koa";
var serve = require("koa-static");
import mount from "koa-mount";
import views from "koa-views";
import path from "path";
import session from "koa-session";
import koaWebpack from "koa-webpack";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import shopifyAuth, {verifyRequest} from "@shopify/koa-shopify-auth";
import webpack from "webpack";
import proxy from "@shopify/koa-shopify-graphql-proxy";
const ShopifyAPIClient = require("shopify-api-node");
import webhookVerification from "../middleware/webhookVerification";
import appProxy from "../middleware/appProxy";
dotenv.config();

const {
  SHOPIFY_SECRET,
  SHOPIFY_API_KEY,
  SHOPIFY_APP_HOST,
  NODE_ENV,
} = process.env;

//todo: add any database you want.

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
const app = new Koa();
const isDev = NODE_ENV !== "production";
app.use(views(path.join(__dirname, "views"), {extension: "ejs"}));
app.keys = [SHOPIFY_SECRET];
app.use(session(app));
app.use(bodyParser());
const router = Router();
app.use(
  shopifyAuth({
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_SECRET,
    scopes: [
      "write_products",
      "read_themes",
      "write_themes",
      "read_script_tags",
      "write_script_tags",
    ],
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
app.use(serve(__dirname + "/public"));
if (isDev) {
  const config = require("../webpack.config.js");
  const compiler = webpack(config);
  koaWebpack({compiler}).then((middleware) => {
    app.use(middleware);
  });
} else {
  const staticPath = path.resolve(__dirname, "../");
  app.use(mount("/", serve(staticPath)));
}

router.get("/install", (ctx) => ctx.render("install"));
router.use(["/api"], verifyRequest()); //all requests with /api must be verified.
router.use(["/webhooks"], webhookVerification); //webhook skips verifyRequest but verified with hmac
require("./routes/webhookRoutes")(router);
require("./routes/customRoutes")(router);

app.use(router.routes()).use(router.allowedMethods());
app.use(
  verifyRequest({
    fallbackRoute: "/install",
  }),
);
app.use(proxy());
app.use(async (ctx, next) => {
  await next();
  if (ctx.status === 404) {
    return ctx.render("app", {
      title: "Delete Me",
      apiKey: ctx.session.accessToken,
      shop: ctx.session.shop,
    });
  }
});
export default app;
