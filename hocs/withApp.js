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
      mounted: false,
      user: {},
      showLogin: false,
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
          <Header auth={this.state.user} showLogin={this.state.showLogin}/>
          <PageComponent auth={this.state.user} doLogin={(callback)=>{ this.handleDoLogin(callback) }} {...this.props} />
        </MuiThemeProvider>
      );
    }

    handleDoLogin(callback){
      this.setState({ showLogin: true })
    }
  };

export default withApp;
