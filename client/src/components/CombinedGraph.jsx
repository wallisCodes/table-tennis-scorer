import React from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function CombinedGraph({ matchDetails, matchStatus, players, heartRateOne, heartRateTwo, smoothHeartRateData, scoreHistory }){
    const baseTime = new Date(`1970-01-01T${matchDetails.startTime}`).getTime();
    let lastTime;
    let xAxisInterval = "preserveEnd"; // default value

    // Due to the way the smoothHeartRateData function works (i.e. when using the previous value to fill in gaps in data),
    // if there's any discrepancy between heart rate datasets regarding last time values, e.g. "15:45:41" for P1
    // and "15:45:00" for P2, the lastTime variable should utilise the latest time available.
    // This is of course, assuming there are two sets of heart rate data being applied - this won't always be the case...
    // Goal: lastTime = endTime if match finished, latestFinishTime (HR) if two sets of HR data supplied, 
    // latestHRtimestamp if one set supplied, or latestScoreTimestamp if no HR data supplied
    if (matchStatus === "complete"){
        // console.log("Condition 1 met.");
        lastTime = new Date(`1970-01-01T${matchDetails.endTime}`).getTime();
    }
    else if (heartRateOne.length > 0 && heartRateTwo.length > 0){
        // console.log("Condition 2 met.");
        const latestFinishTime = [heartRateOne[heartRateOne.length - 1].time, heartRateTwo[heartRateTwo.length - 1].time].sort()[1];
        lastTime = new Date(`1970-01-01T${latestFinishTime}`).getTime();
    }
    else if (heartRateOne.length > 0 && !(heartRateTwo.length > 0)){
        // console.log("Condition 3 met.");
        lastTime = new Date(`1970-01-01T${heartRateOne[heartRateOne.length - 1].time}`).getTime();
    }
    else if (!(heartRateOne.length > 0) && heartRateTwo.length > 0){
        // console.log("Condition 4 met.");
        lastTime = new Date(`1970-01-01T${heartRateTwo[heartRateTwo.length - 1].time}`).getTime();
    }
    else {
        // console.log("Condition 5 met.");
        const scoringTimestamps = scoreHistory.map((d) => d.time);
        lastTime = new Date(`1970-01-01T${scoringTimestamps[scoringTimestamps.length - 1]}`).getTime();
        xAxisInterval = 0;
    }

    console.log(`baseTime: ${baseTime}`);
    console.log(`lastTime: ${lastTime}`);
    console.log(`xAxisInterval: ${xAxisInterval}`);

    // const lastTime = new Date(`1970-01-01T${latestFinishTime}`).getTime();

    // Ensuring only one heart rate value per second
    const heartRateOneFormatted = smoothHeartRateData(heartRateOne, baseTime, lastTime);
    const heartRateTwoFormatted = smoothHeartRateData(heartRateTwo, baseTime, lastTime);


    // Creates an array of all recorded timestamps in chronological order ensuring no duplicates (hh:mm:ss format)
    const masterTimeDataset = Array.from(new Set([
        ...scoreHistory.map((d) => d.time),
        ...(heartRateOneFormatted ? heartRateOneFormatted.map((d) => d.time) : []),
        ...(heartRateTwoFormatted ? heartRateTwoFormatted.map((d) => d.time) : [])
    ])).sort();
   
    
    // Converting masterTimeDataset into unix time to be used as x axis tick values
    const xAxisTicks = masterTimeDataset.map(time => new Date(`1970-01-01T${time}`).getTime());
    let latestTimestamp = baseTime; // initial prevTime value, gets updated whenever a point is won

    
    // Creating an array where each object represents all vital info regarding plotted data (current time, heart rates
    // for both players, point winner at given time (if any) and time of previous point winner used to calculate bar widths)
    const unifiedDataset = masterTimeDataset.map((time) => {
        const timestamp = new Date(`1970-01-01T${time}`).getTime();
        const scoringData = scoreHistory.find((d) => d.time === time);
        const hrOneData = heartRateOneFormatted ? heartRateOneFormatted.find((d) => d.time === time) : null;
        const hrTwoData = heartRateTwoFormatted ? heartRateTwoFormatted.find((d) => d.time === time) : null;
        
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

    
    // Defining important constants to calcluate bar widths, heights etc.
    const chartWidth = 1350;
    const chartHeight = 625;
    const xAxisHeight = 80;
    const yAxisWidth = 50;
    const legendHeight = 1; // Seems to be the best value to maximise the graph height

    // Using custom payload to remove score key and add custom names/colours to line keys
    const legendPayload = [];
    if (heartRateOneFormatted) {
        legendPayload.push({ value: players[0].name, type: "line", id: "heartRateOne", color: players[0].colour });
        
    }
    if (heartRateTwoFormatted) {
        legendPayload.push({ value: players[1].name, type: "line", id: "heartRateTwo", color: players[1].colour });
    }
      
    
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
                    interval={xAxisInterval} // FIX: not showing all ticks when no HR data is present (i.e. just scoring data)
                />
                <YAxis 
                    domain={['dataMin - 10', 'dataMax + 10']}
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
                        const heartRateOneText = payload.find((item) => item.dataKey === "heartRateOne");
                        const heartRateTwoText = payload.find((item) => item.dataKey === "heartRateTwo");

                        return (
                            <div style={{ backgroundColor: "lightgrey", color: "black", border: "1px solid black", padding: "5px" }}>
                                {
                                    // TODO (awaiting feedback): if total unifiedDataset.length > X, only render tooltips for scoreBarData
                                }
                                
                                {/* Scoring Bar Tooltip */}
                                {scoreBarData && (
                                    <>
                                        <p>{`Point winner: ${scoreBarData.payload.player === "P1" ? players[0].name : players[1].name}`}</p>                                        
                                        <p>{`Duration: ${minutes !== 0 ? `${minutes}m ` : ""}${secondsOnly}s`}</p>
                                    </>
                                )}

                                {/* Heart Rate Tooltip */}
                                {heartRateOneText && <p>{`${players[0].name} HR: ${heartRateOneText.value}`}</p>}
                                {heartRateTwoText && <p>{`${players[1].name} HR: ${heartRateTwoText.value}`}</p>}
                            </div>
                        );
                    }}
                />

                <Legend
                    verticalAlign="bottom"
                    height={legendHeight}
                    payload={legendPayload}
                />

                {/* Only start generating bars when scoreHistory has data to be displayed */}
                {scoreHistory.length > 0 && (
                    <Bar 
                        dataKey="player"
                        name="point winner"
                        shape={({ payload, index }) => {
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

                {/* Line Graphs - only plot where data is available */}
                {heartRateOneFormatted && 
                <Line
                    name={players[0].name}
                    dataKey="heartRateOne"
                    stroke={players[0].colour}
                    dot={false}
                    isAnimationActive={false}
                />}

                {heartRateTwoFormatted && 
                <Line
                    name={players[1].name}
                    dataKey="heartRateTwo"
                    stroke={players[1].colour}
                    dot={false}
                    isAnimationActive={false}
                />}
            </ComposedChart>
        </ResponsiveContainer>
    )
}