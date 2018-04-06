import { compose } from "recompose";

import React from "react";
import Button from "material-ui/Button";

import withApp from "../hocs/withApp";
import { Link } from "../lib/routes";
import { allMatches } from "../services/matches";

class MatchesPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const matches = await allMatches();
    return { matches };
  }

  render() {
    const { matches } = this.props;
    return (
      <div>
        <p>About Page w/firebase-admin</p>
        <p>{matches.length}</p>
        {matches.map(match => (
          <Link route="match" params={{ key: match.key }} key={match.key}>
            <Button>{match.name}</Button>
          </Link>
        ))}
      </div>
    );
  }
}

export default compose(withApp)(MatchesPage);
