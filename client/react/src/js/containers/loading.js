import { connect } from 'react-redux';
import Loading from '../components/Loading/Loading';

function mapStateToProps(state) {
  const {
    loading,
    text
  } = state.common;
  return {
    loading,
    text
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading);
