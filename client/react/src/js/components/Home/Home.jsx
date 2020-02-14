import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Header from './Header';
import Loading from '../../containers/loading';
import ScreenNotification from '../../containers/screenNotification';

const cardBase = {
  textDecoration: 'none',
  color: '#fff',
  margin: '0 auto',
  width: 230,
  minHeight: 90,
  display: 'table',
  textAlign: 'center',
  borderRadius: 5,
  fontWeight: 'bold',
};

const styles = () => ({
  root: {
    flexGrow: 1,
    margin: '40px 0',
    padding: 20,
  },
  cardLink:
    Object.assign({
      backgroundColor: '#a6b8a2',
      '&:hover': {
        backgroundColor: '#87b87e',
      }
    }, cardBase)
  ,
  disabledCardLink:
    Object.assign({
      pointerEvents: 'none',
      backgroundColor: '#c5c9c3',
    }, cardBase)
  ,
  link: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.fileInputStations = React.createRef();
    this.fileInputChargingStands = React.createRef();
    this.onClickStationsUpload = this.onClickStationsUpload.bind(this);
    this.onClickChargingStandsUpload = this.onClickChargingStandsUpload.bind(this);
    this.onChangeStationsFile = this.onChangeStationsFile.bind(this);
    this.onChangeChargingStandsFile = this.onChangeChargingStandsFile.bind(this);
  }

  onClickStationsUpload() {
    // 同じファイルの選択を許可させたいため
    this.fileInputStations.current.value = null;
    this.fileInputStations.current.click();
  }

  onClickChargingStandsUpload() {
    // 同じファイルの選択を許可させたいため
    this.fileInputChargingStands.current.value = null;
    this.fileInputChargingStands.current.click();
  }

  onChangeStationsFile(e) {
    const fileData = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => (
      this.props.uploadStations(reader.result)
    );
    reader.readAsText(fileData);
  }

  onChangeChargingStandsFile(e) {
    const fileData = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => (
      this.props.uploadChargingStands(reader.result)
    );
    reader.readAsText(fileData);
  }

  render() {
    const {
      classes,
      isAuth,
      login,
      logout,
      downloadStations,
      downloadUsers,
      downloadPoints,
      downloadPointExchangeHistories,
    } = this.props;

    const renderUsers = () => (
      <Link to="/users" className={isAuth ? classes.cardLink : classes.disabledCardLink}>
        <div className={classes.link}>登録者管理</div>
      </Link>
    );

    const renderPointApproval = () => (
      <Link to="/point_approval" className={isAuth ? classes.cardLink : classes.disabledCardLink}>
        <div className={classes.link}>ポイント承認</div>
      </Link>
    );

    const renderPointExchangeItems = () => (
      <Link to="/point_exchange_items" className={isAuth ? classes.cardLink : classes.disabledCardLink}>
        <div className={classes.link}>ポイント交換アイテム<br/>管理</div>
      </Link>
    );

    const renderPushNotifications = () => (
      <Link to="/push_notifications" className={isAuth ? classes.cardLink : classes.disabledCardLink}>
        <div className={classes.link}>プッシュ通知</div>
      </Link>
    );

    const renderNotifications = () => (
      <Link to="/notifications" className={isAuth ? classes.cardLink : classes.disabledCardLink}>
        <div className={classes.link}>お知らせ送信</div>
      </Link>
    );

    const renderUsersDownload = () => (
      <a href="javascript:void(0)" className={isAuth ? classes.cardLink : classes.disabledCardLink}
         onClick={downloadUsers}>
        <div className={classes.link}>登録者データ<br/>CSV出力</div>
      </a>
    );

    const renderApprovalPointsDownload = () => (
      <a href="javascript:void(0)" className={isAuth ? classes.cardLink : classes.disabledCardLink}
         onClick={downloadPoints}>
        <div className={classes.link}>ポイント承認<br/>CSV出力</div>
      </a>
    );

    const renderPointExchangeHistoriesDownload = () => (
      <a href="javascript:void(0)" className={isAuth ? classes.cardLink : classes.disabledCardLink}
         onClick={downloadPointExchangeHistories}>
        <div className={classes.link}>ポイント交換履歴<br/>CSV出力</div>
      </a>
    );

    const renderChargingStandsUpload = () => (
      <a href="javascript:void(0)" className={isAuth ? classes.cardLink : classes.disabledCardLink}
         onClick={this.onClickChargingStandsUpload}>
        <div className={classes.link}>充放電器リスト<br/>TSVアップロード</div>
        <input
          type="file"
          id="chargingStandsFile"
          style={{ display: 'none' }}
          ref={this.fileInputChargingStands}
          accept="text/tab-separated-values"
          onChange={this.onChangeChargingStandsFile}
        />
      </a>
    );

    const renderStationUpload = () => (
      <a href="javascript:void(0)" className={isAuth ? classes.cardLink : classes.disabledCardLink}
         onClick={this.onClickStationsUpload}>
        <div className={classes.link}>ステーション<br/>CSVアップロード</div>
        <input
          type="file"
          id="stationsFile"
          style={{ display: 'none' }}
          ref={this.fileInputStations}
          accept="text/csv"
          onChange={this.onChangeStationsFile}
        />
      </a>
    );

    const renderStationDownload = () => (
      <a href="javascript:void(0)" className={isAuth ? classes.cardLink : classes.disabledCardLink}
         onClick={downloadStations}>
        <div className={classes.link}>ステーション<br/>CSV出力</div>
      </a>
    );

    return (
      <div>
        <Loading/>
        <ScreenNotification/>
        <Header isAuth={isAuth} login={login} logout={logout}/>
        <div className={classes.root}>
          <Grid container spacing={3} justify="center">
            <Grid item xs={10}>
              <Grid container spacing={5} justify="center">
                <Grid item xs={12} sm={6} md={4}>
                  {renderUsers()}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderPointApproval()}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderPointExchangeItems()}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderPushNotifications()}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderNotifications()}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderUsersDownload()}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderApprovalPointsDownload()}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderPointExchangeHistoriesDownload()}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderChargingStandsUpload()}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderStationUpload()}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderStationDownload()}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  isAuth: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  uploadStations: PropTypes.func.isRequired,
  downloadStations: PropTypes.func.isRequired,
  uploadChargingStands: PropTypes.func.isRequired,
  downloadUsers: PropTypes.func.isRequired,
  downloadPoints: PropTypes.func.isRequired,
  downloadPointExchangeHistories: PropTypes.func.isRequired,
};

export default withStyles(styles)(Home);
