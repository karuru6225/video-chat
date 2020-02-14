import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  withMobileDialog,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { KeyboardDateTimePicker } from '@material-ui/pickers';


const styles = theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  sectionTitle: {
    color: theme.palette.primary.dark,
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  }
});

class EditDialog extends React.Component {
  constructor(props) {
    super(props);
    const { notification } = props;
    let title = '';
    let postDateTime = new Date();
    let content = '';
    let isNew = true;
    if (notification) {
      title = notification.title;
      postDateTime = notification.postDateTime || '';
      content = notification.content;
      isNew = false;
    }
    this.state = { title, postDateTime, content, isNew };
    this.onChangeField = this.onChangeField.bind(this);
    this.onChangePostDateTime = this.onChangePostDateTime.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onChangeField(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onChangePostDateTime(date) {
    if (date) {
      this.setState({ postDateTime: date.toDate() });
    } else {
      this.setState({ postDateTime: '' });
    }
  }

  onClickSave() {
    const { title, postDateTime, content, isNew } = this.state;
    const postData = {
      title,
      postDateTime: postDateTime,
      content,
    };

    if (isNew) {
      this.props.postNotification(postData);
    } else {
      this.props.updateNotification(this.props.notification.objectId, postData);
    }
  }

  onClickDelete() {
    if (window.confirm('本当に削除してよろしいですか？')) {
      this.props.deleteNotification(this.props.notification.objectId);
    }
  }

  handleClose() {
    this.props.closeEditDialog();
  }

  render() {
    const { classes, fullScreen, open } = this.props;
    const { title, postDateTime, content, isNew } = this.state;

    const renderBasicInfoSection = () => (
      <div>
        <Grid container justify="center">
          <Grid item xs={11}>
            <TextField
              name="title"
              label="タイトル"
              margin="normal"
              className={classes.textField}
              value={title}
              style={{ width: 300 }}
              onChange={this.onChangeField}
            />
          </Grid>
          <Grid item xs={11}>
            <KeyboardDateTimePicker
              ampm={true}
              label="送信時刻"
              value={postDateTime}
              onChange={this.onChangePostDateTime}
              format="YYYY年MM月DD日 HH:mm"
            />
          </Grid>

          <Grid item xs={11}>
            <TextField
              name="content"
              label="本文"
              margin="normal"
              multiline
              rows={4}
              rowsMax={8}
              className={classes.textField}
              value={content}
              onChange={this.onChangeField}
              style={{ width: 300 }}
            />
          </Grid>
        </Grid>
      </div>
    );


    return (
      <div>
        <Dialog
          open={open}
          fullScreen={fullScreen}
          onClose={this.handleClose}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">お知らせ送信</Typography>
            <IconButton onClick={this.handleClose} className={classes.closeButton}>
              <CloseIcon/>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {renderBasicInfoSection()}
          </DialogContent>
          <DialogActions>
            {isNew ? null :
              <div>
                <Button onClick={this.onClickDelete} variant="outlined">
                  削除
                </Button>
              </div>
            }
            <Button onClick={this.handleClose} variant="outlined" color="primary" style={{ width: 120 }}>
              キャンセル
            </Button>
            <Button
              disabled={!title || !postDateTime || !content}
              onClick={this.onClickSave}
              variant="contained"
              color="primary"
              style={{ width: 120 }}
            >
              保存
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

EditDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,
  notification: PropTypes.object,
  open: PropTypes.bool.isRequired,
  closeEditDialog: PropTypes.func.isRequired,
  updateNotification: PropTypes.func.isRequired,
  postNotification: PropTypes.func.isRequired,
  deleteNotification: PropTypes.func.isRequired,
};

export default withStyles(styles)(withMobileDialog()(EditDialog));
