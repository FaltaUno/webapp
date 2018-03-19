import React from "react";
import Head from "next/head";
import Header from "./Header";
import CssBaseline from "material-ui/CssBaseline";

const Root = ({ children }) => (
  <main>
    <Head>
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,shrink-to-fit=no"
      />
    </Head>
    <Header />
    {children}
  </main>
);

export default Root;
