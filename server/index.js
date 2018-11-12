import dotenv from 'dotenv';
import Koa from 'koa';
import session from 'koa-session';
import shopifyAuth, {
  verifyRequest,
} from '@shopify/koa-shopify-auth';
import webpack from 'webpack';
import koaWebpack from 'koa-webpack';
import bodyParser from 'koa-bodyparser';
const Router = require('koa-router');
const config = require('../webpack.config.js');
const compiler = webpack(config);
import proxy from '@shopify/koa-shopify-graphql-proxy';
import renderView from './render-view.js';
const crypto = require('crypto');
dotenv.config();

//todo: add knex and postgres

const {SHOPIFY_SECRET, SHOPIFY_API_KEY, SHOPIFY_APP_HOST, SHOPIFY_WH} = process.env;
const app = new Koa();
app.use(session(app));
app.use(bodyParser());
const router = Router();
app.keys = [SHOPIFY_SECRET];
app.use(
  shopifyAuth({
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_SECRET,
    scopes: ['write_products'],
    afterAuth(ctx) {
      const {shop, accessToken} = ctx.session;
      console.log('We did it!', shop, accessToken);
      ctx.redirect('/');
    },
  }),
);

router
  .post('/test', (ctx, next) => {
    ctx.body = "test";
    ctx.response.status = 200;
    console.log('test');
  })
  .post('/webhooks/orders/create', (ctx, next) => {
    console.log('🎉 We got an order!')
    ctx.response.status = 200;
  })
  .post('/webhooks/carts/create', 
    //todo: put it in a proper middleware
    (ctx, next) => {
      const hmac = ctx.get('X-Shopify-Hmac-Sha256')
      const generated_hash = crypto
        .createHmac('sha256', SHOPIFY_WH)
        .update(ctx.request.rawBody, 'utf8', 'hex')
        .digest('base64');
      if (generated_hash == hmac) {
        next()
      } else {
        ctx.response.status = 403;
        console.log('webhook error');
      }
    },
    (ctx, next) => {
    console.log('We got a webhook!');
    console.log('Details: ', ctx.request.webhook);
    console.log('Body:', ctx.request.body);
    //do something with the webhook
  });
app
  .use(router.routes())
  .use(router.allowedMethods());
app.use(verifyRequest());
koaWebpack({ compiler })
 .then((middleware) => {
  app.use(middleware);
});
app
  .use(proxy())
  .use(renderView);
export default app;
