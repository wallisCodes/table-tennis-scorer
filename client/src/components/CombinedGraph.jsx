import React from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function CombinedGraph({ players, heartRateOne, heartRateTwo, smoothHeartRateData, scoreHistory }){
    // Test arrays used to ensure correct baseTime and lastTime values are selected when comparing the two HR datasets
    // (spoiler: latest possible timestamps are chosen)
    // const arrayOne = [
    //     // { time: "14:55:05", value: 156 },
    //     // { time: "14:55:06", value: 145 },
    //     { time: "14:55:07", value: 144 },
    //     { time: "14:55:08", value: 150 },
    //     { time: "14:55:09", value: 140 },
    //     // { time: "14:55:10", value: 143 }
    // ];
    // const arrayTwo = [
    //     { time: "14:55:05", value: 156 },
    //     { time: "14:55:06", value: 145 },
    //     { time: "14:55:07", value: 144 },
    //     { time: "14:55:08", value: 150 },
    //     { time: "14:55:09", value: 140 },
    //     { time: "14:55:10", value: 143 }
    // ];

    // TODO/test: remove first value of heartRateOne and heartRateTwo ({time: "", value: 80}) to see if that fixes null issues
    const heartRateOneClean = heartRateOne.slice(1);
    const heartRateTwoClean = heartRateTwo.slice(1);
    console.log("heartRateOne (clean):");
    console.log(heartRateOneClean);
    console.log("heartRateTwo (clean):");
    console.log(heartRateTwoClean);

    // Potential problem: when choosing a baseTime, if there's a different value for earliest timestamp between both HR datasets,
    // e.g. "15:45:01" for P1 and "15:45:00" for P2, due to the way the smoothHeartRateData function works, I need to work with the
    // later timestamp. Similarly, when choosing a lastTime, pick the later timestamp.
    
    // const latestStartTimes = [arrayOne[0].time, arrayTwo[0].time]; // used for testing purposes
    const latestStartTimes = [heartRateOneClean[0].time, heartRateTwoClean[0].time];
    // console.log("latestStartTimes:");
    // console.log(latestStartTimes);
    const latestStartTime = latestStartTimes.sort()[1];
    // console.log(`latestStartTime: ${latestStartTime}`);
        
    // const latestFinishTimes = [arrayOne[arrayOne.length - 1].time, arrayTwo[arrayTwo.length - 1].time]; // used for testing purposes
    const latestFinishTimes = [heartRateOneClean[heartRateOneClean.length - 1].time, heartRateTwoClean[heartRateTwoClean.length - 1].time];
    // console.log("latestFinishTimes:");
    // console.log(latestFinishTimes);
    const latestFinishTime = latestFinishTimes.sort()[1];
    // console.log(`latestFinishTime: ${latestFinishTime}`);
        
    // const baseTime = new Date(`1970-01-01T${arrayOne[0].time}`).getTime();
    // const baseTime = new Date(`1970-01-01T${heartRateOneClean[0].time}`).getTime();
    // console.log(`OLD baseTime: ${baseTime}`);
    // const lastTime = new Date(`1970-01-01T${arrayOne[arrayOne.length - 1].time}`).getTime();
    // const lastTime = new Date(`1970-01-01T${heartRateOneClean[heartRateOneClean.length - 1].time}`).getTime();
    // console.log(`OLD lastTime: ${lastTime}`);

    const baseTime = new Date(`1970-01-01T${latestStartTime}`).getTime();
    console.log(`NEW baseTime: ${baseTime}`);
    const lastTime = new Date(`1970-01-01T${latestFinishTime}`).getTime();
    console.log(`NEW lastTime: ${lastTime}`);


    // Another potential problem: At the beginning when data is coming in, baseTime = lastTime. Does this matter for domain?
    // I don't think so!
    const heartRateOneFormatted = smoothHeartRateData(heartRateOneClean, baseTime, lastTime);
    const heartRateTwoFormatted = smoothHeartRateData(heartRateTwoClean, baseTime, lastTime);
    console.log("HR 1 formatted/smoothed:");
    console.log(heartRateOneFormatted);
    console.log("HR 2 formatted/smoothed:");
    console.log(heartRateTwoFormatted);


    // Creates an array of all recorded timestamps in chronological order ensuring no duplicates (hh:mm:ss format)
    const masterTimeDataset = Array.from(new Set([
        ...scoreHistory.map((d) => d.time),
        ...heartRateOneFormatted.map((d) => d.time),
        ...heartRateTwoFormatted.map((d) => d.time)
    ])).sort();
    console.log("masterTimeDataset (unifiedTimeData):");
    console.log(masterTimeDataset);
    
    let latestTimestamp = baseTime; // initial prevTime value, gets updated whenever a point is won
    
    // Converting masterTimeDataset into unix time to be used as x axis tick values
    const xAxisTicks = masterTimeDataset.map(time => new Date(`1970-01-01T${time}`).getTime());
    console.log("xAxisTicks (unifiedUnixTimeData):");
    console.log(xAxisTicks);
    

    // Creating an array where each object represents all vital info regarding plotted data (current time, heart rates
    // for both players, point winner at given time (if any) and time of previous point winner used to calculate bar widths)
    const unifiedDataset = masterTimeDataset.map((time) => {
        const timestamp = new Date(`1970-01-01T${time}`).getTime();
        const scoringData = scoreHistory.find((d) => d.time === time);
        const hrOneData = heartRateOneFormatted.find((d) => d.time === time);
        const hrTwoData = heartRateTwoFormatted.find((d) => d.time === time);
        
        // Add "prevTime" attribute wherever a point was won by someone and set it to the timestamp 
        // ...of the previous point winner or the very first timestamp for the first point
        const prevTimestamp = scoringData?.player ? latestTimestamp : null;
        if (scoringData?.player) {
            latestTimestamp = timestamp; // Update latestTimestamp for the next entry
        }
    
        return {
            time: timestamp,
            prevTime: prevTimestamp,
            player: scoringData?.player || null,
            heartRateOne: hrOneData?.value || null,
            heartRateTwo: hrTwoData?.value || null,
        };
    });
    console.log("unifiedDataset");
    console.log(unifiedDataset);
    
    // Defining important constants to calcluate bar widths, heights etc.
    const chartWidth = 1350;
    const chartHeight = 625;
    const xAxisHeight = 80;
    const yAxisWidth = 50;
    const legendHeight = 1; // Seems to be the best value to maximise the graph height
    
    // const lastTime = new Date(`1970-01-01T${masterTimeDataset[masterTimeDataset.length - 1]}`).getTime();
    // console.log(`lastTime: ${lastTime}`);
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
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: "white" }
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
                                        <p>{`Point winner: ${scoreBarData.payload.player === "P1" ? players[0].name : players[1].name}`}</p>                                        
                                        <p>{`Duration: ${minutes !== 0 ? `${minutes}m ` : ""}${secondsOnly}s`}</p>
                                    </>
                                )}

                                {/* Heart Rate Tooltip */}
                                {heartRateOneData && <p>{`${players[0].name} HR: ${heartRateOneData.value}`}</p>}
                                {heartRateTwoData && <p>{`${players[1].name} HR: ${heartRateTwoData.value}`}</p>}
                            </div>
                        );
                    }}
                />

                <Legend
                    verticalAlign="bottom"
                    height={legendHeight}
                    // Using custom payload to remove score key and add custom names/colours to line keys
                    payload={[
                        { value: players[0].name, type: "line", id: "heartRateOne", color: players[0].colour },
                        { value: players[1].name, type: "line", id: "heartRateTwo", color: players[1].colour }
                    ]}
                />

                {/* Only start generating bars when scoreHistory has data to be displayed */}
                {scoreHistory.length > 0 && (
                    <Bar 
                        dataKey="player"
                        name="point winner"
                        // height="90%"
                        shape={({ payload, index }) => {
                            // console.log("payload:");
                            // console.log(payload);

                            const barBorder = 1;
                            const barHeight = chartHeight - xAxisHeight - legendHeight;
                            // appending "4D" to hex colour string to add 30% opacity
                            const barColor = payload.player === "P1" ? `${players[0].colour}4D` : payload.player === "P2" ? `${players[1].colour}4D` : "transparent"
                            const x = ((payload.prevTime - baseTime) / (lastTime - baseTime)) * (chartWidth - yAxisWidth) + yAxisWidth;
                            const width = ((payload.time - payload.prevTime) / (lastTime - baseTime)) * (chartWidth - yAxisWidth ) - barBorder;
                            
                            // Don't render any bars if nobody has won a point
                            if (!payload.player || width <= 0) {
                                return null; // Skip this bar
                            }

                            return (
                                <g>
                                    <rect
                                        key={`bar-${payload?.prevTime}-${payload?.time}-${index}`}
                                        x={x}
                                        y={0}
                                        width={width}
                                        height={barHeight}
                                        fill={barColor}
                                    />
                                    <rect
                                        key={`border-${payload?.prevTime}-${payload?.time}-${index}`}
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
                    name={players[0].name}
                    dataKey="heartRateOne"
                    stroke={players[0].colour}
                    dot={false}
                />
                <Line
                    name={players[1].name}
                    dataKey="heartRateTwo"
                    stroke={players[1].colour}
                    dot={false}
                />
            </ComposedChart>
        </ResponsiveContainer>
    )
}