import { handleActions } from 'redux-actions';
import { actionTypes } from './action';

const defaultState = {
  isAuth: false,
};

export default handleActions({
  [actionTypes.RESET]: () => defaultState,
  [actionTypes.LOGIN_SUCCESS]: (prevState, action) => {
    return {
      ...prevState,
      isAuth: action.payload.isAuth,
    };
  },
  [actionTypes.LOGIN_FAILED]: (_, action) => ({
    ...defaultState,
    errorMessage: action.payload
  }),
  [actionTypes.LOGOUT_SUCCESS]: () => defaultState,
  [actionTypes.LOGOUT_FAILED]: () => defaultState,
}, defaultState);
