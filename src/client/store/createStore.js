import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';

const configureStore = (preloadedState, self) => {
  const middleware = [thunk, reduxPackMiddleware];
  const persistConfig = {
    key: 'root',
    storage,
    whitelist: [''], // only whitelist the reducers whose data you want to persist
  };

  const enhancers = [];
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  if (process.env.NODE_ENV === 'development' && self) {
    const devToolsExtension = self['__REDUX_DEVTOOLS_EXTENSION__'];

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  const composeEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers,
  );
  const store = createStore(persistedReducer, preloadedState, composeEnhancers);

  const persistor = persistStore(store);

  const deleteStore = () => persistor.purge();

  return {
    persistor,
    store,
    deleteStore,
  };
};

export default configureStore;
