import { compose } from "recompose";

import React from "react";
import Link from "next/link";

import { AppBar, Button, Toolbar, Typography, withStyles } from "material-ui";
import { withI18next } from "../hocs/withI18next";

import LoginModal from "./LoginModal";

class Header extends React.Component {
  static defaultProps = {
    showLogin: false
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
    const { auth, classes, pathname, t } = this.props;

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
          />
        </div>
      );
    }
    return (
      <header className={classes.root}>
        {/*
      <Link href="/">
       <a className={pathname === "/" ? "is-active" : ""}>Home</a>
    </Link>
    */}
      </header>
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
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

export default compose(withStyles(styles), withI18next(["common"]))(Header);
