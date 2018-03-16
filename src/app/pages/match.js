import React from "react"
import App from "../components/App"
import { get } from "../services/matches"

export default class Match extends React.Component {
  static async getInitialProps({ query }) {
    const { key } = query
    const match = await get(key)
    return { match }
  }

  render() {
    const { match } = this.props
    const { lat, lng } = match.location
    return (
      <App>
        <h1>{match.name}</h1>
        <p>{match.place}</p>
        <p>{lat},{lng}</p>
      </App>
    )
  }
}
