import React from "react"
import getMatches from '../lib/getMatches'

export default class MatchesPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const matches = await getMatches()
    return { matches }
  }

  render() {
    return (
      <div>
        {this.props.matches.map((match) => (
          <p key={match.key}>Match #{match.key}</p>
        ))}
      </div>
    )
  }
}
