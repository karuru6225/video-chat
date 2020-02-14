import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AppPot from 'common/apppot';
import { POINT_TYPE_VALUES, STATUS_APPROVED, STATUS_REJECT, STATUS_UNAPPROVED } from 'common/model/Point';
import PageLayout from '../Layout/PageLayout';
import { DISPLAY_DATE_FORMAT } from '../../constants';

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
  approvalButton: {
    marginRight: theme.spacing(1),
  },
  approvedLabel: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  rejectLabel: {
    marginRight: theme.spacing(1),
    color: 'gray',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  inputFixedPoint: {
    textAlign: 'right',
  }
});

class PointApproval extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.points && prevState.points !== nextProps.points) {
      const pointsState = [];
      nextProps.points.forEach((point) => {
        pointsState.push({
          objectId: point.objectId,
          user: point.user,
          station: point.station,
          caeccoHistory: point.caeccoHistory,
          pointType: point.pointType,
          filename: point.filename,
          point: point.point,
          fixedPoint: point.fixedPoint,
          memo: point.memo,
          status: point.status,
          refFixedPoint: React.createRef(),
          refMemo: React.createRef(),
        })
      });

      return {
        points: pointsState,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.points = [];
    this.state = {
      points: [],
    };
    this.onClickApproval = this.onClickApproval.bind(this);
    this.onClickReject = this.onClickReject.bind(this);
  }

  componentDidMount() {
    this.props.fetchPoints();
  }

  onClickApproval(objectId, idx) {
    const fixedPoint = this.state.points[idx].refFixedPoint.current.value;
    const memo = this.state.points[idx].refMemo.current.value;
    if (window.confirm('ポイント承認を確定します。よろしいですか？\n※ 確定後は変更ができませんのでご注意ください')) {
      this.props.approvalPoint(objectId, fixedPoint, memo);
    }
  }

  onClickReject(objectId, idx) {
    const memo = this.state.points[idx].refMemo.current.value;
    if (window.confirm('ポイント却下を確定します。よろしいですか？\n※ 確定後は変更ができませんのでご注意ください')) {
      this.props.rejectPoint(objectId, memo);
    }
  }

  render() {
    const {
      classes,
    } = this.props;

    const {
      points,
    } = this.state;

    const renderActions = (point, idx) => {
      let content = null;
      switch (point.status) {
        case STATUS_UNAPPROVED:
          content = (
            <div>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => this.onClickApproval(point.objectId, idx)}
                className={classes.approvalButton}
              >
                承認
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => this.onClickReject(point.objectId, idx)}
              >
                却下
              </Button>
            </div>
          );
          break;
        case STATUS_APPROVED:
          content = (
            <div className={classes.approvedLabel}>承認済み</div>
          );
          break;
        case STATUS_REJECT:
          content = (
            <div className={classes.rejectLabel}>却下済み</div>
          );
          break;
        default:
          content = null
      }
      return content
    };

    const renderPointType = (value) => {
      const pointType = POINT_TYPE_VALUES.find(p => p.value === value);
      return pointType ? pointType.label : '';
    };

    return (
      <PageLayout title="ポイント承認">
        <div className={classes.contents}>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell size="small" className={classes.headerCell}
                             style={{ minWidth: 100, width: 100 }}>ユーザーID</TableCell>
                  <TableCell size="small" className={classes.headerCell}
                             style={{ minWidth: 120, width: 120 }}>ニックネーム</TableCell>
                  <TableCell size="small" className={classes.headerCell}
                             style={{ minWidth: 150, width: 150 }}>店舗名</TableCell>
                  <TableCell size="small" className={classes.headerCell}
                             style={{ minWidth: 180, width: 180 }}>開始日時</TableCell>
                  <TableCell size="small" className={classes.headerCell}
                             style={{ minWidth: 180, width: 180 }}>終了日時</TableCell>
                  <TableCell size="small" className={classes.headerCell}
                             style={{ minWidth: 100, width: 100 }}>種別</TableCell>
                  <TableCell size="small" className={classes.headerCell}
                             style={{ minWidth: 90, width: 90 }}>画像</TableCell>
                  <TableCell size="small" className={classes.headerCell}
                             style={{ minWidth: 90, width: 90 }}>仮pt</TableCell>
                  <TableCell size="small" className={classes.headerCell}
                             style={{ minWidth: 120, width: 120 }}>確定pt</TableCell>
                  <TableCell size="small" className={classes.headerCell}
                             style={{ minWidth: 150, width: 150 }}>メモ</TableCell>
                  <TableCell size="small" className={classes.headerCell}
                             style={{ minWidth: 180, width: 180 }}>{''}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {points.map((point, idx) => {
                  const unapproved = point.status === STATUS_UNAPPROVED;
                  return (
                    <TableRow key={point.objectId}>
                      <TableCell size="small" align="justify">
                        {point.user.userId}
                      </TableCell>
                      <TableCell size="small" align="justify">
                        {point.user.userName}
                      </TableCell>
                      <TableCell size="small" align="justify">
                        {point.station.name}
                      </TableCell>
                      <TableCell size="small" align="justify">
                        {moment(point.caeccoHistory.startDateTime).format(DISPLAY_DATE_FORMAT)}
                      </TableCell>
                      <TableCell size="small" align="justify">
                        {moment(point.caeccoHistory.endDateTime).format(DISPLAY_DATE_FORMAT)}
                      </TableCell>
                      <TableCell size="small" align="justify">
                        {renderPointType(point.pointType)}
                      </TableCell>
                      <TableCell size="small" align="center">
                        {point.filename ?
                          (
                            <IconButton size="small" onClick={() => window.open(AppPot.File.getUrl(point.filename))}>
                              <CloudDownloadIcon/>
                            </IconButton>
                          ) : '-'
                        }
                      </TableCell>
                      <TableCell size="small" align="right">
                        {`${point.point} pt`}
                      </TableCell>
                      <TableCell size="small" align="justify">
                        <FormControl>
                          <Input
                            id="adornment-weight"
                            type="number"
                            endAdornment={<InputAdornment position="end">pt</InputAdornment>}
                            aria-describedby="weight-helper-text"
                            inputProps={{
                              'aria-label': 'Weight',
                              index: idx,
                              ref: point.refFixedPoint,
                            }}
                            classes={{ input: classes.inputFixedPoint }}
                            disabled={!unapproved}
                            defaultValue={point.fixedPoint === null ? point.point : point.fixedPoint}
                          />
                        </FormControl>
                      </TableCell>
                      <TableCell size="small" align="justify">
                        <TextField
                          id="standard-uncontrolled"
                          defaultValue={point.memo || ''}
                          disabled={!unapproved}
                          inputProps={{
                            index: idx,
                            ref: point.refMemo
                          }}
                        />
                      </TableCell>
                      <TableCell size="small" align="justify">
                        {renderActions(point, idx)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </PageLayout>
    );
  }
}

PointApproval.propTypes = {
  classes: PropTypes.object.isRequired,
  points: PropTypes.array,
  fetchPoints: PropTypes.func.isRequired,
  approvalPoint: PropTypes.func.isRequired,
  rejectPoint: PropTypes.func.isRequired,
};

export default withStyles(styles)(PointApproval);
