import "util";
import parse from "./smarter-text";
import React from "react";
import { useParams } from "react-router-dom";

import "./App.css";
import Section from "./Section";
import Nav from "./Nav";

// ########################################
// Loading text files via Webpack into a hash
// ########################################

const webpackTextLoader = require.context(
  "!raw-loader!./texts",
  false,
  /\.txt$/
);

const textFiles = webpackTextLoader.keys().map((filename) => {
  return {
    filename: filename,
    text: webpackTextLoader(filename).default,
  };
});

// Just the filenames
function cleanFSInfo(k) {
  const r = k.replace(/^\.\/(.+).txt$/, "$1");
  return r;
}

const textVars = textFiles.reduce(
  (m, t) => ({ ...m, [cleanFSInfo(t.filename)]: parse(t.text) }),
  {}
);

function App(props) {
  let { page } = useParams();
  const [ast, astState, ranges] = textVars[page];
  return (
    <div className="App">
      <Section ast={ast} astState={astState} page={page} ranges={ranges} />
      <Nav textVars={textVars} />
    </div>
  );
}

export default App;
