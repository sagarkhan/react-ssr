/* eslint-disable new-cap */
import winston from 'winston';
import fs from 'fs';
import 'winston-daily-rotate-file';
import moment from 'moment';
import path from 'path';
import environments from '../../client/environments/environments';
import { ENV } from '../../client/utils/constants';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const { format } = winston;
const appRoot = resolveApp('.');
const logDir = `${appRoot}/logs`;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const consoleLogFormat = format.printf(
  ({ level, message }) =>
    `${moment().format('YYYY-MM-DD HH:MM:SS')} [${level}]: ${message}`,
);

const fileLogFormat = format.printf(
  ({ level, message }) =>
    `${moment().format('YYYY-MM-DD HH:MM:SS')}: [${level}]: ${message}`,
);

const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
    prettyPrint: true,
    format: format.combine(
      format.timestamp(),
      format.colorize(),
      format.simple(),
      consoleLogFormat,
    ),
  },
};

const fileTransport = new winston.transports.DailyRotateFile({
  filename: `${appRoot}/logs/app-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: format.combine(format.timestamp(), format.simple(), fileLogFormat),
});

const transports = [];
transports.push(new winston.transports.Console(options.console));

if (environments.ENV === ENV.DEV) {
  transports.push(fileTransport);
}
const logger = new winston.createLogger({
  transports,
  exitOnError: false,
});

logger.stream = {
  write: message => logger.info(message),
};

export default logger;
