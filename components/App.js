import React from "react";

import {
  MuiThemeProvider,
  createMuiTheme,
  createPalette,
  withStyles
} from "material-ui/styles";

import lightGreen from "material-ui/colors/lightGreen";
import purple from "material-ui/colors/purple";

import Root from "./Root";

const theme = createMuiTheme({
  palette: {
    primary: { main: lightGreen[800] },
    accent: { main: purple[50] }
  }
});

const App = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <Root children={children} />
  </MuiThemeProvider>
);

export default App;
