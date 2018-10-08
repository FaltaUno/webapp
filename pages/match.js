import { compose, withProps } from "recompose";
import React from "react";
import Head from "next/head";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  withStyles
} from "material-ui";
import { Marker } from "react-google-maps";
// import { geolocated } from "react-geolocated";
import DirectionsIcon from "mdi-material-ui/Directions";
import EmailIcon from "mdi-material-ui/Email";
import BellIcon from "mdi-material-ui/Bell";
import PhoneIcon from "mdi-material-ui/Phone";
import WhatsappIcon from "mdi-material-ui/Whatsapp";

import { withI18next } from "../hocs/withI18next";
import { html, nl2br } from "../lib/utils";
import {
  checkMessagingStatus,
  onMessagingTokenRefresh,
  getMessagingToken,
  onMessagingMessage
} from "../lib/messaging";

import withApp from "../hocs/withApp";
import MapView from "../components/MapView";

import { format, formatNumber, parseNumber } from "libphonenumber-js";

import { requestInvite, getInvites, getInviteRef } from "../services/invites";
import { getMatch, onMatchChanged } from "../services/matches";
import {
  getUser,
  unregisterMessagingToken,
  registerMessagingToken
} from "../services/users";
import Moment from "react-moment";
import { MenuItem } from "material-ui";

class MatchPage extends React.Component {
  static async getInitialProps(context) {
    const { req, query, asPath } = context;
    const match = await getMatch(query.key);
    const creator = await getUser(match.creatorKey);
    const { invites = {} } = match;

    const invitesKeys = Object.keys(invites).map(inviteKey => inviteKey);
    const allInvites = await getInvites(invitesKeys);
    return {
      initialState: {
        asPath,
        match,
        creator,
        invites: allInvites,
        openContactInfoDialog: false,
        contactInfoPhone: {
          country: "AR",
          phone: ""
        },
        sendingInvite: false,
        subscription: { permission: null, token: null }
      }
    };
  }

  constructor(props) {
    super(props);
    this.state = props.initialState;
  }

  componentDidMount() {
    onMatchChanged(this.state.match, match => {
      this.setState({ match });
    });
    checkMessagingStatus().then(subscription => {
      this.setState({ subscription });
    });
    onMessagingTokenRefresh(subscription => {
      const { token } = subscription;
      const { user } = this.props;
      unregisterMessagingToken(
        user.key,
        this.state.subscription.token
      ).then(() => {
        registerMessagingToken(user.key, token).then(() => {
          this.setState({ subscription });
        });
      });
    });
    onMessagingMessage(payload => {
      console.log(payload);
    });
  }

  subscribeForInviteChanges = user => {
    const { invites } = this.state;
    for (let index in invites) {
      let invite = invites[index];
      if (invite.userKey === user.key) {
        getInviteRef(invite.key).child('approved').on('value', snap => {
          let invites = [...this.state.invites]
          invites[index].approved = snap.val()
          this.setState({ invites });
        });
        return
      }
    }
    return;
  }

  componentWillReceiveProps(nextProps) {
    const { auth, user } = nextProps;
    // When the user is loaded, if she has contactInfo defined, we set it as default
    if (auth.isAnonymous !== this.props.auth.isAnonymous) {
      if (!auth.isAnonymous) {
        const { contactInfo } = user;
        if (contactInfo) {
          this.setState({ contactInfoPhone: contactInfo.phone });
        }

        this.subscribeForInviteChanges(user);
      }
    }
  }

