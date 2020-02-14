import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import AppPot from 'common/apppot';

import { actions, actionTypes } from './action';
import { actions as commonActions } from '../common/action';

const STORAGE_KEY = 'caeccoConsole';

const myStorage = localStorage;

function* doLogin(username, password) {
  const api = AppPot.LocalAuthenticator.login.bind(AppPot.LocalAuthenticator);
  const authInfo = yield call(api, username, password, false);
  if (authInfo) {
    yield call(afterLogin, authInfo);
  }
}

function* afterLogin(authInfo) {
  myStorage.setItem(STORAGE_KEY, authInfo.serialize());
  yield put(actions.loginSuccess({ isAuth: true }));
}

function* login(action) {
  yield put(commonActions.loadStart());

  try {
    yield call(
      doLogin,
      action.payload.username,
      action.payload.password
    );
    yield put(push('/'));
    yield put(commonActions.loadEnd());
  } catch (err) {
    yield put(actions.loginFailed());
    yield put(commonActions.loadEnd());
    yield put(commonActions.screenNotificationOpen('ユーザ名またはパスワードが正しくありません'));
  }
}

function* logout() {
  try {
    myStorage.removeItem(STORAGE_KEY);
    yield put(push('/'));
    yield put(actions.logoutSuccess());
  } catch (e) {
    yield put(actions.logoutFailed());
  }
}

function* restoreAuthInfo(serializedAuthInfo) {
  const authInfo = AppPot.getAuthInfo();
  authInfo.deserialize(serializedAuthInfo);
  yield call(afterLogin, authInfo);
}

function* init() {
  const auth = myStorage.getItem(STORAGE_KEY);
  if (auth) {
    yield call(restoreAuthInfo, auth);
  } else {
    yield put(push('/'));
  }
}

export default function* () {
  yield fork(init);
  yield takeEvery(actionTypes.LOGIN, login);
  yield takeEvery(actionTypes.LOGOUT, logout);
}
