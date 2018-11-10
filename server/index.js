import dotenv from 'dotenv';
import Koa from 'koa';
import session from 'koa-session';
import shopifyAuth, {
  verifyRequest,
} from '@shopify/koa-shopify-auth';
import webpack from 'webpack';
import koaWebpack from 'koa-webpack';
const config = require('../webpack.config.js');
const compiler = webpack(config);
import proxy from '@shopify/koa-shopify-graphql-proxy';
import renderView from './render-view.js';

dotenv.config();
const {SHOPIFY_SECRET, SHOPIFY_API_KEY} = process.env;
const app = new Koa();
app.use(session(app));
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

app.use(verifyRequest());

// app.use(function index(ctx) {
//   console.log('Hello Unite 👋')
//   ctx.body = 'Hello Unite 👋';
// });
koaWebpack({ compiler })
 .then((middleware) => {
  app.use(middleware);
});
app.use(proxy());
app.use(renderView);


export default app;
