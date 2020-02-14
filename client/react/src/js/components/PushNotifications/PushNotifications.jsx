import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import PageLayout from '../Layout/PageLayout';
import EditDialog from './EditDialog';
import {
  DESTINATION_TYPE_ALL,
  DESTINATION_TYPE_VALUES,
  STATUS_SENT,
  STATUS_RESERVATION,
  STATUS_FAILED,
  STATUS_VALUES
} from 'common/model/PushNotification'
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

class PushNotifications extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPushNotifications();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openedEditDialog && this.props.openedEditDialog !== prevProps.openedEditDialog) {
      this.props.fetchPushNotifications();
    }
  }

  render() {

    const {
      classes,
      pushNotifications,
      pushNotification,
      fetchPushNotification,
      updatePushNotification,
      postPushNotification,
      deletePushNotification,
      openedEditDialog,
      openEditDialog,
      closeEditDialog,
    } = this.props;

    const renderDestination = (pushNotification) => {
      if (pushNotification.destinationType === DESTINATION_TYPE_ALL) {
        return DESTINATION_TYPE_VALUES.find(t => t.value === pushNotification.destinationType).label;
      }
      return pushNotification.destinationUserId;
    };

    const renderStatusLabel = (pushNotification) => {
      const status = STATUS_VALUES.find(s => s.value === pushNotification.status);
      if (!status) {
        return null;
      }
      switch (pushNotification.status) {
        case STATUS_SENT:
        case STATUS_FAILED:
          return <div className={this.props.classes.sentLabel}>{status.label}</div>;
        case STATUS_RESERVATION:
          return <div className={this.props.classes.sendReservationLabel}>{status.label}</div>;
        default:
          return null
      }
    };

    return (
      <PageLayout title="プッシュ通知">
        {openedEditDialog ? <EditDialog
          open={openedEditDialog}
          pushNotification={pushNotification}
          updatePushNotification={updatePushNotification}
          postPushNotification={postPushNotification}
          deletePushNotification={deletePushNotification}
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
                             style={{ minWidth: 150, width: 150 }}>送信先</TableCell>
                  <TableCell className={classes.headerCell}
                             style={{ minWidth: 150, width: 150 }}>送信状態</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pushNotifications.map(pushNotification => (
                  <TableRow
                    hover
                    key={pushNotification.objectId}
                    onClick={() => fetchPushNotification(pushNotification.objectId)}
                  >
                    <TableCell align="justify">
                      {pushNotification.title}
                    </TableCell>
                    <TableCell align="justify">
                      {moment(pushNotification.postDateTime).format(DISPLAY_DATE_FORMAT)}
                    </TableCell>
                    <TableCell align="justify">
                      {pushNotification.content}
                    </TableCell>
                    <TableCell align="justify">
                      {renderDestination(pushNotification)}
                    </TableCell>
                    <TableCell align="justify">
                      {renderStatusLabel(pushNotification)}
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

PushNotifications.propTypes = {
  classes: PropTypes.object.isRequired,
  pushNotifications: PropTypes.array,
  pushNotification: PropTypes.object,
  openedEditDialog: PropTypes.bool.isRequired,
  fetchPushNotifications: PropTypes.func.isRequired,
  fetchPushNotification: PropTypes.func.isRequired,
  updatePushNotification: PropTypes.func.isRequired,
  postPushNotification: PropTypes.func.isRequired,
  deletePushNotification: PropTypes.func.isRequired,
  openEditDialog: PropTypes.func.isRequired,
  closeEditDialog: PropTypes.func.isRequired,
};

export default withStyles(styles)(PushNotifications);
