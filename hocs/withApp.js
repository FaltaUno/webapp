import React from "react";

import Head from "next/head";

import CssBaseline from "material-ui/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";

import lightGreen from "material-ui/colors/lightGreen";
import purple from "material-ui/colors/purple";

import Header from "../components/Header";
import { onAuthStateChanged, signInAnonymously, parseUser } from "../lib/auth";

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
      user: {},
      showLogin: false,
      onLoginSuccess: () => {}
    };

    componentDidMount() {
      onAuthStateChanged(async firebaseUser => {
        if (!firebaseUser || firebaseUser.isAnonymous) {
          signInAnonymously();
          return this.setState({ user: firebaseUser });
        }

        // Get the database info
        let user = await parseUser(firebaseUser);
        return this.setState({ user });
      });

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
            auth={this.state.user}
            showLogin={this.state.showLogin}
            onLoggedUser={user => this.handleLoggedUser(user)}
            onLoginSuccess={user => this.handleLoginSuccess(user)}
          />
          <PageComponent
            auth={this.state.user}
            doLogin={onLoginSuccess => {
              this.handleDoLogin(onLoginSuccess);
            }}
            {...this.props}
          />
        </MuiThemeProvider>
      );
    }

    handleDoLogin(onLoginSuccess) {
      this.setState({ showLogin: true, onLoginSuccess });
    }

    handleLoggedUser(user) {
      this.setState({ user });
    }

    handleLoginSuccess(user) {
      this.state.onLoginSuccess(user);
    }
  };

export default withApp;
