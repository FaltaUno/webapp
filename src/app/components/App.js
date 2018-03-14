import React from "react"
import Head from 'next/head'
import Header from "./Header"

import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import theme from '../static/theme'
import Fonts from './Fonts';


export default class App extends React.Component {
  componentDidMount() {
    Fonts()
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <main>
          <Head>
            <link href='/static/theme.css' rel='stylesheet' />
          </Head>
          <Header />
          {this.props.children}
        </main>
      </ThemeProvider>
    )
  }
}
