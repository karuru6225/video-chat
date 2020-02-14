import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import reducers from './reducers';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

const sagaMiddleware = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

export const history = createBrowserHistory();

const store = createStore(
  reducers(history),
  composer(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware
    )
  )
);

sagaMiddleware.run(rootSaga);

export default store;
