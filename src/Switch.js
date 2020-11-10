import React, { useState, useCallback, useEffect } from "react";
import _ from "lodash";
import "./Switch.css";


function Switch(props) {
    const [checked, setChecked] = useState(props.value ? true : false);

    const handleChange = (event) => {
	setChecked(!event.target.checked);
	console.log(checked);
    }


    return (
	<div key={props.value.string} className="switch">
	    <input type="checkbox"
		   onClick={handleChange} />
	</div>
    );
}

export default Switch;
