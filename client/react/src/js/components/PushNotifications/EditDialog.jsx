import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  withMobileDialog,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import {
  DESTINATION_TYPE_ALL,
  DESTINATION_TYPE_INDIVIDUAL,
  DESTINATION_TYPE_VALUES,
  STATUS_RESERVATION,
} from 'common/model/PushNotification'

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
  },
  destination: {
    marginTop: theme.spacing(2),
  }
});

class EditDialog extends React.Component {
  constructor(props) {
    super(props);
    const { pushNotification } = props;
    let title = '';
    let postDateTime = null;
    let content = '';
    let destinationType = DESTINATION_TYPE_ALL;
    let destinationUserId = '';
    let isNew = true;
    if (pushNotification) {
      title = pushNotification.title;
      postDateTime = pushNotification.postDateTime || '';
      content = pushNotification.content;
      destinationType = pushNotification.destinationType;
      destinationUserId = pushNotification.destinationUserId;
      isNew = false;
    }
    this.state = {
      title,
      postDateTime,
      content,
      destinationType: String(destinationType),
      destinationUserId,
      isNew,
    };
    this.onChangeField = this.onChangeField.bind(this);
    this.onChangePostDateTime = this.onChangePostDateTime.bind(this);
    this.onChangeDestinationType = this.onChangeDestinationType.bind(this);
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

  onChangeDestinationType(e) {
    this.setState({ destinationType: e.target.value });
  }

  onClickSave() {
    const { title, postDateTime, content, destinationType, destinationUserId, isNew } = this.state;
    const newDestinationUserId = destinationType === String(DESTINATION_TYPE_INDIVIDUAL) ? destinationUserId : null;
    const postData = {
      title,
      postDateTime: postDateTime,
      content,
      destinationType,
      destinationUserId: newDestinationUserId,
    };

    if (isNew) {
      postData.status = STATUS_RESERVATION;
      this.props.postPushNotification(postData);
    } else {
      this.props.updatePushNotification(this.props.pushNotification.objectId, postData);
    }
  }

  onClickDelete() {
    if (window.confirm('本当に削除してよろしいですか？')) {
      this.props.deletePushNotification(this.props.pushNotification.objectId);
    }
  }

  handleClose() {
    this.props.closeEditDialog();
  }

  render() {
    const { classes, fullScreen, open } = this.props;
    const { title, postDateTime, content, destinationType, destinationUserId, isNew } = this.state;

    const isSendIndividual = destinationType === String(DESTINATION_TYPE_INDIVIDUAL);

    const disabledSave = !((title && postDateTime && content && destinationType) && (!isSendIndividual || (isSendIndividual && destinationUserId)));

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
              label="送信時刻(10分単位)"
              value={postDateTime}
              minutesStep={10}
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

          <Grid item xs={11}>
            <FormControl component="fieldset" className={classes.destination}>
              <FormLabel component="legend">送信先</FormLabel>
              <RadioGroup
                aria-label="送信先"
                name="destinationType"
                className={classes.group}
                value={destinationType}
                onChange={this.onChangeDestinationType}
              >
                {DESTINATION_TYPE_VALUES.map((d, idx) =>
                  (
                    <FormControlLabel key={idx} value={String(d.value)} control={<Radio/>} label={d.label}/>
                  )
                )}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={11}>
            {
              isSendIndividual
                ? (
                  <TextField
                    name="destinationUserId"
                    label="ユーザーID"
                    margin="normal"
                    variant="outlined"
                    className={classes.textField}
                    value={destinationUserId}
                    style={{ width: 300 }}
                    onChange={this.onChangeField}
                  />
                )
                : null
            }
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
            <Typography variant="h6">プッシュ通知</Typography>
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
              disabled={disabledSave}
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
  pushNotification: PropTypes.object,
  open: PropTypes.bool.isRequired,
  closeEditDialog: PropTypes.func.isRequired,
  updatePushNotification: PropTypes.func.isRequired,
  postPushNotification: PropTypes.func.isRequired,
  deletePushNotification: PropTypes.func.isRequired,
};

export default withStyles(styles)(withMobileDialog()(EditDialog));
