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
});

class EditDialog extends React.Component {
  constructor(props) {
    super(props);
    const { pointExchangeItem } = props;
    let isNew = true;
    let name = '';
    let exchangePoint = '';
    let description = '';
    let buttonLabel = '';
    if (pointExchangeItem) {
      isNew = false;
      name = pointExchangeItem.name;
      exchangePoint = pointExchangeItem.exchangePoint;
      description = pointExchangeItem.description;
      buttonLabel = pointExchangeItem.buttonLabel;
    }
    this.state = { isNew, name, exchangePoint, description, buttonLabel };
    this.onChangeField = this.onChangeField.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onChangeField(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onClickSave() {
    const { isNew, name, exchangePoint, description, buttonLabel } = this.state;
    const postData = {
      name,
      exchangePoint,
      description,
      buttonLabel,
    };

    if (isNew) {
      this.props.postPointExchangeItem(postData);
    } else {
      this.props.updatePointExchangeItem(this.props.pointExchangeItem.objectId, postData);
    }

  }

  onClickDelete() {
    if (window.confirm('本当に削除してよろしいですか？')) {
      this.props.deletePointExchangeItem(this.props.pointExchangeItem.objectId);
    }
  }

  handleClose() {
    this.props.closeEditDialog();
  }

  render() {
    const { classes, fullScreen, open } = this.props;
    const { isNew, name, exchangePoint, description, buttonLabel } = this.state;

    const renderFields = () => (
      <div>
        <Grid container justify="center">
          <Grid item xs={11}>
            <TextField
              name="name"
              label="アイテム名"
              margin="normal"
              className={classes.textField}
              value={name}
              style={{ width: 300 }}
              onChange={this.onChangeField}
            />
          </Grid>
          <Grid item xs={11}>
            <TextField
              name="exchangePoint"
              label="交換e-ポイント数"
              margin="normal"
              type="number"
              className={classes.textField}
              value={exchangePoint}
              onChange={this.onChangeField}
              style={{ width: 300 }}
            />
          </Grid>
          <Grid item xs={11}>
            <TextField
              name="description"
              label="アイテム項目"
              margin="normal"
              multiline
              rows={3}
              rowsMax={5}
              className={classes.textField}
              value={description}
              onChange={this.onChangeField}
              style={{ width: 300 }}
            />
          </Grid>
          <Grid item xs={11}>
            <TextField
              name="buttonLabel"
              label="ボタンテキスト"
              margin="normal"
              className={classes.textField}
              value={buttonLabel}
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
            <Typography variant="h6">ポイント交換アイテム</Typography>
            <IconButton onClick={this.handleClose} className={classes.closeButton}>
              <CloseIcon/>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {renderFields()}
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
              disabled={!name || !exchangePoint || !description || !buttonLabel}
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
  pointExchangeItem: PropTypes.object,
  open: PropTypes.bool.isRequired,
  closeEditDialog: PropTypes.func.isRequired,
  updatePointExchangeItem: PropTypes.func.isRequired,
  postPointExchangeItem: PropTypes.func.isRequired,
  deletePointExchangeItem: PropTypes.func.isRequired,
};

export default withStyles(styles)(withMobileDialog()(EditDialog));
