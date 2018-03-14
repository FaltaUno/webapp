import React from "react"
import NextLink from 'next/link'

import AppBar from 'react-toolbox/lib/app_bar/AppBar'
import Navigation from 'react-toolbox/lib/navigation/Navigation'
import Link from 'react-toolbox/lib/link/Link'

export default ({ pathname }) => (
  <AppBar title='React Toolbox' leftIcon='menu'>
    <Navigation type="horizontal" button>
      <NextLink href="/">
        <Link href="/" active label='Home' icon='inbox' />
      </NextLink>
      <NextLink href="/about">
        <Link href="/about" label='About' icon='person' />
      </NextLink>
    </Navigation>
  </AppBar>
)
