/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-mutable-exports */
import React from 'react';
import { loadableReady } from '@loadable/component';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { window, document } from 'global';
import App from './app/app';
import configureStore from './store/createStore';
import Interceptor from './services/interceptor/interceptor.service';
import './index.scss';
import 'core-js';
import environments from './environments/environments';
import SessionService from './services/session/session.service';

let store = {};

const onWindowReady = () => {
  SessionService.initialize();
  store = configureStore(window['__PRELOADED_STATE__'], window).store;
  window.store = store;
  delete window['__PRELOADED_STATE__'];
  const backEvent = new Event('onBackPress');
  window.onpopstate = () => {
    window.dispatchEvent(backEvent);
  };
};

const createTheme = () => {
  console.log('Initializing primary theme');
  return createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: '#209cee',
        light: '#5ff',
      },
      secondary: {
        main: '#45bbff',
      },
      error: {
        main: '#d90b13',
      },
      default: {
        main: '#ffffff',
      },
      text: {
        primary: '#333333',
        secondary: '#666666',
      },
    },
  });
};

if (window && document) {
  onWindowReady();
  Interceptor.setupInterceptors(store);
  window.store = store;
  const theme = createTheme();

  loadableReady(() => {
    const root = document.getElementById('root');
    hydrate(
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <BrowserRouter basename={environments.APP_BASE_NAME}>
            {window && document ? <App /> : []}
          </BrowserRouter>
        </MuiThemeProvider>
      </Provider>,
      root,
    );
  });

  if (module.hot) {
    module.hot.accept();
  }
}

export { store };
