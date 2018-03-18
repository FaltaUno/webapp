import React from "react";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography
} from "material-ui";

import App from "../components/App";
import { getMatch } from "../services/matches";
import { getUser } from "../services/users";
import EditIcon from "material-ui-icons/Edit";

export default class MatchPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const match = await getMatch(query.key);
    const creator = await getUser(match.creatorKey);
    return { match, creator };
  }
  render() {
    const { match } = this.props;
    const latlng = [match.location.lat, match.location.lng].join(",");
    return (
      <App>
        <Card>
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
            <Button color="primary" variant="fab">
              <EditIcon/>
            </Button>
            <Button color="primary">Share</Button>
            <Button color="secondary" variant="raised">
              Share
            </Button>
            <Button color="secondary">Learn More</Button>
          </CardActions>
        </Card>
      </App>
    );
  }
}
