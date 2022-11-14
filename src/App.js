import parse from "./smarter-text";
import React from "react";
import { useParams, Navigate } from "react-router-dom";

import "./App.css";
import Section from "./Section";
import Nav from "./Nav";

const textFiles = require('./texts/compiled.json')
const textVars = Object.fromEntries(
  Object
    .entries(textFiles)
    .map(([filename, text]) => [filename, [...parse(text), text]])
);

function App() {
  let { page } = useParams();
  if (!textVars[page]) return <Navigate to="/soda" />;
  const [ast, astState, rawText] = textVars[page];

  return (
    <div className="App">
      <Nav textVars={textVars} />
      <Section key={page} ast={ast} astState={astState} rawText={rawText} page={page} />
    </div>
  );
}

export default App;
