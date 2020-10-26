import express from 'express';
/* middlewares */
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import expressStaticGzip from 'express-static-gzip';
import environments from '../client/environments/environments';
import templateHandler from './handlers/template';
import { RUNTIME, ALLOWED_ORIGINS } from '../client/utils/constants';
import logger from './utils/logger';

const app = express();
const { RUNTIME: RUNTIME_ENV = '', CORS = false } = process.env;
const isProduction = RUNTIME_ENV !== RUNTIME.LOCAL;
const upload = multer();

app.use(cors('*'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.disable('x-powered-by');

if (isProduction) {
  app.use(
    expressStaticGzip(process.env.AURA_PUBLIC_DIR, {
      enableBrotli: true,
      orderPreference: ['br', 'gz'],
    }),
  );
} else {
  app.use(express.static(process.env.AURA_PUBLIC_DIR));
}

app.use('/heartbeat', (req, res) => {
  res.status(200).send({
    status: '200',
    version: environments.VERSION,
    environment: environments.ENV,
    port: process.env.PORT || 3000,
    api: environments.API_URL,
    cdn: process.env.PUBLIC_PATH,
  });
});

// eslint-disable-next-line eqeqeq
if (CORS == 'true') {
  app.use(async (req, res, next) => {
    const { hostname } = req;
    let allowAccess = 0;
    logger.info(`Request on route ${req.url} from host ${hostname}`);
    for (let i = 0; i < ALLOWED_ORIGINS.length; i++) {
      const domain = ALLOWED_ORIGINS[i];
      if (domain.test(hostname)) {
        allowAccess = 1;
        break;
      }
    }
    if (!allowAccess) {
      const error = new Error();
      error.message = 'CORS policy does not allow access to this domain';
      error.status = 403;
      res.status(error.status).send(error);
    } else {
      next();
    }
  });
}

app.use('/*', async (req, res, next) => {
  try {
    return await templateHandler(req, res);
  } catch (err) {
    next(err);
    throw err;
  }
});

export default app;
