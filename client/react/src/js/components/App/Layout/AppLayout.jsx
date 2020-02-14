import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Loading from '../../../containers/loading';
import ScreenNotification from '../../../containers/screenNotification';

const styles = () => ({
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
});

class AppLayout extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Loading/>
        <ScreenNotification/>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              {this.props.title}
            </Typography>
          </Toolbar>
        </AppBar>
        {this.props.children}
      </div>
    );
  }
}

AppLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppLayout);
