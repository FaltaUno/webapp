import { compose } from "recompose";

import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid
} from "material-ui";

import Slide from "material-ui/transitions/Slide";

import FacebookIcon from "mdi-material-ui/Facebook";
import EmailIcon from "mdi-material-ui/Email";
import WhatsappIcon from "mdi-material-ui/Whatsapp";

import { withI18next } from "../hocs/withI18next";
import { loadAuth, loadFacebookAuthProvider, getUserFromAuth } from "../lib/auth";
import { nl2br } from "../lib/utils";
import { loadDB, normalizeSnap } from "../lib/database";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

class LoginModal extends React.Component {
  static defaultProps = {
    open: false,
    onClose: () => {},
    onLoggedUser: () => {},
    onLoginSuccess: () => {}
  };
  render() {
    const { t } = this.props;
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        transition={Transition}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {t("login.modalTitle")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {nl2br(t("login.modalDescription"))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <Button
                color="primary"
                variant="raised"
                onClick={() => {
                  this.handleFacebookLogin();
                }}
              >
                <FacebookIcon />
                {t("login.facebookButton")}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    );
  }

  handleFacebookLogin() {
    // TODO: refactor in services
    const auth = loadAuth();
    const provider = loadFacebookAuthProvider();
    // -- Default Expo Permissions -- //
    // 'public_profile',
    // 'email',
    // -- Custom permissions -- //
    // 'user_friends',

    provider.addScope("user_birthday");
    auth.useDeviceLanguage();
    auth
      .signInWithPopup(provider)
      .then(result => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const firebaseUser = result.user;
        return firebaseUser;
      })
      .then(async firebaseUser => {
        const user = await getUserFromAuth(firebaseUser);
        this.props.onLoggedUser(user);
        this.props.onLoginSuccess(user)
      })
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.error(error);
      });
  }
}

export default compose(withI18next(["common"]))(LoginModal);
