import numeral from "numeral";

import React from "react";
import "./Statement.css";

function Statement(props) {
  return (
    <span className="statement">
      {props.format === "dollar" ? "$" : ""}
      {numeral(props.valueFromState).format(props.value.formatString)}
      {props.format === "percentage" ? "%" : ""}
    </span>
  );
}

export default Statement;
