import "util";
import numeral from "numeral";
import useSearchParams from "@postlight/use-search-params";
import React, { useMemo } from "react";
import Slider from "./Slider";
import Statement from "./Statement";
import Text from "./Text";
import LineChart from './LineChart';


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
	  const inner_data = range.map(
	      (val,i)=>{
		  s[o.x] = val;
		  
		  Object.keys(ranges).forEach(x=>{
		      if (ranges[x].type==='expression') {
			  s[x] = ranges[x].eval(s);
		      }
		  })
		  const y = exp.eval(s);
		  return ({x:val, y:y})
	      }
	  );

	  const data = [{
	      id:o.y,
	      data:inner_data
	  }];

	  return <div key={i} style={{height:'400px'}} className="chart">
		     <LineChart data={data} xLabel={o.x} yLabel={o.y}/>
		 </div>
      case "paragraph":
	  return <div key={i}
		      className="spacer"></div>
	  
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

  return (
    <div id="text">
      <h1 key="h1">{props.page}</h1>
      {ast.map(toComponents)}
    </div>
  );
}

export default Section;
