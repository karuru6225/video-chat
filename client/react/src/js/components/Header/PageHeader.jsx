import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = theme => ({
  title: {
    flexGrow: 1,
    textAlign: 'center',
    marginLeft: -48,
  },
  actions: {
    flexGrow: 1,
    textAlign: 'right',
  },
  logoContainer: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  logo: {
    width: 200,
    marginRight: theme.spacing(1),
  },
  inputField: {
    marginRight: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 230,
    },
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 5,
  },
});

class PageHeader extends React.Component {
  render() {
    const { classes, title, backHome } = this.props;
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <IconButton
              onClick={() => backHome()}
              className={classes.menuButton} color="inherit" aria-label="Menu">
              <ArrowBackIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

PageHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  backHome: PropTypes.func.isRequired,
};

export default withStyles(styles)(PageHeader);
