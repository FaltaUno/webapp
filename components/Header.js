import { compose } from "recompose";

import React from "react";
import Link from "next/link";

import {
  AppBar,
  Avatar,
  Button,
  Grid,
  Toolbar,
  Typography,
  withStyles
} from "material-ui";
import { withI18next } from "../hocs/withI18next";

import LoginModal from "./LoginModal";

class Header extends React.Component {
  static defaultProps = {
    showLogin: false,
    onLoggedUser: () => {},
    onLoginSuccess: () => {}
  };

  state = {
    isDialogOpen: false
  };

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.showLogin !== this.state.isDialogOpen) {
      this.setState({ isDialogOpen: nextProps.showLogin });
    }
  }

  render() {
    const {
      auth,
      classes,
      onLoggedUser,
      onLoginSuccess,
      pathname,
      t
    } = this.props;

    if (auth.isAnonymous) {
      return (
        <div>
          <Button
            color="primary"
            className={classes.loginButton}
            onClick={() => this.openDialog()}
          >
            {t("login.buttonLabel")}
          </Button>
          <LoginModal
            open={this.state.isDialogOpen}
            onClose={() => this.closeDialog()}
            onLoggedUser={user => onLoggedUser(user)}
            onLoginSuccess={user => onLoginSuccess(user)}
          />
        </div>
      );
    }
    return (
      <div>
        <Grid
          container
          justify="flex-end"
          alignItems="center"
          className={classes.loggedUser}
        >
          <Grid item>
            <Typography variant="button">{auth.displayName}</Typography>
          </Grid>
          <Grid item>
            <Avatar alt={auth.displayName} src={auth.photoURL} />
          </Grid>
        </Grid>
        {/*
          <Link href="/">
          <a className={pathname === "/" ? "is-active" : ""}>Home</a>
        </Link>
        */}
      </div>
    );
  }

  openDialog() {
    this.setState({ isDialogOpen: true });
  }

  closeDialog() {
    this.setState({ isDialogOpen: false });
  }
}

const styles = theme => ({
  loginButton: {
    position: "fixed",
    top: theme.spacing.unit,
    right: theme.spacing.unit
  },
  loggedUser: {
    position: "fixed",
    top: theme.spacing.unit,
    right: theme.spacing.unit * 2
  }
});

export default compose(withStyles(styles), withI18next(["common"]))(Header);
