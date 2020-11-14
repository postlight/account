import "util";
import React, { useMemo, useReducer } from "react";
import ReactDOM from "react-dom";
import Slider from "./Slider";
import MathStatement from "./MathStatement";

import "./App.css";

function App({ast, astState}) {
    const reducer = (state, o) => {
	return {...state, ...o};
    }

    const [state, dispatch] = useReducer(reducer, astState);

    ast.map(toComponents);
    
    function toComponents(o, i) {
	if (o.type==='slider') {
	    return ReactDOM.render(	    
		<Slider dispatch={dispatch} state={state} {...o}/>,
		document.getElementById(`account-${i}`)
	    );
	}

	else if (o.type==='math') {
	    return ReactDOM.render(
		<MathStatement dispatch={dispatch} state={state} {...o}/>,
		document.getElementById(`account-${i}`)
	    );
	}
    }
    
    return null;

}

export default App;
