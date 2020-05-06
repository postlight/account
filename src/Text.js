import React from 'react';
import './Text.css';
import Twemoji from "react-emoji-render";

function Text(props) {
    return <span className="text">
	       <Twemoji key={props.i} text={props.value}/>
	   </span>;

}

export default Text;
