import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import PageLayout from '../Layout/PageLayout';
import EditDialog from './EditDialog';
import { DISPLAY_DATE_FORMAT } from '../../constants';

const styles = theme => ({
  notifications: {
    padding: theme.spacing(1),
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  headerCell: {
    textAlign: 'center',
  },
  actionButton: {
    marginRight: theme.spacing(1),
  },
  addButton: {
    textAlign: 'right',
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  sentLabel: {
    backgroundColor: 'gray',
    color: 'white',
    textAlign: 'center',
    padding: theme.spacing(1),
    borderRadius: 10,
    fontSize: '0.8rem',
  },
  sendReservationLabel: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    textAlign: 'center',
    padding: theme.spacing(1),
    borderRadius: 10,
    fontSize: '0.8rem',
  },
});

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.renderSendLabel = this.renderSendLabel.bind(this);
  }

  componentDidMount() {
    this.props.fetchNotifications();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openedEditDialog && this.props.openedEditDialog !== prevProps.openedEditDialog) {
      this.props.fetchNotifications();
    }
  }

  renderSendLabel(now, postDateTime) {
    if (now > postDateTime) {
      return <div className={this.props.classes.sentLabel}>送信済み</div>
    }
    return <div className={this.props.classes.sendReservationLabel}>送信予約</div>
  }

  render() {
    const {
      classes,
      notifications,
      notification,
      fetchNotification,
      openedEditDialog,
      postNotification,
      updateNotification,
      deleteNotification,
      openEditDialog,
      closeEditDialog,
    } = this.props;

    const now = new Date();

    return (
      <PageLayout title="お知らせ送信">
        {openedEditDialog ? <EditDialog
          open={openedEditDialog}
          notification={notification}
          updateNotification={updateNotification}
          postNotification={postNotification}
          deleteNotification={deleteNotification}
          closeEditDialog={closeEditDialog}
        /> : null}
        <div className={classes.addButton}>
          <Button variant="outlined" color="primary" onClick={openEditDialog}>
            <AddIcon/>
            新規追加
          </Button>
        </div>
        <div className={classes.notifications}>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.headerCell}
                             style={{ minWidth: 150, width: 300 }}>タイトル</TableCell>
                  <TableCell className={classes.headerCell}
                             style={{ minWidth: 220, width: 220 }}>送信時刻</TableCell>
                  <TableCell className={classes.headerCell}
                             style={{ minWidth: 220 }}>本文</TableCell>
                  <TableCell className={classes.headerCell}
                             style={{ minWidth: 150, width: 150 }}>送信状態</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map(notification => (
                  <TableRow
                    hover
                    key={notification.objectId}
                    onClick={() => fetchNotification(notification.objectId)}
                  >
                    <TableCell align="justify">
                      {notification.title}
                    </TableCell>
                    <TableCell align="justify">
                      {moment(notification.postDateTime).format(DISPLAY_DATE_FORMAT)}
                    </TableCell>
                    <TableCell align="justify">
                      {notification.content}
                    </TableCell>
                    <TableCell align="justify">
                      {this.renderSendLabel(now, notification.postDateTime)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </PageLayout>
    );
  }
}

Notifications.propTypes = {
  classes: PropTypes.object.isRequired,
  notifications: PropTypes.array,
  notification: PropTypes.object,
  openedEditDialog: PropTypes.bool.isRequired,
  fetchNotifications: PropTypes.func.isRequired,
  fetchNotification: PropTypes.func.isRequired,
  updateNotification: PropTypes.func.isRequired,
  postNotification: PropTypes.func.isRequired,
  deleteNotification: PropTypes.func.isRequired,
  openEditDialog: PropTypes.func.isRequired,
  closeEditDialog: PropTypes.func.isRequired,
};

export default withStyles(styles)(Notifications);
