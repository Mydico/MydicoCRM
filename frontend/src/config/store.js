import { createStore, applyMiddleware, compose } from 'redux';
// import promiseMiddleware from 'redux-promise-middleware';
// import thunkMiddleware from 'redux-thunk';
import reducer, { IRootState } from '../shared/reducers';
import logger from 'redux-logger'

// import DevTools from './devtools';
// import errorMiddleware from './error-middleware';
// import notificationMiddleware from './notification-middleware';
// import loggerMiddleware from './logger-middleware';
// import { loadingBarMiddleware } from 'react-redux-loading-bar';
import { configureStore } from '@reduxjs/toolkit'

const defaultMiddlewares = [
  // thunkMiddleware,
  // errorMiddleware,
  // notificationMiddleware,
  // promiseMiddleware,
  // loadingBarMiddleware(),
  // loggerMiddleware
];



const composedMiddlewares = middlewares =>
  process.env.NODE_ENV === 'development'
    ? compose(applyMiddleware(...defaultMiddlewares, ...middlewares))
    : compose(applyMiddleware(...defaultMiddlewares, ...middlewares));

const store = configureStore({reducer,  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('../shared/reducers', () => {
    const newRootReducer = require('../shared/reducers').default
    store.replaceReducer(newRootReducer)
  })
}

export default store;
