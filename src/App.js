import "util";
import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import Slider from "./Slider";
import MathStatement from "./MathStatement";

import "./App.css";

function App(props) {

    const reducer = (state, o) => ({...state, ...o});
    const [state, dispatch] = useReducer(reducer, props.astState);

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
	else {
	    return null;
	}
    }
    
    props.ast.map(toComponents);
    
    return (null);

}

export default App;
