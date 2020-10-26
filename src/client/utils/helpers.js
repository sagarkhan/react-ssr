import { APP_ROUTES } from './constants';

export const cleanObject = obj => JSON.parse(JSON.stringify(obj));

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const sortObject = (data = [], key) =>
  data.sort((a, b) => (Number(a[key]) > Number(b[key]) ? 1 : -1));

export const isObjectEmpty = obj => {
  if (obj && Object.keys(obj).length) {
    return false;
  }
  return true;
};

export const getRedirectURL = page => {
  switch (page) {
    default:
      return APP_ROUTES.HOME;
  }
};