  render() {
    const { classes, t } = this.props;
    const { asPath, match, creator, invites } = this.state;
    const latlng = [match.location.lat, match.location.lng].join(",");
    const now = new Date();
    const isFutureDate = now.getTime() < match.date;
    const spots =
      match.playersNeeded -
      invites.filter(invite => invite.approved === true).length;

    const requestInviteButton = this.getInviteButton();
    const subscribeMeForNotifications = this.getSubscribeMeButton();
    const adminContactInfo = this.getAdminContactInfo();
    const url = `${process.env.BASE_URL}${asPath}`;
    //TODO: for <head> see _document.js https://github.com/zeit/next.js/#custom-document
    return (
      <div>
        <Head>
          <title>{`${match.name}`}</title>
          <meta
            name="description"
            content={t("inviteMetaOgDescription", { matchName: match.name })}
          />
          {/* Twitter Card data */}
          <meta
            name="twitter:card"
            value={t("inviteMetaOgDescription", { matchName: match.name })}
          />
          <meta name="twitter:site" content={url} />
          <meta
            name="twitter:title"
            content={t("inviteMetaOgTitle", { userName: creator.displayName })}
          />
          <meta
            name="twitter:description"
            content={t("inviteMetaOgDescription", { matchName: match.name })}
          />
          <meta name="twitter:creator" content="@faltaUnoApp" />
          {/*  Twitter Summary card images must be at least 120x120px */}
          <meta name="twitter:image" content={creator.photoURL} />
          {/* Open Graph data */}
          <meta
            property="og:title"
            content={t("inviteMetaOgTitle", { userName: creator.displayName })}
          />
          <meta property="og:site_name" content="Falta Uno" />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={creator.photoURL} />
          <meta
            property="og:description"
            content={t("inviteMetaOgDescription", { matchName: match.name })}
          />
        </Head>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
            <Card className={classes.card}>
              <CardHeader
                avatar={
                  <Avatar
                    src={creator.photoURL}
                    alt={creator.displayName}
                    aria-label={creator.displayName}
                  />
                }
                title={html(t, "invitedYou", { user: creator.displayName })}
                subheader={
                  <div>
                    {t(isFutureDate ? "willBePlayed" : "wasPlayed")}{" "}
                    <Moment calendar>{match.date}</Moment>
                  </div>
                }
              />
              <CardContent>
                <Grid container align="center" justify="space-between">
                  <Grid item>
                    <Typography variant="headline">
                      {spots
                        ? t("remainingSpots", { spots })
                        : t("noRemainingSpots")}
                    </Typography>
                  </Grid>
                  <Grid item>{requestInviteButton}</Grid>
                </Grid>
                {subscribeMeForNotifications}
                {adminContactInfo}
              </CardContent>
            </Card>
            <Card className={classes.card}>
              <CardHeader title={t("informationLabel")} align="center" />
              <CardContent>
                <Typography paragraph variant="title">
                  {match.name}
                </Typography>
                <Typography paragraph>{nl2br(match.notes)}</Typography>
              </CardContent>
              <CardContent>
                <Grid container justify="center">
                  <Grid item xs sm>
                    <Typography gutterBottom variant="headline">
                      {t("placeLabel")}
                    </Typography>
                    <Typography paragraph>{match.place}</Typography>
                  </Grid>
                  <Grid item align="center" xs={4} sm={3} md={2}>
                    <Typography variant="caption">
                      {t("howToGetThere")}
                    </Typography>
                    <Button
                      href={`http://maps.apple.com/?q=${latlng}`}
                      color="primary"
                    >
                      <DirectionsIcon className={classes.directionIcon} />
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
              <MapView defaultCenter={match.location}>
                <Marker position={match.location} />
              </MapView>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }

  getInviteButton() {
    const { loadingAuth, auth, user, t } = this.props;
    const { match, sendingInvite } = this.state;
    let button = (
      <Button color="default" variant="raised" size="large">
        <CircularProgress color="inherit" size={24} />
      </Button>
    );

    if (!loadingAuth && auth && !sendingInvite) {
      if (auth.isAnonymous || this.userInviteStatus() === null) {
        const { openContactInfoDialog, contactInfoPhone } = this.state;
        const { country, phone } = contactInfoPhone;
        button = (
          <div>
            <Button
              color="primary"
              variant="raised"
              size="large"
              onClick={this.handleOpenContactInfoDialog}
            >
              {t("requestInvite")}
            </Button>
            <Dialog
              open={openContactInfoDialog}
              onClose={this.handleOnCloseContactInfoDialog}
              aria-labelledby="contact-info-dialog-title"
            >
              <DialogTitle id="contact-info-dialog-title">
                {t("contactInfo.title")}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {t("contactInfo.description")}
                </DialogContentText>
                <TextField
                  disabled
                  margin="normal"
                  id="email"
                  label={t("contactInfo.emailLabel")}
                  value={user.email}
                  type="email"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />
                <Grid container alignItems="flex-end">
                  <Grid item>
                    <TextField
                      id="select-currency"
                      select
                      label="Código de país"
                      value={country}
                      onChange={event =>
                        this.setState({
                          contactInfoPhone: {
                            country: event.target.value,
                            phone
                          }
                        })
                      }
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <WhatsappIcon color="primary" />
                          </InputAdornment>
                        )
                      }}
                    >
                      <MenuItem value="AR">AR (+54)</MenuItem>
                      <MenuItem value="UY">UY (+598)</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs>
                    <TextField
                      margin="normal"
                      id="phone"
                      label={t("contactInfo.phoneLabel")}
                      placeholder={t("contactInfo.phonePlacholder." + country)}
                      error={this.phoneNumberIsNotValid(contactInfoPhone)}
                      onChange={event =>
                        this.setState({
                          contactInfoPhone: {
                            country,
                            phone: event.target.value
                          }
                        })
                      }
                      value={phone}
                      type="text"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  disabled={this.phoneNumberIsNotValid(contactInfoPhone)}
                  color="primary"
                  variant="raised"
                  size="large"
                  onClick={() => this.handleRequestInvite(match)}
                >
                  {t("contactInfo.buttonLabel")}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      } else if (this.userInviteStatus() !== true) {
        button = (
          <Button color="primary" variant="raised" size="large" disabled>
            {t("requestInviteSent")}
          </Button>
        );
      } else {
        button = (
          <Button color="primary" size="large" disableRipple>
            {t("requestInviteApproved")}
          </Button>
        );
      }
    }

