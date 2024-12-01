import React from "react";
import "../index.css"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


export default function BarGraphOnlyTwo(){    
    const exampleScoringData = [
        // { player: null, time: "14:55:00" },
        { player: "P2", time: "14:55:08" },
        { player: "P1", time: "14:55:10" },
        { player: "P2", time: "14:55:14" },
        { player: "P1", time: "14:55:22" },
        { player: "P2", time: "14:55:38" }
    ];
    
    const baseTime = new Date("1970-01-01T14:55:00").getTime(); // 50100000 (unix time)
    const transformedData = exampleScoringData.map((entry, index) => {
        const currentTime = new Date(`1970-01-01T${entry.time}`).getTime();
        const previousTime = index === 0 ? baseTime : new Date(`1970-01-01T${exampleScoringData[index - 1].time}`).getTime();
    
        return {
            player: entry.player,
            startTime: previousTime,
            endTime: currentTime,
            height: entry.player ? "100%" : 0, // Bars for null player have no height
            color: entry.player === "P1" ? "rgba(255, 0, 0, 0.3)" : entry.player === "P2" ? "rgba(0, 0, 255, 0.3)" : "transparent"
        };
    });
    
    // Logging everything I need to know in order to understand graph creation
    console.log("transformedData:");
    console.log(transformedData);
    
    const chartWidth = 1200;
    const chartHeight = 750;
    const xAxisHeight = 75;
    const timeRange = (transformedData[transformedData.length - 1].endTime - baseTime) / 1000; // Total time range in seconds
    const xScaleFactor = chartWidth / timeRange; // scale factor controls width of bars based on chart width
    console.log(`xScaleFactor: ${xScaleFactor}`);
    
    const explicitTicks = [baseTime, ...transformedData.map((d) => d.endTime)];
    console.log("explicitTicks:");
    console.log(explicitTicks);
    
    const xDomain = [baseTime, transformedData[transformedData.length - 1].endTime];
    console.log("xDomain:");
    console.log(xDomain);


    return (
        <ResponsiveContainer width={chartWidth} height="100%">
            <BarChart
                data={transformedData}
                // margin={{ top: 0, right: 0, bottom: 50, left: 0 }}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                // width={chartWidth}
                // height="100%"
            >
                <XAxis
                    type="number"
                    scale="time"
                    // dataKey="startTime"
                    dataKey="endTime"
                    // domain={['dataMin', 'dataMax']}
                    // domain={[baseTime, transformedData[transformedData.length - 1].endTime]} // Full time range
                    domain={[xDomain[0], xDomain[1]]}
                    angle={270}
                    // width={400}
                    height={xAxisHeight} // How come I can manually set height but not width?
                    // axisLine={{ stroke: "#000", strokeWidth: 1 }}
                    // padding={{ left: 0, right: 0 }}
                    // padding={{ right: 15 }}
                    tickMargin={35}
                    ticks={explicitTicks}
                    tickFormatter={(time) => {
                        const date = new Date(time);
                        return `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
                    }}
                    tick={{ forceShow: true }}
                    // interval={0}
                />
                <YAxis width={0}/>
                
                <Bar
                    dataKey="player"
                    shape={({ payload, index }) => {
                        // Align x with x-axis domain
                        const x = ((payload.startTime - xDomain[0]) / (xDomain[1] - xDomain[0])) * chartWidth;

                        // Dynamically calculate bar width
                        const width = ((payload.endTime - payload.startTime) / (xDomain[1] - xDomain[0])) * chartWidth;
                        const barHeight = chartHeight - xAxisHeight; // Calculate available height

                        return (
                            <rect
                                key={`bar-${index}`}
                                x={x}
                                y={0}
                                width={width}
                                height={barHeight} // Ensure height is not undefined
                                fill={payload.color}
                            />
                        );
                    }}
                />
                {/* <Bar dataKey="player" fill="#8884d8" /> */}
            </BarChart>
        </ResponsiveContainer>
    );
};