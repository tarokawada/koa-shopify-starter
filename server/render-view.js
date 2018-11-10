import React from 'react';
import {renderToString} from 'react-dom/server';
import HTML, {Script, DOCTYPE} from '@shopify/react-html';

import App from '../app/App';

export default (ctx, next) => {
  // we have to prepend DOCTYPE to serve valid HTML
  console.log(ctx.session)
  ctx.body = DOCTYPE + renderToString(
    <HTML scripts={[{path: 'bundle.js'}]}>
      <App />
    </HTML>
  );

  next();
}