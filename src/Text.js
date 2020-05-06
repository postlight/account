import React from 'react';
import './Text.css';
import Twemoji from "react-emoji-render";

function Text(props) {
    return <span className="text">
	       <Twemoji text={props.value}/>
	   </span>;

}

export default Text;
