import React from "react";

import Head from "next/head";

import CssBaseline from "material-ui/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";

import lightGreen from "material-ui/colors/lightGreen";
import purple from "material-ui/colors/purple";

import Header from "../components/Header";
import {
  onAuthStateChanged,
  signInAnonymously,
  getUserFromAuth
} from "../lib/auth";

const theme = createMuiTheme({
  palette: {
    primary: { main: lightGreen[800] },
    accent: { main: purple[50] }
  }
});

const withApp = PageComponent =>
  class WithApp extends React.Component {
    static async getInitialProps(context) {
      return await PageComponent.getInitialProps(context);
    }

    state = {
      mounted: false,
      loadingAuth: true,
      auth: { isAnonymous: true },
      user: {},
      showLogin: false,
      onLoginSuccess: () => {}
    };

    componentDidMount() {
      onAuthStateChanged(this.handleOnAuthStateChanged);

      this.setState({ mounted: true });
    }
    render() {
      if (!this.state.mounted) {
        return <div />;
      }
      return (
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Head>
            <meta
              name="viewport"
              content="width=device-width,initial-scale=1,shrink-to-fit=no"
            />
          </Head>
          <Header
            loadingAuth={this.state.loadingAuth}
            auth={this.state.auth}
            user={this.state.user}
            showLogin={this.state.showLogin}
            onLoggedUser={user => this.handleLoggedUser(user)}
            onLoginSuccess={user => this.handleLoginSuccess(user)}
          />
          <PageComponent
            loadingAuth={this.state.loadingAuth}
            auth={this.state.auth}
            user={this.state.user}
            doLogin={onLoginSuccess => {
              this.handleDoLogin(onLoginSuccess);
            }}
            {...this.props}
          />
        </MuiThemeProvider>
      );
    }

    handleOnAuthStateChanged = auth => {
      if (auth) {
        if (!auth.isAnonymous) {
          this.setState({ loadingAuth: true });
          // Get the database info
          getUserFromAuth(auth).then(user => {
            this.setState({ loadingAuth: false, auth, user });
          });
        } else {
          this.setState({ loadingAuth: false, auth, user: {} });
        }
      } else {
        this.setState({ loadingAuth: true });
        signInAnonymously();
      }
    };

    handleDoLogin(onLoginSuccess) {
      this.setState({ showLogin: true, onLoginSuccess });
    }

    handleLoggedUser(user) {
      this.setState({ showLogin: false, user });
    }

    handleLoginSuccess(user) {
      this.state.onLoginSuccess(user);
    }
  };

export default withApp;
