import "util";
import parse from "./smarter-text";
import useSearchParams from "@postlight/use-search-params";
import React, { useMemo, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./App.css";
import numeral from "numeral";
import Slider from "./Slider";
import Statement from "./Statement";
import Text from "./Text";

import "./Source.css";
import "./Section.css";

function App({ ast, astState}) {
    const [state, setState] = useState(astState);

    let x = ast.map(toComponents);
    function toComponents(o, i) {

	if (o.type==='range') {
	    return ReactDOM.render(	    
		<span className="full-statement" key={i}>
		    <Slider
			key={o.variable}
			valueFromState={state[o.name]}
			setState={setState}
			i={i}
			{...o}
		    />
		    <Statement valueFromState={state[o.name]} i={i} {...o} />
		</span>,
		document.getElementById(`account-${i}`));
	}

	else if (o.type==='math') {
	    function format(n) {
		const num = numeral(n);
		if (n < 10 && n > -10) {
		    return num.format("0.00");
		}
		return num.format("-0,0");
            }
            function evaluate(o) {
		
		const n = o.eval(state);
		state[o.name] = n;
		return n;
            }
            const n = evaluate(o);
            const sign = n > 0 ? "positive" : "negative";

	    
	    return ReactDOM.render(	    	    
		<span className={"expression " + sign} key={i}>
		    {format(state[o.name])}
		</span>,
		document.getElementById(`account-${i}`));
	}
    }
    return null;

}

export default App;
