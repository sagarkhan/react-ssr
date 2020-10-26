import React from 'react';
import serialize from 'serialize-javascript';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { renderToNodeStream } from 'react-dom/server';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import path from 'path';
import App from '../../client/app/app';
import configureStore from '../../client/store/createStore';
import logger from '../utils/logger';
import { TEMPLATE } from '../utils/helpers';

const templateHandler = async (req, res, template = TEMPLATE) => {
  logger.info('Requesting Template');
  logger.debug(`Request BODY ${JSON.stringify(req.body)}`);
  const { token = '', agent = '', timestamp = '' } = req.body;
  const context = {};
  const initialState = {};
  const { store } = configureStore(initialState);
  const extractor = new ChunkExtractor({
    statsFile: path.resolve('build/loadable-stats.json'),
    entrypoints: ['client'],
  });

  const jsx = (
    <ChunkExtractorManager extractor={extractor}>
      <Provider store={store}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </Provider>
    </ChunkExtractorManager>
  );
  const componentStream = renderToNodeStream(jsx);
  const finalState = store.getState();
  const session = {
    token,
    agent,
    timestamp,
  };

  logger.info('Injecting session');
  logger.info(`${JSON.stringify(session)}`);

  if (context.url) {
    res.redirect(context.url);
  } else {
    const htmlStart = `
      <!doctype html>
        <html lang="en">
        <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta charset="utf-8" />
            <meta name="theme-color" content="#6DAD5C">
            <meta name="viewport" content="width=device-width, user-scalable=no">
            <title>${template.title}</title>
            <link rel="preload" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700" as="style" crossorigin="anonymous">
            <link rel="manifest" href="/manifest.json">
            ${template.head}
            ${template.link}
            ${template.style}
            <style>
              @import "https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined";
            </style>
            ${extractor.getLinkTags()}
            ${extractor.getStyleTags()}
            ${template.head}
        </head>
        <body>
        <div id="root">`;

    const htmlEnd = `
        </div>
        <script>
            window.__PRELOADED_STATE__ = ${serialize(finalState)}
            window.__APP_SESSION__ = ${serialize(session, { isJSON: true })}
        </script>
        ${extractor.getScriptTags({ crossOrigin: '' })}
        ${template.scripts.body}
        </body>
      </html>`;

    res.set('Content-Type', 'text/html');

    /* Modify Cache Control */
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    /* Node stream to serve template */
    res.write(htmlStart);
    componentStream.pipe(res, { end: false });
    componentStream.on('end', () => {
      res.end(htmlEnd);
    });
  }
};

export default templateHandler;
