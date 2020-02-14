import { createAction } from 'redux-actions';

export const actionTypes = {
  LOAD_START: 'common/load_start',
  LOAD_END: 'common/load_end',
  SCREEN_NOTIFICATION_OPEN: 'common/screen_notification_open',
  SCREEN_NOTIFICATION_CLOSE: 'common/screen_notification_close',
  GLOBAL_ERROR_HANDLER: 'common/global_error_handler',
};

export const actions = {
  loadStart: (text = null) => ({
    type: actionTypes.LOAD_START,
    payload: { text },
  }),
  loadEnd: createAction(actionTypes.LOAD_END),
  screenNotificationOpen: (screenNotificationMessage, isError = true) => ({
    type: actionTypes.SCREEN_NOTIFICATION_OPEN,
    payload: { screenNotificationMessage, isError },
  }),
  screenNotificationClose: createAction(actionTypes.SCREEN_NOTIFICATION_CLOSE),
  globalErrorHandler: error => ({
    type: actionTypes.GLOBAL_ERROR_HANDLER,
    payload: { error },
  }),
};
