import { combineReducers } from 'redux';
import common from './modules/common/reducer';
import auth from './modules/auth/reducer';
import { connectRouter } from 'connected-react-router';

export default (history) => combineReducers({
  common,
  // auth,
  router: connectRouter(history)
});
