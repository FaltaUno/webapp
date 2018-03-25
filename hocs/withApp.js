import React from "react";

import Head from "next/head";

import CssBaseline from "material-ui/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";

import lightGreen from "material-ui/colors/lightGreen";
import purple from "material-ui/colors/purple";

import Header from "../components/Header";
import { onAuthStateChanged, signInAnonymously } from "../lib/auth";

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
      user: {}
    };

    componentDidMount() {
      onAuthStateChanged(user => {
        // if (user) {
        //   // User is signed in.
        //   var isAnonymous = user.isAnonymous;
        //   var uid = user.uid;
        //   // ...
        // } else {
        //   // User is signed out.
        //   // ...
        // }
        this.setState({ user });
      });

      signInAnonymously();
    }
    render() {
      return (
        <MuiThemeProvider theme={theme}>
          <Head>
            <CssBaseline />
            <meta
              name="viewport"
              content="width=device-width,initial-scale=1,shrink-to-fit=no"
            />
          </Head>
          <Header user={this.state.user} />
          <PageComponent user={this.state.user} {...this.props} />
        </MuiThemeProvider>
      );
    }
  };

export default withApp;
