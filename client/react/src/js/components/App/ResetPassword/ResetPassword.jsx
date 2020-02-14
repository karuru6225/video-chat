import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import AppLayout from '../Layout/AppLayout';
import TextField from '@material-ui/core/TextField';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
  },
  section: {
    marginTop: theme.spacing(2),
  },
  sectionComponent: {
    width: 280,
  },
  completeDesc: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  }
});

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
    this.token = this.props.match.params.token;
    this.onChangeField = this.onChangeField.bind(this);
    this.onClickSend = this.onClickSend.bind(this);
  }

  onChangeField(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onClickSend() {
    this.props.resetPassword(this.state.password, this.token);
  }

  render() {
    const { classes, isComplete } = this.props;

    const renderComplete = () => (
      <div>
        <Typography variant="h6">パスワード再設定が完了しました</Typography>
        <div className={classes.completeDesc}>
          Caeccoのアプリから新しいパスワードを使用してログインしてください。
        </div>
      </div>
    );

    return (
      <AppLayout title="パスワード再設定">
        <div className={classes.root}>
          <Box textAlign="center">
            {
              isComplete ? renderComplete() :
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={12} className={classes.section}>
                    新しいパスワードを入力してください
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="パスワード"
                      type="password"
                      helperText="英数字を含む8文字以上"
                      fullWidth
                      margin="normal"
                      name="password"
                      value={this.state.password}
                      onChange={this.onChangeField}
                      className={classes.sectionComponent}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.section}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!this.state.password}
                      onClick={this.onClickSend}
                      className={classes.sectionComponent}
                    >
                      設定
                    </Button>
                  </Grid>
                </Grid>
            }
          </Box>
        </div>
      </AppLayout>
    );
  }
}

ResetPassword.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  isComplete: PropTypes.bool.isRequired,
  resetPassword: PropTypes.func.isRequired,
};

export default withStyles(styles)(ResetPassword);
