import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Main from "./pages/main/Main";

const App: React.FC = () => {
  return (
    <HashRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/main">
          <Main />
        </Route>
      </Switch>
    </HashRouter>
  );
};

export default App;
