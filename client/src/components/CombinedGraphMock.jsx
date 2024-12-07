import React from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const exampleHRDataOne = [
    { time: "14:55:00", value: 160 },
    { time: "14:55:01", value: 163 },
    { time: "14:55:02", value: 167 },
    { time: "14:55:03", value: 172 },
    { time: "14:55:04", value: 169 },
    { time: "14:55:05", value: 156 },
    { time: "14:55:06", value: 145 },
    { time: "14:55:07", value: 144 },
    { time: "14:55:08", value: 150 },
    { time: "14:55:09", value: 140 },
    { time: "14:55:10", value: 143 },
    { time: "14:55:11", value: 147 },
    { time: "14:55:12", value: 152 },
    { time: "14:55:13", value: 149 },
    { time: "14:55:14", value: 136 },
    { time: "14:55:15", value: 125 },
    { time: "14:55:16", value: 124 },
    { time: "14:55:17", value: 130 },
    { time: "14:55:18", value: 160 },
    { time: "14:55:19", value: 163 },
    { time: "14:55:20", value: 167 },
    { time: "14:55:21", value: 172 },
    { time: "14:55:22", value: 169 },
    { time: "14:55:23", value: 156 },
    { time: "14:55:24", value: 145 },
    { time: "14:55:25", value: 144 },
    { time: "14:55:26", value: 150 },
    { time: "14:55:27", value: 140 },
    { time: "14:55:28", value: 143 },
    { time: "14:55:29", value: 147 },
    { time: "14:55:30", value: 152 },
    { time: "14:55:31", value: 149 },
    { time: "14:55:32", value: 136 },
    { time: "14:55:33", value: 125 },
    { time: "14:55:34", value: 124 },
    { time: "14:55:35", value: 130 },
    { time: "14:55:36", value: 135 },
    { time: "14:55:37", value: 144 },
    { time: "14:55:38", value: 150 },
];

const exampleHRDataTwo = [
    { time: "14:55:00", value: 60 },
    { time: "14:55:01", value: 63 },
    { time: "14:55:02", value: 67 },
    { time: "14:55:03", value: 72 },
    { time: "14:55:04", value: 69 },
    { time: "14:55:05", value: 56 },
    { time: "14:55:06", value: 45 },
    { time: "14:55:07", value: 44 },
    { time: "14:55:08", value: 50 },
    { time: "14:55:09", value: 40 },
    { time: "14:55:10", value: 43 },
    { time: "14:55:11", value: 47 },
    { time: "14:55:12", value: 52 },
    { time: "14:55:13", value: 49 },
    { time: "14:55:14", value: 36 },
    { time: "14:55:15", value: 25 },
    { time: "14:55:16", value: 24 },
    { time: "14:55:17", value: 30 },
    { time: "14:55:18", value: 60 },
    { time: "14:55:19", value: 63 },
    { time: "14:55:20", value: 67 },
    { time: "14:55:21", value: 72 },
    { time: "14:55:22", value: 69 },
    { time: "14:55:23", value: 56 },
    { time: "14:55:24", value: 45 },
    { time: "14:55:25", value: 44 },
    { time: "14:55:26", value: 50 },
    { time: "14:55:27", value: 40 },
    { time: "14:55:28", value: 43 },
    { time: "14:55:29", value: 47 },
    { time: "14:55:30", value: 52 },
    { time: "14:55:31", value: 49 },
    { time: "14:55:32", value: 36 },
    { time: "14:55:33", value: 25 },
    { time: "14:55:34", value: 24 },
    { time: "14:55:35", value: 30 },
    { time: "14:55:36", value: 35 },
    { time: "14:55:37", value: 44 },
    { time: "14:55:38", value: 50 },
];

const exampleScoringData = [
    { player: "P1", time: "14:55:08" },
    { player: "P2", time: "14:55:10" },
    { player: "P2", time: "14:55:14" },
    { player: "P1", time: "14:55:22" },
    { player: "P2", time: "14:55:38" },
    // { player: "P1", time: "14:56:42" }
];

// variable times for testing
// const exampleScoringData = [
//         { player: "P1", time: "15:45:08" },
//         { player: "P2", time: "15:45:10" },
//         { player: "P2", time: "15:45:14" },
//         { player: "P1", time: "15:45:22" },
//         { player: "P2", time: "15:45:38" },
// ];

// const testArray = ["14:30:20", "13:31:20", "15:29:20"];
// console.log(`testArray: ${testArray}`);
// const sortedTestArray = testArray.sort();
// console.log(`testArray SORTED: ${sortedTestArray}`);


