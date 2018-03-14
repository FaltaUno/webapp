import React from "react"
import Page from "../layouts/Main"

import getMatches from '../lib/getMatches'

export default class MatchesPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const matches = await getMatches()
    return { matches }
  }

  render() {
    return (
      <Page>
        {this.props.matches.map((match) => (
          <p key={match.key}>Match #{match.key}</p>
        ))}
      </Page>
    )
  }
}
