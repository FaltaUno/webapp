import React from "react";

import App from "../components/App";
import { get } from "../services/matches";

export default class MatchPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const match = await get(query.key);
    return { match };
  }
  render() {
    const { match } = this.props;
    return (
      <App>
        <h1>{match.name}</h1>
        <p>{match.place}</p>
        <p>
          {match.location.lat}, {match.location.lng}
        </p>
      </App>
    );
  }
}
