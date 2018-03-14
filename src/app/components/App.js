import React from "react"
import Head from 'next/head'
import Header from "./Header"

import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import theme from '../static/theme'

const App = ({ children }) => (
  <ThemeProvider theme={theme}>
    <main>
      <Head>
        <link href='/static/theme.css' rel='stylesheet' />
      </Head>
      <Header />
      {children}
    </main>
  </ThemeProvider>
)

export default App
