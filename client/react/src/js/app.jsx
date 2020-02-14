import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, Route } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme';
import store, { history } from "./store";
import Home from './containers/home';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <Router history={history}>
              <Route path="/" exact component={Home}/>
            </Router>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<App/>, window.document.getElementById('root'));
