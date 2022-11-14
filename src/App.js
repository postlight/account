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
  const { page } = useParams();
  const embedded = new URLSearchParams(window.location.search).has('embed');

  if (!textVars[page]) {
    return <Navigate to="/soda" />;
  }

  const [ast, astState, rawText] = textVars[page];

  return (
    <div className={`App ${embedded ? 'App--embedded' : ''}`}>
      {embedded ? null : <Nav textVars={textVars} />}
      <Section key={page} ast={ast} astState={astState} rawText={rawText} page={page} embedded={embedded} />
      <footer>
        <span>
          {embedded ? <>
            This is{' '}
            <a href="https://account.postlight.com" target="_blank" rel="noreferrer">Account</a>, a
          </> : 'A'}
          {' '}
          Labs project from your friends at
        </span>
        <a href="https://postlight.com/careers" {...(embedded ? { target: '_blank', re: 'noreferrer' } : {})}>
          <img alt="Postlight, an NTT DATA Company" src="/postlight-logo.svg" width={embedded ? 63 : 125} height={embedded ? 16 : 32} />
        </a>
      </footer>
    </div>
  );
}

export default App;
