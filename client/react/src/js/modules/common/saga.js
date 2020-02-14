import { fork, put, takeEvery } from 'redux-saga/effects';
import { actions, actionTypes } from './action';

function* init() {
  yield put(actions.reset());
}

function* globalErrorHandler(action) {
  const error = action.payload.error;
  yield put(actions.screenNotificationOpen('もう一度ログインしてください'));
}

export default function* () {
  yield fork(init);
  yield takeEvery(actionTypes.GLOBAL_ERROR_HANDLER, globalErrorHandler);
}