    return button;
  }

  userAlreadyRequestedAnInvite() {
    const { auth } = this.props;
    const { invites } = this.state;
    for (let invite of invites) {
      if (invite.userKey === auth.key) {
        return true;
      }
    }
    return false;
  }

  userInviteStatus() {
    const { auth, user } = this.props;
    const { invites } = this.state;
    for (let invite of invites) {
      if (invite.userKey === user.key) {
        return invite.requestRead && invite.approved;
      }
    }

    return null;
  }

  handleOpenContactInfoDialog = () => {
    if (this.props.auth.isAnonymous) {
      return this.props.doLogin(() => {
        // If the user didn't request to participate yet
        if (this.userInviteStatus() === null) {
          this.setState({ openContactInfoDialog: true });
        }
        return;
      });
    }

    return this.setState({ openContactInfoDialog: true });
  };

  handleOnCloseContactInfoDialog = () => {
    this.setState({ openContactInfoDialog: false });
  };

  phoneNumberIsNotValid = phoneNumber => {
    if (phoneNumber.phone) {
      const parsed = parseNumber(phoneNumber.phone, phoneNumber.country);
      const { country, phone } = parsed;
      return !phone;
    }
    return false;
  };

  formatPhoneNumber = phoneNumber => {
    if (!phoneNumber) {
      return "";
    }

    return formatNumber(phoneNumber, "International");
  };

  handlePhoneValidation = event => {
    const phoneNumber = event.target.value;
  };

  handleRequestInvite = match => {
    return this.doRequestInvite(
      match,
      this.props.user,
      this.state.contactInfoPhone,
      this.state.creator
    );
  };

  async doRequestInvite(match, user, phone, matchCreator) {
    // Va ahora en el open dialog
    this.setState({ sendingInvite: true });
    const invite = await requestInvite(match, user, phone, matchCreator);
    const invites = this.state.invites.slice();
    invites.push(invite);
    this.setState({ sendingInvite: false, invites });
    // Close the dialog
    this.handleOnCloseContactInfoDialog();
  }

  getSubscribeMeButton() {
    const { loadingAuth, auth, t } = this.props;
    const { subscription, sendingInvite } = this.state;
    if (
      !loadingAuth &&
      auth &&
      !auth.isAnonymous &&
      !sendingInvite &&
      this.userInviteStatus() !== true
    ) {
      if (subscription.permission === false) {
        return null;
      }
      let permissionButton = null;
      // If we don't know if the user already requested for notifications
      if (subscription.permission === null) {
        permissionButton = (
          <Button
            size="small"
            color="primary"
            onClick={this.handleSubscribeMeForNotifications}
          >
            {t("notifyMeWhenAdminHasAnswered")}
            <BellIcon />
          </Button>
        );
        // } else if (subscription.permission === false) {
        //   permissionButton = (
        //     <Typography color="error" variant="button">
        //       {t("cannotNotifyPermissionDenied")}
        //     </Typography>
        //   );
      } else {
        permissionButton = (
          <Typography color="primary" variant="button">
            {t("subscribedForNotifications")}
          </Typography>
        );
      }

      return (
        <Grid container justify="flex-end">
          <Grid item>{permissionButton}</Grid>
        </Grid>
      );
    }

    return null;
  }

  handleSubscribeMeForNotifications = () => {
    getMessagingToken().then(subscription => {
      const { token } = subscription;
      const { user } = this.props;
      unregisterMessagingToken(
        user.key,
        token
      ).then(() => {
        if (token !== null) {
          registerMessagingToken(user.key, token).then(() => {
            this.setState({ subscription });
          });
        }
      })
    });
  };

  getAdminContactInfo = () => {
    const { loadingAuth, auth, t } = this.props;
    const { subscription, sendingInvite } = this.state;
    if (
      !loadingAuth &&
      auth &&
      !auth.isAnonymous &&
      !sendingInvite &&
      this.userInviteStatus() === true
    ) {
      const { creator } = this.state;
      const phoneNumber = format(creator.phone, "E.164");
      const whatsappPhoneNumber = phoneNumber.substr(1); // No "+" sign
      return (<Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography variant="subheading">{t(`adminContactInfoLabel`)}</Typography>
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item>
              <Button color="primary" variant="raised" href={`https://wa.me/${whatsappPhoneNumber}`} target="_blank">
                <WhatsappIcon></WhatsappIcon>
                {t(`sendWhatsappMessage`)}
              </Button>
            </Grid>
            <Grid item>
              <Button color="primary" href={`tel:${phoneNumber}`}>
                <PhoneIcon></PhoneIcon>
                {t(`makePhoneCall`)}
              </Button>
            </Grid>
            <Grid item>
              <Button color="primary" href={`mailto:${creator.email}`}>
                <EmailIcon></EmailIcon>
                {t(`sendEmail`)}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>)
    }
    return null;
  }
}

const styles = theme => ({
  card: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  },
  invitations: {
    width: theme.spacing.unit * 10,
    height: theme.spacing.unit * 10,
    borderRadius: "100%",
    backgroundColor: "#999",
    textAlign: "center",
    verticalAlign: "middle"
  },
  directionIcon: {
    fontSize: 44
  },
  howToGoContainer: {
    textAlign: "right"
  }
});

const geoConfig = {
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
};

export default compose(
  withApp,
  withStyles(styles),
  withI18next(["match"])
)(MatchPage);
