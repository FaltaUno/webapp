import { compose } from "recompose";

import React from "react";
import Link from "next/link";

import {
  AppBar,
  Avatar,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  withStyles,
  Menu,
  MenuItem,
  CircularProgress
} from "material-ui";
import { withI18next } from "../hocs/withI18next";
import { signOut } from "../lib/auth";

import LoginModal from "./LoginModal";

class Header extends React.Component {
  static defaultProps = {
    loadingAuth: true,
    auth: { isAnonymous: true },
    user: {},
    showLogin: false,
    onLoggedUser: () => {},
    onLoginSuccess: () => {}
  };

  state = {
    isDialogOpen: false,
    anchorEl: null
  };

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.showLogin !== this.state.isDialogOpen) {
      this.setState({ isDialogOpen: nextProps.showLogin });
    }
  }

  render() {
    const { loadingAuth, auth, user } = this.props;
    const { classes, t } = this.props;
    const { anchorEl } = this.state;

    //   ,
    //   onLoginSuccess,
    const open = Boolean(anchorEl);

    let rightPane;

    if (loadingAuth) {
      rightPane = <CircularProgress color="inherit" />;
    } else if (auth.isAnonymous) {
      rightPane = (
        <div>
          <Button color="inherit" onClick={this.handleOpenDialog}>
            {t("login.buttonLabel")}
          </Button>
          <LoginModal
            open={this.state.isDialogOpen}
            onClose={this.handleCloseDialog}
            onLoggedUser={this.handleOnLoggedUser}
            onLoginSuccess={this.handleOnLoginSuccess}
          />
        </div>
      );
    } else {
      const anchorOrigin = {
        vertical: "top",
        horizontal: "right"
      };
      rightPane = (
        <div>
          <Button
            color="inherit"
            aria-owns={open ? "menu-appbar" : null}
            aria-haspopup="true"
            onClick={this.handleMenu}
          >
            {user.displayName}
            <Avatar
              alt={user.displayName}
              src={user.photoURL}
              className={classes.buttonAvatar}
            />
          </Button>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={anchorOrigin}
            transformOrigin={anchorOrigin}
            open={open}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.logOut}>{t(`logout.buttonLabel`)}</MenuItem>
          </Menu>
        </div>
      );
    }

    return (
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="title" color="inherit" className={classes.flex}>
            {t("app.name")}
          </Typography>
          {rightPane}
        </Toolbar>
      </AppBar>
    );
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  logOut = () => {
    signOut().then(() => {
      this.handleClose();
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleOpenDialog = () => {
    this.setState({ isDialogOpen: true });
  };

  handleCloseDialog = () => {
    this.setState({ isDialogOpen: false });
  };

  handleOnLoggedUser = user => {
    this.props.onLoggedUser(user);
  };

  handleOnLoginSuccess = user => {
    this.props.onLoginSuccess(user);
  };
}

const styles = theme => ({
  loggedUser: {
    position: "fixed",
    top: theme.spacing.unit,
    right: theme.spacing.unit * 2
  },
  flex: {
    flex: 1
  },
  toolbar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonAvatar: {
    marginLeft: 15
  }
});

export default compose(withStyles(styles), withI18next(["common"]))(Header);
