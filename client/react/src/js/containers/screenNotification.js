import { connect } from 'react-redux';
import SceenNotification from '../components/ScreenNotification';
import { actions } from "../modules/common/action";

function mapStateToProps(state) {
  return {
    open: state.common.openScreenNotification,
    message: state.common.screenNotificationMessage,
    isError: state.common.isError,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: () => {
      dispatch(actions.screenNotificationClose());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SceenNotification);
