import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles/index';

const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  success: {
    backgroundColor: theme.palette.primary.main,
  },
});

class ScreenNotification extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.open !== nextProps.open) {
      return {
        open: nextProps.open,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.handleClose();
  }

  render() {
    const { classes, message, isError } = this.props;
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={this.state.open}
        onClose={this.handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        autoHideDuration={3000}
      >
        <SnackbarContent
          className={isError ? classes.error : classes.success}
          message={<span id="message-id">{message}</span>}
        />
      </Snackbar>
    );
  }
}

ScreenNotification.propTypes = {
  open: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  message: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

ScreenNotification.defaultProps = {
  message: '',
};

export default withStyles(styles)(ScreenNotification);
