import React from "react";
import { ResponsiveLine } from '@nivo/line'

function LineChart(props)
{
      return (
    <ResponsiveLine
        data={props.data}
	animate={false}
        margin={{ top: 50, right: 20, bottom: 50, left: 50 }}
        xScale={{ type: 'point' }}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: props.xLabel,
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickRotation: 0,
            legend: props.yLabel,
            legendOffset: -40,
            legendPosition: 'middle'
        }}
    />
      )

      }


export default LineChart;
