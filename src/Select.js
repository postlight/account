import React from "react";
import "./Select.css";

function Select(props) {
    function handleChange(event) {
	props.addField(props.name, event.target.value);
	props.addField(props.name+'__VALUE__', props.options[event.target.value].string);
    }
    return (
	<span className="slider">
	    <input
		type="range"
		onChange={(e) => handleChange(e)}
		value={props.valueFromState}
		step='1'
		max={props.max}
		min={props.min}
	    />
</span>);
}

export default Select;
