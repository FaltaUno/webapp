import { compose, withProps } from "recompose";
import React from "react";
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

import withApp from "../hocs/withApp";
import MapView from "../components/MapView";

import { requestInvite, getInvites } from "../services/invites";
import { getMatch, onMatchChanged } from "../services/matches";
import { getUser } from "../services/users";
import Moment from "react-moment";

class MatchPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const match = await getMatch(query.key);
    const creator = await getUser(match.creatorKey);

    const invitesKeys = [];
    Object.keys(match.usersInvites).forEach(userKey => {
      let userInvite = match.usersInvites[userKey];
      invitesKeys.push(userInvite.inviteKey);
    });

    const allInvites = await getInvites(invitesKeys);
    const invites = allInvites.filter(invite => invite.approved === true);
    return {
      initialState: {
        match,
        creator,
        invites
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
    const { auth, classes, t } = this.props;
    const { match, creator, invites } = this.state;
    const latlng = [match.location.lat, match.location.lng].join(",");

    const mapHref = `http://maps.apple.com/?q=${latlng}`;

    const creatorAvatar = (
      <Avatar
        src={creator.photoURL}
        alt={creator.displayName}
        aria-label={creator.displayName}
      />
    );

    const now = new Date();
    const isFutureDate = now.getTime() < match.date;

    const cardTitle = html(t, "invitedYou", { user: creator.displayName });
    const cardSubheader = (
      <div>
        {t(isFutureDate ? "willBePlayed" : "wasPlayed")}{" "}
        <Moment calendar>{match.date}</Moment>
      </div>
    );

    const spots = match.playersNeeded - invites.length;

    let requestInviteButton = (
      <Button color="default" variant="raised" size="large">
        <CircularProgress color="inherit" size={24} />
      </Button>
    );

    if (auth && (auth.key || auth.isAnonymous)) {
      requestInviteButton = (
        <Button color="primary" variant="raised" size="large" disabled>
          {t("requestInviteSent")}
        </Button>
      );

      const userDidNotRequest = !match.usersInvites[auth.key];
      if (auth.isAnonymous || userDidNotRequest) {
        requestInviteButton = (
          <Button
            color="primary"
            variant="raised"
            size="large"
            onClick={() => this.handleRequestInvite(match)}
          >
            {t("requestInvite")}
          </Button>
        );
      }
    }

    return (
      <div>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
            <Card className={classes.card}>
              <CardHeader
                avatar={creatorAvatar}
                title={cardTitle}
                subheader={cardSubheader}
              />
              <CardContent>
                <Grid container align="center" justify="space-between">
                  <Grid item>
                    <Typography variant="display1">
                      {t("remainingSpots", { spots })}
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
                    <Button href={mapHref} color="primary">
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

  handleRequestInvite(match) {
    if (this.props.auth.isAnonymous) {
      return this.props.doLogin(auth => {
        this.doRequestInvite(match, auth);
      });
    }

    return this.doRequestInvite(match, this.props.auth);
  }

  doRequestInvite(match, user) {
    const userDidNotRequest = !match.usersInvites[user.key];
    if (userDidNotRequest) {
      return requestInvite(match, user);
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
