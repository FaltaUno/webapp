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
  withStyles
} from "material-ui";
import { Marker } from "react-google-maps";
// import { geolocated } from "react-geolocated";
import DirectionsIcon from "material-ui-icons/Directions";
import EditIcon from "material-ui-icons/Edit";

import { Interpolate } from "react-i18next";
import { withI18next } from "../lib/withI18next";
import { html } from "../locales/utils";

import App from "../components/App";
import MapView from "../components/MapView";

import { joinMatch } from "../services/invites";
import { getMatch, onMatchChanged } from "../services/matches";
import { getUser } from "../services/users";
import Moment from "react-moment";

class MatchPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const match = await getMatch(query.key);
    const creator = await getUser(match.creatorKey);
    return {
      initialState: {
        mounted: false,
        match,
        creator
      }
    };
  }

  constructor(props) {
    super(props);
    this.state = props.initialState;
  }

  componentDidMount() {
    this.setState({ mounted: true });
    onMatchChanged(this.state.match.key, child => {
      const match = Object.assign({}, this.state.match);
      match[child.key] = child.val();
      this.setState({ match });
    });
  }

  render() {
    if (!this.state.mounted) {
      return <div />;
    }

    const stubUserKey = "Ob0YuT27SXNrX24MmiUyu3RR2Wp1"; // Nahuel Sotelo ARG

    const { t, classes } = this.props;
    const { match, creator } = this.state;
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

    const spots = match.playersNeeded;

    return (
      <App>
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
                  <Grid item>
                    <Button
                      color="primary"
                      variant="raised"
                      size="large"
                      onClick={() => joinMatch(match, stubUserKey)}
                    >
                      {t("joinRequest")}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card className={classes.card}>
              <CardHeader title={t("informationLabel")} align="center" />
              <CardContent>
                <Typography paragraph variant="title">
                  {match.name}
                </Typography>
                <Typography paragraph>{match.notes}</Typography>
              </CardContent>
              <CardContent>
                <Grid container justify="center">
                  <Grid item xs sm>
                    <Typography
                      gutterBottom
                      variant="headline"
                      dangerouslySetInnerHTML={{
                        __html: t("placeLabel").replace(/\n/g, "<br/>")
                      }}
                    />
                    <Typography paragraph>{match.place}</Typography>
                  </Grid>
                  <Grid item align="center" xs={4} sm={3} md={2}>
                    <Typography variant="caption">¿Cómo llegar?</Typography>
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
      </App>
    );
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

export default compose(withStyles(styles), withI18next(["match"]))(MatchPage);
