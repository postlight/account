import numeral from "numeral";

import React from "react";
import "./Statement.css";

function Statement(props) {


    function getExplanation() {
	if (props.valueFromState) {
	    if (props.valueFromState.string) {
		return props.valueFromState.string;
	    }
	    return props.valueFromState;
	}
	return '';
    }
    
    return (
    <span className="statement">
	{getExplanation()}
    </span>
  );
}

export default Statement;
