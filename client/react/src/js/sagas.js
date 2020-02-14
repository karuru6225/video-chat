import { fork } from 'redux-saga/effects';
import common from './modules/common/saga';
import auth from './modules/auth/saga';

export default function* rootSaga() {
  yield fork(common);
  // yield fork(auth);
}