export default function CombinedGraphMock(){
    // Creating an array of all recorded timestamps in chronological order ensuring no duplicates (hh:mm:ss format)
    const masterTimeDataset = Array.from(new Set([
        ...exampleScoringData.map((d) => d.time),
        ...exampleHRDataOne.map((d) => d.time),
        ...exampleHRDataTwo.map((d) => d.time),
    ])).sort();
    console.log("masterTimeDataset (unifiedTimeData):");
    console.log(masterTimeDataset);
    
    // Converting masterTimeDataset into unix time to be used as x axis tick values
    const xAxisTicks = masterTimeDataset.map(time => new Date(`1970-01-01T${time}`).getTime());
    console.log("xAxisTicks (unifiedUnixTimeData):");
    console.log(xAxisTicks);
    
    const baseTime = xAxisTicks[0];
    console.log(`baseTime: ${baseTime}`);
    const lastTime = xAxisTicks[xAxisTicks.length - 1];
    console.log(`lastTime: ${lastTime}`);
    let latestTimestamp = baseTime; // initial prevTime value, gets updated whenever a point is won
    
    
    // Creating an array where each object represents all vital info regarding plotted data (current time, heart rates
    // for both players, point winner at given time (if any) and time of previous point winner used to calculate bar widths)
    const unifiedDataset = masterTimeDataset.map((time) => {
        // console.log(`Data point #${index + 1}:`);
        const timestamp = new Date(`1970-01-01T${time}`).getTime();
        // console.log(`unifiedDataset timestamp: ${timestamp}`);
        const scoringData = exampleScoringData.find((d) => d.time === time);
        // console.log("unifiedDataset scoringData:");
        // console.log(scoringData);
        const hrOneData = exampleHRDataOne.find((d) => d.time === time);
        // console.log("unifiedDataset hrOneData:");
        // console.log(hrOneData);
        const hrTwoData = exampleHRDataTwo.find((d) => d.time === time);
        // console.log("unifiedDataset hrTwoData:");
        // console.log(hrTwoData);
        
        // Add "prevTime" attribute wherever a point was won by someone and set it to the timestamp 
        // ...of the previous point winner or the very first timestamp in the case of the first point
        const prevTimestamp = scoringData?.player ? latestTimestamp : null;
        if (scoringData?.player) {
            latestTimestamp = timestamp; // Updating latestTimestamp for the next entry
        }
    
        return {
            time: timestamp,
            prevTime: prevTimestamp,
            player: scoringData?.player || null,
            heartRateOne: hrOneData?.value || null,
            heartRateTwo: hrTwoData?.value || null,
        };
    });
    console.log("unifiedDataset:");
    console.log(unifiedDataset);
    
    // Defining important constants to calcluate bar widths, heights etc.
    const chartWidth = 1350;
    const chartHeight = 625;
    const xAxisHeight = 80;
    const yAxisWidth = 50;
    const legendHeight = 1; // Seems to be the best value to maximise the graph height
    
    // const xDomain = [baseTime, lastTime];
    // console.log(`xDomain: ${xDomain}`);
    
    
    return (
        <ResponsiveContainer width={chartWidth} height={chartHeight}>
            <ComposedChart 
                data={unifiedDataset}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
                {/* Axes */}
                <XAxis
                    type="number"
                    scale="time"
                    dataKey="time"
                    domain={[baseTime, lastTime]}
                    angle={270}
                    height={xAxisHeight}
                    tickMargin={35}
                    ticks={xAxisTicks}
                    tickFormatter={(time) => {
                        const date = new Date(time);
                        return `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
                    }}
                    tick={{fill: "white"}}
                    tickLine={{ stroke: "white", strokeWidth: 1 }}
                    axisLine={{ stroke: "white", strokeWidth: 1 }}
                    // interval="preserveStartEnd"
                    // interval={0}
                />
                <YAxis 
                    orientation="left"
                    tick={{fill: "white"}}
                    tickLine={{ stroke: "white", strokeWidth: 1 }}
                    axisLine={{ stroke: "white", strokeWidth: 1 }}
                    width={yAxisWidth}
                    label={{
                        value: "Heart Rate (bpm)",
                        angle: -90,
                        position: "insideLeft", // Place it inside the chart on the left
                        style: { textAnchor: "middle", fill: "white" }, // Center the text and style it
                    }}
                />

                {/* Tooltips */}
                <Tooltip
                    content={({ active, payload }) => {
                        if (!active || !payload || payload.length === 0) return null;

                        // Extract scoring bar data (if present)
                        const scoreBarData = payload.find((item) => item.dataKey === "player");

                        // Calculate duration only if scoreBarData exists
                        const durationInSeconds = (scoreBarData?.payload.time - scoreBarData?.payload.prevTime) / 1000;
                        // Default minutes and secondsOnly to 0 if durationInSeconds is undefined (|| 0)
                        const minutes = Math.floor(durationInSeconds / 60) || 0; 
                        const secondsOnly = Math.floor(durationInSeconds % 60) || 0;

                        // Extract heart rate data
                        const heartRateOneData = payload.find((item) => item.dataKey === "heartRateOne");
                        const heartRateTwoData = payload.find((item) => item.dataKey === "heartRateTwo");
                        // console.log("heartRateOneData:");
                        // console.log(heartRateOneData);

                        return (
                            <div style={{ backgroundColor: "lightgrey", color: "black", border: "1px solid black", padding: "5px" }}>
                                {
                                    // TODO: if total unifiedDataset.length > X, only render tooltips for scoreBarData
                                }
                                
                                {/* Scoring Bar Tooltip */}
                                {scoreBarData && (
                                    <>
                                        <p>{`Point winner: ${scoreBarData.payload.player === "P1" ? "Player 1" : "Player 2"}`}</p>                                        
                                        <p>{`Duration: ${minutes !== 0 ? `${minutes}m` : ""}${secondsOnly}s`}</p>
                                    </>
                                )}

                                {/* Heart Rate Tooltip */}
                                {heartRateOneData && <p>{`Player 1 HR: ${heartRateOneData.value}`}</p>}
                                {heartRateTwoData && <p>{`Player 2 HR: ${heartRateTwoData.value}`}</p>}
                            </div>
                        );
                    }}
                />

                <Legend
                    verticalAlign="bottom"
                    height={legendHeight}
                    // Using custom payload to remove score key and add custom names/colours to line keys
                    payload={[
                        { value: "Player 1", type: "line", id: "heartRateOne", color: "red" },
                        { value: "Player 2", type: "line", id: "heartRateTwo", color: "blue" }
                    ]}
                />

                {/* Only start generating bars when exampleScoringData has data to be displayed */}
                {exampleScoringData.length > 0 && (
                    <Bar 
                        dataKey="player"
                        name="point winner"
                        // height="90%"
                        shape={({ payload, index }) => {
                            // console.log("payload:");
                            // console.log(payload);
                            // if (!payload.prevTime || !payload.time) return null; // Skip bars without player data

                            // const startTime = payload?.prevTime;
                            // const endTime = payload?.time;

                            // Skip rendering if startTime or endTime is missing or invalid
                            // if (!startTime || !endTime || isNaN(startTime) || isNaN(endTime)) {
                            // if (!endTime || isNaN(endTime)) {
                            //     console.warn(`Skipping bar at index ${index}:`, payload);
                            //     return null;
                            // }

                            const barBorder = 1;
                            const barHeight = chartHeight - xAxisHeight - legendHeight;
                            // appending "4D" to hex colour string to add 30% opacity
                            const barColor = payload.player === "P1" ? "rgba(255, 0, 0, 0.3)" : payload.player === "P2" ? "rgba(0, 0, 255, 0.3)" : "transparent"
                            const x = ((payload.prevTime - baseTime) / (lastTime - baseTime)) * (chartWidth - yAxisWidth) + yAxisWidth;
                            const width = ((payload.time - payload.prevTime) / (lastTime - baseTime)) * (chartWidth - yAxisWidth ) - barBorder;

                            return (
                                <g>
                                    <rect
                                        key={`bar-${index}`}
                                        x={x}
                                        y={0}
                                        width={width}
                                        height={barHeight}
                                        fill={barColor}
                                    />
                                    <rect
                                        key={`border-${index}`}
                                        x={x + width}
                                        y={0}
                                        width={barBorder}
                                        height={barHeight}
                                        fill="white"
                                    />
                                </g>
                            );
                        }}
                    />
                )}

                {/* Line Graphs */}
                <Line
                    name="Player 1"
                    dataKey="heartRateOne"
                    // yAxisId="left"
                    stroke="red"
                    dot={false}
                />
                <Line
                    name="Player 2"
                    dataKey="heartRateTwo"
                    // yAxisId="left"
                    stroke="blue"
                    dot={false}
                />
            </ComposedChart>
        </ResponsiveContainer>
    )
}