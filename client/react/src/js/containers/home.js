import { connect } from 'react-redux';
import Home from '../components/Home/Home';
// import { actions as authActions } from '../modules/auth/action';

function mapStateToProps(state) {
  return {
    sending: state.common.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // login: (username, password) => {
    //   dispatch(authActions.login(username, password));
    // },
    // logout: () => {
    //   dispatch(authActions.logout());
    // },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
