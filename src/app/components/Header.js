import React from "react"

import Link from 'next/link'

export default ({ pathname }) => (
  <div>
    <Link href="/">
      <a>Home</a>
    </Link>
    <Link href="/matches">
      <a>Matches</a>
    </Link>
  </div>
)
