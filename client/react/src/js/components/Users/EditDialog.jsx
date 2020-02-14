import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  withMobileDialog,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { AGE_VALUES, GENDER_VALUES, RANK_TYPE_VALUES } from 'common/model/User';
import { DISPLAY_DATE_FORMAT } from '../../constants';

const TOTAL_CAECCO_TIME_FORMAT = 'hh時間mm分ss秒';
const HISTORY_TYPE_IN = 'in';
const HISTORY_TYPE_OUT = 'out';

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
  pointBlock: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  pointBlockLabel: {
    display: 'inline-block',
    width: 150,
    fontWeight: 'bold',
  },
  pointBlockValue: {
    display: 'inline-block',
  },
  histories: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  historyDivider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  inPointLabel: {
    color: 'red',
  },
  outPointLabel: {
    color: 'blue',
  }
});

class EditDialog extends React.Component {
  constructor(props) {
    super(props);
    const { user } = props;
    this.state = {
      userName: user.userName,
      gender: user.gender,
      age: user.age,
      email: user.email,
      otherId: user.otherId,
      makerId: user.vehicleModel.makerId,
      vehicleModelId: user.vehicleModel.objectId,
      vehicleNumber: user.vehicleNumber,
    };
    this.onChangeField = this.onChangeField.bind(this);
    this.onChangeMakerId = this.onChangeMakerId.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onChangeField(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onChangeMakerId(e) {
    this.setState({
      makerId: e.target.value,
      vehicleModelId: '',
    });
  }

  onClickSave() {
    const { userName, gender, age, email, otherId, vehicleModelId, vehicleNumber } = this.state;
    this.props.updateUser(
      this.props.user.objectId,
      {
        userName,
        gender,
        age,
        email,
        otherId,
        vehicleModelId,
        vehicleNumber,
      })
  }

  onClickDelete() {
    if (window.confirm('本当に削除してよろしいですか？')) {
      this.props.deleteUser(this.props.user.objectId, this.props.user.userId);
    }
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.props.closeEditDialog();
  }

  render() {
    const { classes, fullScreen, open, user } = this.props;

    // カエッコ履歴と交換履歴を配列化し、作成日時の降順にソート
    const createPointHistories = () => {
      const histories = [];
      user.pointExchangeHistories.PointExchangeHistory.forEach((exchangeHistory, idx) => {
        const item = user.pointExchangeHistories.PointExchangeItem[idx];
        histories.push({
          createTime: exchangeHistory.serverCreateTime,
          type: HISTORY_TYPE_OUT,
          pointExchangeHistory: exchangeHistory,
          pointExchangeItem: item,
        })
      });

      user.points.CaeccoHistory.forEach((caecco, idx) => {
        const point = user.points.Point[idx];
        const station = user.points.Station[idx];
        histories.push({
          createTime: caecco.serverCreateTime,
          type: HISTORY_TYPE_IN,
          caeccoHistory: caecco,
          point: point,
          station: station,
        })
      });
      histories.sort((a, b) => {
        if (a.createTime > b.createTime) return -1;
        if (a.createTime < b.createTime) return 1;
        return 0
      });
      return histories;
    };

    const vehicleModelItems = () => (
      this.props.makers[this.state.makerId].vehicleModels.map((vm) => (
          <MenuItem value={vm.objectId} key={vm.objectId}>{vm.name}</MenuItem>
        )
      )
    );

    const makerItems = () => (
      Object.keys(this.props.makers).map(makerId => {
          const maker = this.props.makers[makerId];
          return <MenuItem value={makerId} key={makerId}>{maker.name}</MenuItem>
        }
      )
    );

    // 合計売電時間を計算して描画する
    const renderTotalCaeccoTime = (points) => {
      const historyIds = {};
      let totalSeconds = 0;
      points.CaeccoHistory.forEach(caecco => {
        if (!historyIds[caecco.objectId]) {
          const sm = moment(caecco.startDateTime);
          const em = moment(caecco.endDateTime);
          totalSeconds += em.diff(sm, 'seconds');
          historyIds[caecco.objectId] = caecco.objectId
        }
      });
      return moment.duration(totalSeconds, 'seconds').format(TOTAL_CAECCO_TIME_FORMAT)
    };

    const renderRankType = (value) => {
      const rankType = RANK_TYPE_VALUES.find((v) => (
        v.value === value
      ));
      return rankType ? rankType.label : '-'
    };

    const renderBasicInfoSection = () => (
      <div>
        <Typography
          align="left"
          variant="subtitle1"
          className={classes.sectionTitle}
          style={{ marginTop: 10 }}
        >
          基本情報
        </Typography>
        <Grid container justify="center">
          <Grid item xs={11}>
            <TextField
              name="userName"
              label="ニックネーム"
              margin="normal"
              className={classes.textField}
              value={this.state.userName}
              style={{ width: 300 }}
              onChange={this.onChangeField}
            />
          </Grid>
          <Grid item xs={11}>
            <FormControl margin="normal">
              <InputLabel htmlFor="gender">性別</InputLabel>
              <Select
                name="gender"
                value={this.state.gender}
                onChange={this.onChangeField}
              >
                <MenuItem value="">
                  <em>未設定</em>
                </MenuItem>
                {GENDER_VALUES.map(v => (
                  <MenuItem value={v.value} key={v.value}>{v.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl margin="normal" style={{ marginLeft: 40 }}>
              <InputLabel htmlFor="age">年代</InputLabel>
              <Select
                name="age"
                value={this.state.age}
                onChange={this.onChangeField}
              >
                <MenuItem value="">
                  <em>未設定</em>
                </MenuItem>
                {AGE_VALUES.map(v => (
                  <MenuItem value={v.value} key={v.value}>{v.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={11}>
            <TextField
              name="email"
              label="メール"
              margin="normal"
              className={classes.textField}
              value={this.state.email}
              onChange={this.onChangeField}
              style={{ width: 300 }}
            />
          </Grid>
        </Grid>
      </div>
    );

    const renderIdSection = () => (
      <div>
        <Typography
          align="left"
          variant="subtitle1"
          className={classes.sectionTitle}
        >
          ID
        </Typography>
        <Grid container justify="center">
          <Grid item xs={11}>
            <TextField
              name="pontaId"
              label="ポンタID"
              margin="normal"
              value={user.pontaId ? '登録済み' : '未登録'}
              disabled
              style={{ width: 300 }}
            />
          </Grid>
          <Grid item xs={11}>
            <TextField
              name="otherId"
              label="その他ID"
              margin="normal"
              value={this.state.otherId}
              onChange={this.onChangeField}
              style={{ width: 300 }}
            />
          </Grid>
        </Grid>
      </div>
    );

    const renderMyCarSection = () => (
      <div>
        <Typography
          align="left"
          variant="subtitle1"
          className={classes.sectionTitle}
        >
          マイカー
        </Typography>
        <Grid container justify="center">
          <Grid item xs={11}>
            <FormControl margin="normal" style={{ minWidth: 300 }}>
              <InputLabel htmlFor="age">メーカー</InputLabel>
              <Select
                name="makerId"
                value={this.state.makerId}
                onChange={this.onChangeMakerId}
              >
                <MenuItem value=""><em>未設定</em></MenuItem>
                {makerItems()}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={11}>
            <FormControl margin="normal" style={{ minWidth: 300 }}>
              <InputLabel htmlFor="vehicleModelId">車種</InputLabel>
              <Select
                name="vehicleModelId"
                value={this.state.vehicleModelId}
                onChange={this.onChangeField}
              >
                <MenuItem value=""><em>未設定</em></MenuItem>
                {this.state.makerId ? vehicleModelItems() : null}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={11}>
            <TextField
              type="number"
              name="vehicleNumber"
              label="車両ナンバー"
              margin="normal"
              value={this.state.vehicleNumber}
              onChange={this.onChangeField}
              style={{ width: 300 }}
            />
          </Grid>
        </Grid>
      </div>
    );

    const renderPointSection = () => (
      <div>
        <Typography
          align="left"
          variant="subtitle1"
          className={classes.sectionTitle}
        >
          ポイント
        </Typography>
        <Grid container justify="center">
          <Grid item xs={11}>
            <div className={classes.pointBlock}>
              <div className={classes.pointBlockLabel}>累計ポイント</div>
              <div className={classes.pointBlockValue}>{`${user.totalPoint || 0} pt`}</div>
            </div>
          </Grid>
          <Grid item xs={11}>
            <div className={classes.pointBlock}>
              <div className={classes.pointBlockLabel}>ランキング</div>
              <div className={classes.pointBlockValue}>{user.ranking.getRankLabel()}</div>
            </div>
          </Grid>
          <Grid item xs={11}>
            <div className={classes.pointBlock}>
              <div className={classes.pointBlockLabel}>利用可能ポイント</div>
              <div className={classes.pointBlockValue}>{`${user.currentPoint || 0} pt`}</div>
            </div>
          </Grid>
          <Grid item xs={11}>
            <div className={classes.pointBlock}>
              <div className={classes.pointBlockLabel}>売電時間</div>
              <div className={classes.pointBlockValue}>{renderTotalCaeccoTime(user.points)}</div>
            </div>
          </Grid>
          <Grid item xs={11}>
            <div className={classes.pointBlock}>
              <div className={classes.pointBlockLabel}>ステータス</div>
              <div className={classes.pointBlockValue}>{renderRankType(user.rankType)}</div>
            </div>
          </Grid>
        </Grid>
      </div>
    );

    const renderPointHistorySection = () => {
      const pointHistories = createPointHistories();
      const hasPointHistories = pointHistories.length;
      return (
        <div>
          <Typography
            align="left"
            variant="subtitle1"
            className={classes.sectionTitle}
          >
            ポイント履歴
          </Typography>
          <Grid container justify="center">
            <Grid item xs={11} className={classes.histories}>
              {hasPointHistories ?
                pointHistories.map((pointHistory, idx) => {
                  const isOut = pointHistory.type === HISTORY_TYPE_OUT;
                  let detail = null;
                  let point = null;
                  if (isOut) {
                    detail = pointHistory.pointExchangeItem ? pointHistory.pointExchangeItem.description : null;
                    point = pointHistory.pointExchangeHistory ? pointHistory.pointExchangeHistory.usePoint : null;
                  } else {
                    detail = pointHistory.station ? pointHistory.station.name : null;
                    point = pointHistory.point ? pointHistory.point.fixedPoint : null;
                  }
                  return (
                    <React.Fragment key={idx}>
                      <Grid container justify="center">
                        <Grid item xs={12} sm={7}>
                          <div style={{ display: 'inline-block' }}>
                            <div>{detail}</div>
                            <div style={{ fontSize: '0.8rem', color: 'gray' }}>
                              {moment(pointHistory.createTime).format(DISPLAY_DATE_FORMAT)}
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <div>
                            <div style={{ display: 'inline-block', marginRight: 10 }}>
                              {isOut ? '利用ポイント' : '獲得ポイント'}
                            </div>
                            <div style={{ display: 'inline-block', fontWeight: 'bold', fontStyle: 'italic' }}>
                              <span className={isOut ? classes.outPointLabel : classes.inPointLabel}>{point}</span> P
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                      <Divider className={classes.historyDivider}/>
                    </React.Fragment>
                  )
                }) : 'ポイント履歴がありません'
              }
            </Grid>
          </Grid>
        </div>
      )
    };

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
            <Typography variant="h6">登録者情報</Typography>
            <IconButton onClick={this.handleClose} className={classes.closeButton}>
              <CloseIcon/>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {renderBasicInfoSection()}
            <Divider className={classes.divider}/>
            {renderIdSection()}
            <Divider className={classes.divider}/>
            {renderMyCarSection()}
            <Divider className={classes.divider}/>
            {renderPointSection()}
            <Divider className={classes.divider}/>
            {renderPointHistorySection()}
          </DialogContent>
          <DialogActions>
            <div>
              <Button onClick={this.onClickDelete} variant="outlined">
                削除
              </Button>
            </div>
            <Button onClick={this.handleClose} variant="outlined" color="primary" style={{ width: 120 }}>
              キャンセル
            </Button>
            <Button onClick={this.onClickSave} variant="contained" color="primary" style={{ width: 120 }}>
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
  user: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  closeEditDialog: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  makers: PropTypes.object.isRequired,
};

export default withStyles(styles)(withMobileDialog()(EditDialog));
