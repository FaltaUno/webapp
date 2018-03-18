import React from "react";
import Button from "material-ui/Button";

import App from "../components/App";
import { Link } from "../lib/routes";
import { allMatches } from "../services/matches";


export default class MatchesPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const matches = await allMatches();
    return { matches };
  }
  render() {
    const { matches } = this.props;
    return (
      <App>
        <p>About Page w/firebase-admin</p>
        <p>{matches.length}</p>
        {matches.map(match => (
          <Link route="match" params={{ key: match.key }} key={match.key}>
            <Button>{match.name}</Button>
          </Link>
        ))}
      </App>
    );
  }
}
