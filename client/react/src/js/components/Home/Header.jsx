import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { AppBar, Button, TextField, Toolbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import logoImg from "../../../images/logo.svg";

const styles = theme => ({
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
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      minWidth: 150,
    },
  },
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.onChangeField = this.onChangeField.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
    this.onClickLogout = this.onClickLogout.bind(this);
  }

  onChangeField(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onClickLogin(e) {
    e.preventDefault();
    this.props.login(this.state.username, this.state.password);
  }

  onClickLogout(e) {
    e.preventDefault();
    this.props.logout();
  }

  render() {
    const { classes, isAuth } = this.props;

    const nonAuthMenu = (
      <form className={classes.actions}>
        <TextField
          label="ユーザー名"
          className={classes.inputField}
          variant="outlined"
          margin="dense"
          name="username"
          value={this.state.username}
          onChange={this.onChangeField}
        />
        <TextField
          label="パスワード"
          className={classes.inputField}
          variant="outlined"
          margin="dense"
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.onChangeField}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          onClick={this.onClickLogin}
        >
          ログイン
        </Button>
      </form>
    );

    const authMenu = (
      <form className={classes.actions}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          onClick={this.onClickLogout}
        >
          ログアウト
        </Button>
      </form>
    );

    return (
      <div>
        <Helmet>
          <title>caecco管理画面</title>
        </Helmet>
        <AppBar position="static" color="default">
          <Toolbar>
            <div className={classes.logoContainer}>
              <img src={logoImg} className={classes.logo} alt="logo"/>
            </div>
            {isAuth ? authMenu : nonAuthMenu}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  isAuth: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Header);
