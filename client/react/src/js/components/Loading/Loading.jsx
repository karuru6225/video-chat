import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: theme.zIndex.tooltip + 100
  },
  loadingText: {
    zIndex: 1601,
    fontSize: '1.2rem',
    fontWeight: 'bold',
  }
});

const Loading = (props) => {
  const { classes, loading, text } = props;
  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        {text ? <div className={classes.loadingText}>{text}</div> : null}
        <CircularProgress style={{ position: 'absolute' }}/>
      </div>
    );
  }
  return null;
};

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  text: PropTypes.string,
};

export default withStyles(styles)(Loading);
