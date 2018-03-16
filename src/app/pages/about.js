import React from "react"
import App from "../components/App"
import getMatches from "../lib/getMatches"

export default class AboutPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const matches = await getMatches()
    return { matches }
  }
  render() {
    return (
      <App>
        <p>About Page</p>
        <p>{this.props.matches.length}</p>
        {this.props.matches.map((match) => (
          <p key={match.key}>Match #{match.key}</p>
        ))}
      </App>
    )
  }
}
