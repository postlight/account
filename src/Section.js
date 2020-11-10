import "util";
import numeral from "numeral";
import useSearchParams from "@postlight/use-search-params";
import React, { useMemo, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Slider from "./Slider";
import Statement from "./Statement";
import Text from "./Text";

import "./Source.css";
import "./Section.css";

function Section({ ast, astState}) {
    const state = useState(astState);


    return ast.map(toComponents);
    function toComponents(o, i) {
    return ReactDOM.render(<div>XXXXXX</div>, document.getElementById('account-1'))	    
	console.log(o.type);
	switch (o.type) {
	    
	case "range":
	    return (
		<span className="full-statement" key={i}>
		    <Slider
			key={o.variable}
			valueFromState={state[o.variable]}
			i={i}
			{...o}
		    />
		    <Statement valueFromState={state[o.variable]} i={i} {...o} />
		</span>,
		document.getElementById(`account-${i}`));

	case "math":
            function format(n) {
		const num = numeral(n);
		if (n < 10 && n > -10) {
		    return num.format("0.00");
		}
		return num.format("-0,0");
            }
            function evaluate(o) {
		const n = o.eval(state[0]);
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
            return null;
	}
    }


}

export default Section;
