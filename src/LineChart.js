import React from "react";
import { ResponsiveLine } from "@nivo/line";

function LineChart(props) {
  return (
    <ResponsiveLine
      data={props.data}
      yScale={{
            type: "linear",
            min: props.minValue,
            max: props.maxValue,
	    
      }}
      animate={false}
      margin={{ top: 0, right: 10, bottom: 45, left: 70 }}
      xScale={{ type: "point" }}
	curve="monotoneX"
            enableArea={true}
            areaOpacity={0.07}
	
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
        //		legend: props.xLabel,
        legendOffset: 56,
        legendPosition: "middle",
        format: props.xFormat,
      }}
      axisLeft={{
        orient: "left",
        tickRotation: 0,
        //		legend: props.yLabel,
        //		legendOffset: -70,
        legendPosition: "middle",
        format: props.yFormat,
      }}
      markers={[
        {
          axis: "y",
          value: 0,
          lineStyle: { stroke: "#F00", strokeWidth: 2 },
        },
      ]}
    />
  );
}

export default LineChart;
