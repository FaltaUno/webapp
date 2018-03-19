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
import EditIcon from "material-ui-icons/Edit";

import { Interpolate } from "react-i18next";
import { withI18next } from "../lib/withI18next";
import { html } from "../locales/utils";

import App from "../components/App";
import MapView from "../components/MapView";

import { getMatch } from "../services/matches";
import { getUser } from "../services/users";
import Moment from "react-moment";

class MatchPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const match = await getMatch(query.key);
    const creator = await getUser(match.creatorKey);
    return { match, creator };
  }
  render() {
    const { t, classes, match, creator } = this.props;
    const latlng = [match.location.lat, match.location.lng].join(",");

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

    return (
      <App>
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.root}
        >
          <Grid item xs={6}>
            <Card>
              <CardHeader
                avatar={creatorAvatar}
                title={cardTitle}
                subheader={cardSubheader}
              />
              <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                  {match.name}
                </Typography>
                <Typography component="p">{match.notes}</Typography>
                <Grid
                  container
                  alignItems="center"
                  justify="space-between"
                  direction="row"
                >
                  <Grid item>
                    <Typography component="p">{match.place}</Typography>
                  </Grid>
                  <Grid item>
                    <Button color="primary">{t("howToGo")}</Button>
                  </Grid>
                </Grid>
              </CardContent>
              <MapView defaultCenter={match.location}>
                <Marker position={match.location} />
              </MapView>
              <CardActions>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Button>
                      {t("skipInvite")}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color="primary"
                      variant="raised"
                    >
                      {t("acceptInvite")}
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </App>
    );
  }
}

const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  }
});

const geoConfig = {
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
};

export default compose(withStyles(styles), withI18next(["match"]))(MatchPage);
