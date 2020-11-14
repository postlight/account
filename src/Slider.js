import React, {useState, useEffect, useMemo} from "react";
import "./Slider.css";

function Slider(props) {
    
    function transform (x) {
	let v = {};
	if (x.length > 1) {
	    v = {
		formatString: x[0].formatString,
		min: x[0].value,
		max: x[1].value,
		value: x[1].value - (x[1].value - x[0].value) / 2,
	    }
	} else {
	    v = {
		formatString: x[0].formatString,
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
	    <span className="slider-value">{value}</span>	    
	</span>

    );    
}

export default Slider;
