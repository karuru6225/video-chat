import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { RANK_TYPE_VALUES, GENDER_VALUES } from 'common/model/User';
import EditDialog from './EditDialog';
import PageLayout from '../Layout/PageLayout';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  search: {
    padding: '2px 4px',
    width: 300,
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: theme.spacing(1),
  },
  searchResult: {
    padding: theme.spacing(1),
  },
  labelHeader: {
    lineHeight: '25px',
  },
  headerCell: {
    textAlign: 'center',
  },
  labelHeaderCell: {
    borderBottom: 0,
  },
  labelHeaderCellContent: {
    borderRadius: 5,
    backgroundColor: '#aaaaaa',
    width: '70%',
    textAlign: 'center',
    margin: 'auto',
    fontSize: '0.9rem',
    color: '#fff',
  },
});

const SORT_DIRECTION_ASC = 'asc';
const SORT_DIRECTION_DESC = 'desc';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortColumn: null,
      sortDirection: 'asc',
      searchWord: '',
    };
    this.onChangeField = this.onChangeField.bind(this);
    this.onClickSortLabel = this.onClickSortLabel.bind(this);
    this.onClickSearch = this.onClickSearch.bind(this);
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openEditDialog && this.props.openEditDialog !== prevProps.openEditDialog) {
      this.onClickSearch();
    }
  }

  onChangeField(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onClickSearch() {
    const { sortColumn, sortDirection, searchWord } = this.state;
    const condition = {
      sortColumn: sortColumn,
      sortDirection: sortDirection,
      searchWord: searchWord,
    };
    this.props.fetchUsers(condition);
  }

  onClickSortLabel(sortColumn) {
    const condition = {};
    if (this.state.sortColumn === sortColumn) {
      condition.sortColumn = sortColumn;
      condition.sortDirection = String(this.state.sortDirection) === SORT_DIRECTION_ASC ? SORT_DIRECTION_DESC : SORT_DIRECTION_ASC;
    } else {
      condition.sortColumn = sortColumn;
      condition.sortDirection = SORT_DIRECTION_ASC;
    }
    this.setState(condition);
    this.props.fetchUsers(condition);
  }

  render() {
    const SortableTableCell = (sortColumn, label, style = {}) => (
      <TableCell padding="none" className={classes.headerCell} style={Object.assign({ minWidth: 150 }, style)}>
        <TableSortLabel
          active={this.state.sortColumn === sortColumn}
          direction={this.state.sortDirection}
          onClick={() => this.onClickSortLabel(sortColumn)}
        >
          {label}
        </TableSortLabel>
      </TableCell>
    );

    const { classes, users, user, makers, fetchUser, updateUser, deleteUser, openEditDialog, closeEditDialog } = this.props;
    const { searchWord } = this.state;

    const genderToLabel = (value) => {
      const gender = GENDER_VALUES.find((v) => (
        v.value === value
      ));
      return gender ? gender.label : '未設定'
    };

    const rankTypeToLabel = (value) => {
      const rankType = RANK_TYPE_VALUES.find((v) => (
        v.value === value
      ));
      return rankType ? rankType.label : '-'
    };

    return (
      <PageLayout title="登録者管理">
        {openEditDialog ? <EditDialog
          open={openEditDialog}
          user={user}
          makers={makers}
          updateUser={updateUser}
          deleteUser={deleteUser}
          closeEditDialog={closeEditDialog}
        /> : null}
        <div style={{ marginTop: 20 }}>
          <Paper className={classes.search} elevation={1}>
            <InputBase
              name="searchWord"
              value={searchWord}
              onChange={this.onChangeField}
              className={classes.input}
              placeholder="フリーワード検索"
            />
            <IconButton onClick={this.onClickSearch} className={classes.iconButton}
                        aria-label="Search">
              <SearchIcon/>
            </IconButton>
          </Paper>
        </div>
        <div className={classes.searchResult}>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow className={classes.labelHeader}>
                  <TableCell className={classes.labelHeaderCell}>{' '}</TableCell>
                  <TableCell className={classes.labelHeaderCell}>{' '}</TableCell>
                  <TableCell className={classes.labelHeaderCell}>{' '}</TableCell>
                  <TableCell className={classes.labelHeaderCell}>{' '}</TableCell>
                  <TableCell className={classes.labelHeaderCell}>{' '}</TableCell>
                  <TableCell className={classes.labelHeaderCell}>{' '}</TableCell>
                  <TableCell
                    colSpan={2}
                    className={classes.labelHeaderCell}
                    style={{ borderLeft: 1 }}
                  >
                    <div className={classes.labelHeaderCellContent}>ID</div>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    className={classes.labelHeaderCell}
                    style={{ borderLeft: 1 }}
                  >
                    <div className={classes.labelHeaderCellContent}>ポイント</div>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    className={classes.labelHeaderCell}
                    style={{ borderLeft: 1 }}
                  >
                    <div className={classes.labelHeaderCellContent}>マイカー</div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  {SortableTableCell('User.userId', 'ユーザーID')}
                  {SortableTableCell('User.userName', 'ニックネーム')}
                  {SortableTableCell('User.gender', '性別', { minWidth: 80 })}
                  {SortableTableCell('User.age', '年代', { minWidth: 80 })}
                  {SortableTableCell('User.email', 'メール')}
                  {SortableTableCell('User.appVersion', 'バージョン', { minWidth: 120 })}
                  {SortableTableCell('User.pontaId', 'ポンタ')}
                  {SortableTableCell('User.otherId', 'その他')}
                  {SortableTableCell('User.totalPoint', '累計', { minWidth: 120 })}
                  {SortableTableCell('User.rankType', 'ステータス')}
                  {SortableTableCell('Maker.name', 'メーカー')}
                  {SortableTableCell('VehicleModel.name', '車種')}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, i) => (
                  <TableRow hover key={i} onClick={() => fetchUser(user.objectId)}>
                    <TableCell size="small" align="justify" key={`${i}_userId`}>
                      {user.userId}
                    </TableCell>
                    <TableCell size="small" align="justify" key={`${i}_userName`}>
                      {user.userName}
                    </TableCell>
                    <TableCell size="small" align="justify" key={`${i}_gender`}>
                      {genderToLabel(user.gender)}
                    </TableCell>
                    <TableCell size="small" align="justify" key={`${i}_age`}>
                      {user.age ? `${user.age}代` : '未設定'}
                    </TableCell>
                    <TableCell size="small" align="justify" key={`${i}_email`}>
                      {user.email}
                    </TableCell>
                    <TableCell size="small" align="justify" key={`${i}_appVersion`}>
                      {user.appVersion}
                    </TableCell>
                    <TableCell size="small" align="justify" key={`${i}_pontaId`}>
                      {user.pontaId ? '登録済み' : '未登録'}
                    </TableCell>
                    <TableCell size="small" align="justify" key={`${i}_otherId`}>
                      {user.otherId}
                    </TableCell>
                    <TableCell size="small" align="right" key={`${i}_totalPoint`}>
                      {Number(user.totalPoint).toLocaleString()}
                    </TableCell>
                    <TableCell size="small" align="justify" key={`${i}_rankType`}>
                      {rankTypeToLabel(user.rankType)}
                    </TableCell>
                    <TableCell size="small" align="justify"
                               key={`${i}_vehicleModel_maker_name`}>
                      {user.vehicleModel.maker.name}
                    </TableCell>
                    <TableCell size="small" align="justify"
                               key={`${i}_vehicleModel_name`}>
                      {user.vehicleModel.name}
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

Users.propTypes = {
  classes: PropTypes.object.isRequired,
  openEditDialog: PropTypes.bool.isRequired,
  users: PropTypes.array,
  makers: PropTypes.object,
  user: PropTypes.object,
  fetchUsers: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  closeEditDialog: PropTypes.func.isRequired,
};

export default withStyles(styles)(Users);
