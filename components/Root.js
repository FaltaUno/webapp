import React from "react";
import Header from "./Header";
import CssBaseline from "material-ui/CssBaseline";

const Root = ({ children }) => (
  <main>
    <Header />
    {children}
  </main>
);

export default Root;
