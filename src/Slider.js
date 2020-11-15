import React, {useState, useEffect} from "react";
import "./Slider.css";
const numeral = require("numeral");

function Slider(props) {

    const fmt = props.qualifiers?.format ? props.qualifiers.format.string : '0,0';


    function transform (x) {
	let v = {};
	if (x.length > 1) {
	    v = {
		min: x[0].value,
		max: x[1].value,
		value: x[1].value - (x[1].value - x[0].value) / 2,
	    }
	} else {
	    v = {
		min: 0,
		max: x[0].value * 2,
		value: 1.0 * x[0].value,
	    };
	}
	return v;
    }

    
    function handleChange(event) {
	const v = 1.0 * event.target.value;
	setValue(v);
    }



    const adjustedValues = transform(props.value);

    const [value, setValue] = useState(adjustedValues.value);

    useEffect(()=>props.dispatch({[props.name]:value}), [value])


    return (
	<span className="slider">
	    <input
		type="range"
		onChange={(e) => handleChange(e)}
		value={value}
		min={adjustedValues.min}
		max={adjustedValues.max}
	    />
	    <span className="slider-value">{numeral(value).format(fmt)}</span>	    
	</span>

    );    
}

export default Slider;
