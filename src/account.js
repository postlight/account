import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

// Embed me!

const accounts = document.getElementByClassName("__account__");

//ReactDOM.render(
//    <Element
//);

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/:page">
          <App />
        </Route>
        <Route path="/">
          <Redirect to="/soda" />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
