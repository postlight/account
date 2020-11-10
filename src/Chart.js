import React from "react";
import "./Chart.css";
import { Sparklines } from 'react-sparklines';

function Chart(props) {

  return (
	  <span className="chart">
	    <Sparklines data={[5, 10, 5, 20, 8, 15]} limit={5} width={100} height={20} margin={5}>
	    </Sparklines>	  
	  </span>
  );
}

export default Chart;

