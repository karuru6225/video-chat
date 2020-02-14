import { handleActions } from 'redux-actions';
import { actionTypes } from './action';

const defaultState = {
  loading: false,
  openScreenNotification: false,
  screenNotificationMessage: null,
  isError: true,
  text: null,
  error: null,
};

export default handleActions({
  [actionTypes.LOAD_START]: (prevState, action) => {
    return {
      ...prevState,
      loading: true,
      text: action.payload.text
    };
  },
  [actionTypes.LOAD_END]: prevState => ({
    ...prevState,
    loading: false,
    text: null,
  }),
  [actionTypes.SCREEN_NOTIFICATION_OPEN]: (prevState, action) => {
    return {
      ...prevState,
      openScreenNotification: true,
      screenNotificationMessage: action.payload.screenNotificationMessage,
      isError: action.payload.isError,
    };
  },
  [actionTypes.SCREEN_NOTIFICATION_CLOSE]: prevState => ({
    ...prevState,
    openScreenNotification: false,
    screenNotificationMessage: null,
  }),
  [actionTypes.GLOBAL_ERROR_HANDLER]: (prevState, action) => ({
    ...prevState,
    error: action.payload.error,
    screenNotificationMessage: null,
  }),
}, defaultState);
