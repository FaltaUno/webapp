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
import EditIcon from "material-ui-icons/Edit";

import { Interpolate } from "react-i18next";
import { withI18next } from "../lib/withI18next";
import { html } from "../lang/utils";

import App from "../components/App";

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
        <Grid container justify="center" alignItems="center" className={classes.root}>
          <Card>
            <CardHeader
              avatar={creatorAvatar}
              title={cardTitle}
              subheader={cardSubheader}
            />
            <CardMedia
              image="/static/images/cards/contemplative-reptile.jpg"
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="headline" component="h2">
                {match.name}
              </Typography>
              <Typography component="p">{match.place}</Typography>
            </CardContent>
            <CardActions>
              <Grid container justify="flex-end">
                <Button className={classes.button}>{t("skipInvite")}</Button>
                <Button
                  className={classes.button}
                  color="primary"
                  variant="raised"
                >
                  {t("acceptInvite")}
                </Button>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </App>
    );
  }
}

const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit
  }
});

export default withStyles(styles)(withI18next(["match"])(MatchPage));
