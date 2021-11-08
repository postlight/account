import "util";
import parse from "./smarter-text";
import React from "react";
import { useParams, Redirect } from "react-router-dom";
import Creator from "./creator/Creator";

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
    filename,
    text: webpackTextLoader(filename).default,
  };
});

// Just the filenames
function cleanFSInfo(k) {
  const r = k.replace(/^\.\/(.+).txt$/, "$1");
  return r;
}

const textVars = textFiles.reduce(
  (m, t) => ({ ...m, [cleanFSInfo(t.filename)]: [...parse(t.text), t.text] }),
  {}
);

function App() {
  let { page, creator } = useParams();
  if (!textVars[page]) return <Redirect to="/soda" />;
  const [ast, astState, markdown] = textVars[page];

  return (
    <div className="App">
      <Nav textVars={textVars} />
      {creator ? (
        <>
          <h1>Creator</h1>
          <Creator />
        </>
      ) : (
        <Section
          ast={ast}
          astState={astState}
          markdown={markdown}
          page={page}
        />
      )}
    </div>
  );
}

export default App;
