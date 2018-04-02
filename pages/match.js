import { compose, withProps } from "recompose";
import React from "react";
import Head from "next/head";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Typography,
  withStyles,
  CircularProgress
} from "material-ui";
import { Marker } from "react-google-maps";
// import { geolocated } from "react-geolocated";
import DirectionsIcon from "mdi-material-ui/Directions";

import { withI18next } from "../hocs/withI18next";
import { html, nl2br } from "../lib/utils";
import { Router } from "../lib/routes";

import withApp from "../hocs/withApp";
import MapView from "../components/MapView";

import { requestInvite, getInvites } from "../services/invites";
import { getMatch, onMatchChanged } from "../services/matches";
import { getUser } from "../services/users";
import Moment from "react-moment";

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
        invites: allInvites
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
                    <Typography variant="display1">
                      {spots
                        ? t("remainingSpots", { spots })
                        : t("noRemainingSpots")}
                    </Typography>
                  </Grid>
                  <Grid item>{requestInviteButton}</Grid>
                </Grid>
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
    const { match } = this.state;
    let button = (
      <Button color="default" variant="raised" size="large">
        <CircularProgress color="inherit" size={24} />
      </Button>
    );

    if (!loadingAuth && auth) {
      if (auth.isAnonymous || this.userInviteStatus() === null) {
        button = (
          <Button
            color="primary"
            variant="raised"
            size="large"
            onClick={() => this.handleRequestInvite(match)}
          >
            {t("requestInvite")}
          </Button>
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

  handleRequestInvite(match) {
    if (this.props.auth.isAnonymous) {
      return this.props.doLogin(user => {
        this.doRequestInvite(match, user);
      });
    }

    return this.doRequestInvite(match, this.props.user);
  }

  async doRequestInvite(match, user) {
    if (this.userInviteStatus() === null) {
      const invite = await requestInvite(match, user);
      const invites = this.state.invites.slice();
      invites.push(invite);
      this.setState({ invites });
    }
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

export default compose(withApp, withStyles(styles), withI18next(["match"]))(
  MatchPage
);
