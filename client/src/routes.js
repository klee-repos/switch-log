import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Auth from "./containers/Auth";
import RouteContainer from "./containers/RouteContainer";

const routes = (
  <Router>
    <Switch>
      <RouteContainer>
        <Route exact path="/" component={Auth} />
      </RouteContainer>
    </Switch>
  </Router>
);

export default routes;
