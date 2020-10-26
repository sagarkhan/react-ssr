/* eslint-disable global-require */
import * as DeviceDetector from 'react-device-detect';

export const APP_ROUTES = {
  APP: '/',
  HOME: '/home',
};

export const SESSION_TIME = 1500; /* Active session time in seconds */

export const APP_PROFILE = 'hybrid';

export const APP_LOGO = '';

export const ENV = {
  DEV: 'development',
  UAT: 'uat',
  PROD: 'production',
};

export const RUNTIME = {
  LOCAL: 'local',
  LIVE: 'live',
};

export const STORAGE_ENGINE = {
  LOCAL: 'local',
  SESSION: 'session',
};

/* Add the domains you want to allow access */
export const ALLOWED_ORIGINS = [];

export const AGENT = {
  WEB: 'Web',
  MOBILE: 'Mobile' /* Browser WEB */,
  IOS: 'IOS',
};

export const SESSION = {
  TOKEN: 'token',
  AGENT: 'agent',
  TIMESTAMP: 'timestamp',
};

/* Common events to be published from web to mobile client */
export const EVENT_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  TIMEOUT: 'timeout',
  INVALID: 'invalid',
  PENDING: 'pending',
  PROCESSING: 'processing',
  SERVER_ERROR: 'server_error',
  FORBIDDEN: 'forbidden',
  UNAUTHORIZED: 'unauthorized',
  BACK: 'back',
};

/* Used to calculate session remaining time */
export const getTimestamp = timestamp => {
  const time = Number(timestamp);
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(time)) {
    return false;
  }
  const remainingTime = SESSION_TIME - Number(time.toFixed());
  return remainingTime;
};

export const isValidAgent = agent => {
  if (Object.values(AGENT).indexOf(agent) > -1) {
    return true;
  }
  return false;
};

export const isMobile = agent => {
  if (!agent) {
    return DeviceDetector.isMobile;
  } else if (agent !== AGENT.WEB && Object.values(AGENT).indexOf(agent) > -1) {
    return true;
  }
  return false;
};

export const IMAGE_ASSETS = {
  404: require('../assets/images/404.svg'),
}
