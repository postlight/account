import "util";
import numeral from "numeral";
import useSearchParams from "@postlight/use-search-params";
import React, { useMemo, useState, useEffect } from "react";
import Slider from "./Slider";
import Statement from "./Statement";
import Text from "./Text";

import "./Section.css";

function Section({ ast, astState, page, rawText }) {
  const [viewSource, setViewSource] = useState();
  const searchParams = useSearchParams("replace");
  const state = useMemo(readFields, [astState, searchParams]);

  function addField(k, v) {
    searchParams.set(k, v);
    return v;
  }

  function readFields() {
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
    setViewSource(false);
  }, [page]);

  return (
    <div id="text">
      <h1 key="h1">{page}</h1>
      {ast.map(toComponents)}
      <div>
        <button onClick={() => setViewSource(!viewSource)}>
          {viewSource ? "hide" : "view"} source
        </button>
        {viewSource && (
          <pre>
            <code>{rawText}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

export default Section;
