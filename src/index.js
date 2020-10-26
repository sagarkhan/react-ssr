import http from 'http';
import logger from './server/utils/logger';
import { ENV } from './client/utils/constants';

const app = require('./server/server').default;

const server = http.createServer(app);

let currentApp = app;

server.listen(process.env.PORT || 3000, error => {
  if (error) {
    logger.error(error);
  }

  logger.info('🚀 started');
  logger.info(`Project serving on ${process.env.HOST}:${process.env.PORT}`);
  logger.info(`Environment = ${process.env.AURA_ENV || ENV.DEV}`);
});

if (module.hot) {
  logger.info('✅  Server-side HMR Enabled!');

  module.hot.accept('./server/server', () => {
    logger.info('🔁  HMR Reloading `./server`...');

    try {
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      logger.error(error);
    }
  });
}
