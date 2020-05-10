import "util";
import numeral from "numeral";
import useSearchParams from "@postlight/use-search-params";
import React, { useMemo } from "react";
import Slider from "./Slider";
import Statement from "./Statement";
import Text from "./Text";
import LineChart from "./LineChart";

import "./Section.css";

function Section(props) {
  const { ast, astState, ranges } = props;
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
      case "chart":
        const range = ranges[o.x].range;
        const exp = ranges[o.y];
        let s = Object.assign(state);

        const inner_data = range.map((val, i) => {
          s[o.x] = val;
          Object.keys(ranges).forEach((x) => {
            if (ranges[x].type === "expression") {
              s[x] = ranges[x].eval(s);
            }
          });
          const y = exp.eval(s);
          return { x: val, y: y };
        });
        const _minValue = inner_data[0].y;
        const _maxValue = inner_data[inner_data.length - 1].y;

        const [minValue, maxValue] = [_minValue, _maxValue].sort(
          (a, b) => a - b
        );
        const data = [
          {
            id: o.y,
            data: inner_data,
          },
        ];
        function c(x) {
          return x.replace(/_/g, " ").toUpperCase();
        }
        return (
          <div key={i} className="chart">
            <h3>
              {c(o.y)} <i>vs.</i> {c(o.x)}
            </h3>
            <LineChart
              data={data}
              xFormat={(x) => numeral(x).format("-0,0")}
              yFormat={(x) => {
                console.log("Y", x);
                return numeral(x).format("-0,0");
              }}
              minValue={minValue}
              maxValue={maxValue}
              xLabel={c(o.x)}
              yLabel={c(o.y)}
            />
          </div>
        );
      case "paragraph":
        return <div key={i} className="spacer"></div>;

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
        function newNum() {
          const n = o.eval();
          state[o.variable] = n;
          addField(o.variable, n);
          console.log(o.variable, n, state[o.variable]);
        }

        const n = evaluate(o);
        const sign = n > 0 ? "positive" : "negative";

        if (o.interactive) {
          return (
            <button onClick={newNum}>
              {format(state[o.variable])}
              <span role="img" aria-label="Roll dice">
                &#127922;
              </span>
            </button>
          );
        } else {
          return (
            <span className={"expression " + sign} key={i}>
              {format(n)}
            </span>
          );
        }

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
