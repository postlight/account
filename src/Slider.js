import React from 'react';
import './Slider.css';

function Slider(props) {
    
    function handleChange(event) {
	props.addField(props.variable, event.target.value);
    }

    function getStep(s, max) {
	if (s.match(/\./)) {
	    return s.replace(/.+?\.(\d+)\d$/, '0.$11');
	}
	else {
	    if (max < 1000)  {
		return 1;
	    }
	    else {
		var order = Math.floor(Math.log(max) / Math.LN10
				       + 0.000000001);
		return Math.pow(10,order - 2);
	    }
	}
    }
    return <span className="slider">
	       <input type="range"
		      onChange={e=>handleChange(e)}
		      value={props.valueFromState}
		      step={getStep(props.value.formatString,
				    props.value.max)}
		      max={props.value.max}
		      min={props.value.min}/>
	   </span>;

}

export default Slider;
