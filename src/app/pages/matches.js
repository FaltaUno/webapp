import React from "react"
import Link from "next/link"

import App from "../components/App"
import { all } from "../services/matches"

export default class MatchesPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const matches = await all()
    return { matches }
  }
  render() {
    return (
      <App>
        <p>About Page</p>
        <p>{this.props.matches.length}</p>
        <ul>
          {this.props.matches.map(match => (
            <li key={match.key}>
              <Link href={`/match?key=${match.key}`} as={`/match/${match.key}`}>
                <a>{match.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </App>
    )
  }
}
