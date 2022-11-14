import numeral from "numeral";
import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import Statement from "./Statement";
import Text from "./Text";
import Prism from "prismjs";

import "./Source.css";
import "./Section.css";

// TODO: Change this per env
const HOST = 'https://account.postlight.com'

const template = Prism.languages.javascript["template-string"].inside;

Prism.languages.account = {
  ...template,
  interpolation: {
    ...template.interpolation,
    pattern: /((?:^|[^\\])(?:\\{2})*){(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
  },
};

function Section({ ast, astState, page, rawText, embedded }) {
  const [viewSource, setViewSource] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [state, setState] = useState(readFields());
  const [historyState, setHistoryState] =
    useState(new URLSearchParams(window.location.search).toString())

  function addField(k, v) {
    const newState = { ...state, [k]: v }
    const newHistoryState = new URLSearchParams(historyState)
    newHistoryState.set(k, v)
    setHistoryState(newHistoryState.toString())
    window.history.replaceState({}, null, `/${page}?${newHistoryState.toString()}`)
    setState(newState)
    return v;
  }

  function readFields() {
    const searchParams = new URLSearchParams(window.location.search);

    return Object.fromEntries(
      Object.keys(astState).map((k) => {
        return [k, searchParams.get(k) || astState[k]];
      })
    );
  }

  function toComponents(o, i) {
    switch (o.type) {
      case "text":
        return <Text key={i} {...o} />;

      case "statement":
        return (
          <span className="full-statement" key={i}>
            <Slider
              key={o.variable}
              addField={addField}
              valueFromState={state[o.variable]}
              i={i}
              {...o}
            />
            <Statement valueFromState={state[o.variable]} i={i} {...o} />
          </span>
        );

      case "expression":
        function format(n) {
          const num = numeral(n);
          if (n < 10 && n > -10) {
            return num.format("0.00");
          }
          return num.format("-0,0");
        }
        function evaluate(o) {
          const n = o.eval(state);
          state[o.variable] = n;
          return n;
        }
        const n = evaluate(o);
        const sign = n > 0 ? "positive" : "negative";
        return (
          <span className={"expression " + sign} key={i}>
            {format(n)}
          </span>
        );

      default:
        return undefined;
    }
  }

  useEffect(() => {
    if (viewSource) {
      Prism.highlightAll();
    }
  }, [viewSource]);

  let postscript = null

  if (!embedded) {
    postscript = <>
      <button onClick={() => setViewSource(!viewSource)}>
        {viewSource ? (
          <>
            <span>Hide source</span>
            <div className="down-triangle" />
          </>
        ) : (
          <>
            <span>View source</span>
            <div className="up-triangle" />
          </>
        )}
      </button>
      {viewSource && (
        <div className="source">
          <pre className="language-account">
            <code>{rawText}</code>
          </pre>
        </div>
      )}
      <button onClick={() => setShowEmbed(!showEmbed)}>
        <span>
          {showEmbed ? 'Hide embed' : 'Show embed'}
        </span>
        <div className={showEmbed ? 'down-triangle' : 'up-triangle'} />
      </button>
      {showEmbed && (
        <textarea className="embed">
          {`<iframe title="${page} - Account" src="${HOST}/${page}${window.location.search}&embed=true" height="640px" width="100%" allowtransparency="true" frameborder="0"></iframe>`}
        </textarea>
      )}
    </>
  }

  return (
    <div id="text">
      <h1>{page}</h1>
      {ast.map(toComponents)}
      {postscript}
    </div>
  );
}

export default Section;
