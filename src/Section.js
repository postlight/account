import "util";
import numeral from "numeral";
import useSearchParams from "@postlight/use-search-params";
import React, { useMemo } from "react";
import Slider from "./Slider";
import Statement from "./Statement";
import Text from "./Text";

import "./Section.css";

function Section(props) {
  const { ast, astState } = props;
  const searchParams = useSearchParams("replace");
  const state = useMemo(readFields, [astState, searchParams]);

  function addField(k, v) {
    searchParams.set(k, v);
    return v;
  }

  function readField(k) {
    return searchParams.get(k) || props.astState[k];
  }

  function readFields() {
    return Object.fromEntries(
      Object.entries(astState).map(([name, defaultValue]) => {
        const value = +searchParams.get(name);
        return [name, Number.isNaN(value) ? defaultValue : value];
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
        function f(n) {
          const num = numeral(n);
          if (n < 10 && n > -10) {
            return num.format("0.00");
          }
          return num.format("-0,0");
        }

        function calc(o) {
          const state = readFields();
          const result = o.eval(state);
          if (result !== state[o.variable] && !isNaN(result)) {
            addField(o.variable, result);
          }
          return result;
        }

        return (
          <span className="expression" key={i}>
            {f(o.eval(state))}
          </span>
        );

      default:
        return undefined;
    }
  }

  return (
    <div id="text">
      <h1 key="h1">{props.page}</h1>
      {ast.map(toComponents)}
    </div>
  );
}

export default Section;
