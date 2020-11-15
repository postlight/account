import React, {useEffect} from "react";
import "./MathStatement.css";
const ExpressionParser = require("expr-eval").Parser;
const Exp = new ExpressionParser();
const numeral = require("numeral");


function Math(props) {

    const fmt = props.qualifiers?.format ? props.qualifiers.format.string : '0,0';
        
    const evaled = Exp.evaluate(props.value.language, props.state);
    
    useEffect(()=>{
	props.dispatch({[props.name]:evaled});
    }, Object.keys(props.state).map(x=>props.state[x]));

    return (
	<span className="math">
	    <span className="math">{numeral(evaled).format(fmt)}</span>
	</span>

    );
}

export default Math;
