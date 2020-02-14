import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import PageLayout from '../Layout/PageLayout';
import EditDialog from './EditDialog';

const styles = theme => ({
  contents: {
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
  addButton: {
    textAlign: 'right',
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
});

class PointExchangeItems extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPointExchangeItems();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openedEditDialog && this.props.openedEditDialog !== prevProps.openedEditDialog) {
      this.props.fetchPointExchangeItems();
    }
  }

  render() {
    const {
      classes,
      pointExchangeItems,
      pointExchangeItem,
      fetchPointExchangeItem,
      openedEditDialog,
      updatePointExchangeItem,
      postPointExchangeItem,
      deletePointExchangeItem,
      openEditDialog,
      closeEditDialog,
    } = this.props;

    return (
      <PageLayout title="ポイント交換アイテム">
        {openedEditDialog ? <EditDialog
          open={openedEditDialog}
          pointExchangeItem={pointExchangeItem}
          updatePointExchangeItem={updatePointExchangeItem}
          postPointExchangeItem={postPointExchangeItem}
          deletePointExchangeItem={deletePointExchangeItem}
          closeEditDialog={closeEditDialog}
        /> : null}
        <div className={classes.addButton}>
          <Button variant="outlined" color="primary" onClick={openEditDialog}>
            <AddIcon/>
            新規追加
          </Button>
        </div>
        <div className={classes.contents}>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.headerCell}
                             style={{ minWidth: 150, width: 300 }}>アイテム名</TableCell>
                  <TableCell className={classes.headerCell}
                             style={{ minWidth: 200, width: 200 }}>交換e-ポイント数</TableCell>
                  <TableCell className={classes.headerCell}
                             style={{ minWidth: 250 }}>アイテム項目</TableCell>
                  <TableCell className={classes.headerCell}
                             style={{ minWidth: 300, width: 300 }}>ボタンテキスト</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pointExchangeItems.map(pointExchangeItem => (
                  <TableRow
                    hover
                    key={pointExchangeItem.objectId}
                    onClick={() => fetchPointExchangeItem(pointExchangeItem.objectId)}
                  >
                    <TableCell align="justify">
                      {pointExchangeItem.name}
                    </TableCell>
                    <TableCell align="justify">
                      {pointExchangeItem.exchangePoint}
                    </TableCell>
                    <TableCell align="justify">
                      {pointExchangeItem.description}
                    </TableCell>
                    <TableCell align="justify">
                      {pointExchangeItem.buttonLabel}
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

PointExchangeItems.propTypes = {
  classes: PropTypes.object.isRequired,
  pointExchangeItems: PropTypes.array,
  pointExchangeItem: PropTypes.object,
  openedEditDialog: PropTypes.bool.isRequired,
  fetchPointExchangeItems: PropTypes.func.isRequired,
  fetchPointExchangeItem: PropTypes.func.isRequired,
  updatePointExchangeItem: PropTypes.func.isRequired,
  postPointExchangeItem: PropTypes.func.isRequired,
  deletePointExchangeItem: PropTypes.func.isRequired,
  openEditDialog: PropTypes.func.isRequired,
  closeEditDialog: PropTypes.func.isRequired,
};

export default withStyles(styles)(PointExchangeItems);
