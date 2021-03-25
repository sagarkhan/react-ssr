import { ENV, STORAGE_ENGINE } from '../utils/constants';

const dev = {
  API_URL: '',
};

const uat = {
  API_URL: '',
};

const prod = {
  API_URL: '',
};

// Overwrite .env environments
const currentEnv = process.env.AURA_ENV || ENV.DEV;

const getEnv = env => {
  switch (env.toLowerCase()) {
    case ENV.DEV:
      return dev;
    case ENV.UAT:
      return uat;
    case ENV.PROD:
      return prod;
    default:
      return dev;
  }
};

const environments = {
  ...getEnv(currentEnv),
  APP_BASE_NAME: '/',
  ENV: currentEnv,
  VALIDATE: false /* Validate session  */,
  VERSION: '1.0.0',
  STORAGE: STORAGE_ENGINE.SESSION,
};

export default environments;
