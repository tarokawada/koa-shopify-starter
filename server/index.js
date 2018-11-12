import dotenv from "dotenv";
import Koa from "koa";
import session from "koa-session";
import shopifyAuth, {verifyRequest} from "@shopify/koa-shopify-auth";
import webpack from "webpack";
import koaWebpack from "koa-webpack";
import bodyParser from "koa-bodyparser";
const Router = require("koa-router");
import proxy from "@shopify/koa-shopify-graphql-proxy";
import renderView from "./render-view.js";
import webhookVerification from "../middleware/webhookVerification";
dotenv.config();

//todo: add sqlize and post

const {SHOPIFY_SECRET, SHOPIFY_API_KEY, SHOPIFY_WH} = process.env;
const app = new Koa();
app.keys = [SHOPIFY_SECRET];
app.use(session(app));
app.use(bodyParser());
const router = Router();
app.use(
  shopifyAuth({
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_SECRET,
    scopes: ["write_products"],
    afterAuth(ctx) {
      const {shop, accessToken} = ctx.session;
      console.log("We did it!", shop, accessToken);
      //todo: install webhooks -> uninstall.
      ctx.redirect("/");
    },
  }),
);
router.use(["/test"], verifyRequest()); //request must be logged in
router.use(["/webhooks"], webhookVerification); //webhook skips verifyRequest but verified with hmac
//todo: route for uninstalls.
router
  .post("/test", (ctx, next) => {
    ctx.body = "test";
    ctx.response.status = 200;
    console.log("test");
  })
  .post("/webhooks/carts/create", (ctx, next) => {
    console.log("We got a webhook!");
    console.log("Details: ", ctx.request.webhook);
    console.log("Body:", ctx.request.body);
    //do something with the webhook
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
