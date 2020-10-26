/* eslint-disable no-param-reassign */
import Axios from 'axios';
import {
  loader,
  publishError,
} from '../../store/common/actions/common.actions';
import { httpErrors } from '../error-handler/httpErrors';
import { isObjectEmpty } from '../../utils/helpers';

/* Loader Show/Hide logic */
let count = 0;
const showLoader = store => {
  store.dispatch(loader(true));
  count += 1;
};

const hideLoader = store => {
  if (count <= 1) {
    store.dispatch(loader(false));
    count = 0;
  } else {
    count -= 1;
  }
};

const errorHandler = (store, error) => {
  if (!isObjectEmpty(error.response)) {
    store.dispatch(publishError(error.response.data));
    httpErrors(error.response.data);
  } else if (!isObjectEmpty(error.request)) {
    store.dispatch(publishError(error.request));
    httpErrors(error.request);
  } else {
    store.dispatch(publishError(error));
    httpErrors(error);
  }
};

export default {
  setupInterceptors: store => {
    // Requests interceptor
    Axios.interceptors.request.use(
      config => {
        const { silent = false } = config;
        if (!silent) {
          showLoader(store);
        }
        config.timeout = 30000;
        return config;
      },
      error => {
        error = JSON.parse(JSON.stringify(error));
        errorHandler(store, error);
        hideLoader(store);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    Axios.interceptors.response.use(
      response => {
        hideLoader(store);
        return response;
      },
      error => {
        error = JSON.parse(JSON.stringify(error));
        errorHandler(store, error);
        hideLoader(store);
        return Promise.reject(error);
      },
    );
  },
};
