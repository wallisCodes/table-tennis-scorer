import React from "react";
import { BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// MASTER PLAN
// 1. Create master time dataset (no data)
// 2. Create separate datasets using master time dataset filling in times with no values as null values
//    e.g. scoreData dataset would have every possible timestamp but only have values for scores, timestamps from
//    HR data would be recorded as null values (keeps x axis consistent across all three datasets)
// 3. Combine graphs into composed chart
// 4. Make sure graph is fully responsive without breaking axes or bar widths

const exampleScoringData = [
    { player: null, time: "14:55:00" },
    { player: "P2", time: "14:55:08" },
    { player: "P1", time: "14:55:10" },
    { player: "P2", time: "14:55:14" },
    { player: "P1", time: "14:55:22" },
    { player: "P2", time: "14:55:38" }
];

// FUTURE: baseTime will be first timestamp in master time dataset (heartRate value)
// const exampleBaseTime = new Date("2024-11-20T14:55:00").getTime();
// const baseTime = new Date("1970-01-01T14:55:00").getTime();
// const baseTime = new Date("2024-11-20T14:55:00").getTime(); // 1732114500000 (unix time)
const baseTime = new Date("1970-01-01T14:55:00").getTime(); // 50100000 (unix time)
console.log(`baseTime: ${baseTime}`);
// const lastTime = new Date(`2024-11-20T${exampleScoringData[exampleScoringData.length - 1].time}`).getTime();
const lastTime = new Date(`1970-01-01T${exampleScoringData[exampleScoringData.length - 1].time}`).getTime(); // 50138000 (unix time)
console.log(`lastTime: ${lastTime}`);


const chartHeight = 800;

// IDEA: Create an array which represents the times in a format such that the first time is 0 (or 00:00:00?),
// then subsequent times are elapsed times so for example 14:55:00 would be 0, 14:55:08 would be 8 (or 00:00:08),
// 14:55:10 would be 10 (or 00:00:10) etc. and that way the widths could be more easily calculated (maybe?) and the
// x axis would be labelled as time elapsed since start of game instead of the actual time




const transformedData = exampleScoringData.map((entry, index) => {
    const currentTime = new Date(`1970-01-01T${entry.time}`).getTime();
    const previousTime = index === 0 ? baseTime : new Date(`1970-01-01T${exampleScoringData[index - 1].time}`).getTime();

    // const currentTime = new Date(`2024-11-20T${entry.time}`).getTime();
    // const previousTime = index === 0 ? baseTime : new Date(`2024-11-20T${exampleScoringData[index - 1].time}`).getTime();

    return {
        player: entry.player,
        time: entry.time,
        startTime: previousTime,
        endTime: currentTime,
        // width: (currentTime - previousTime) / 1000, // time difference in seconds
        height: entry.player ? chartHeight : 0, // Bars for null player have no height
        color: entry.player === "P1" ? "rgba(255, 0, 0, 0.3)" : entry.player === "P2" ? "rgba(0, 0, 255, 0.3)" : "transparent"
    };
});
console.log("transformedData:");
console.log(transformedData);

// Generate explicit ticks from startTime and endTime values
// const tickPositions = transformedData.map((data) => data.startTime);
// tickPositions.push(transformedData[transformedData.length - 1].endTime); // Include the last tick

// Generate explicit ticks from startTime and endTime values
const unixTickPositions = [
    ...new Set(transformedData.flatMap((data, index) =>
        index === transformedData.length - 1
            ? [data.startTime, data.endTime] // Last bar includes endTime
            : [data.startTime]
    ))
];

console.log("unixTickPositions:");
console.log(unixTickPositions);

console.log("converted times from unixTickPositions:");
console.log(unixTickPositions.map((t) => new Date(t).toISOString().slice(11, 19)));



export default function BarGraphOnly(){
    const chartWidth = 1000; // Adjust based on layout
    const timeRange = (lastTime - baseTime) / 1000; // Total time in seconds
    const timeToPixelRatio = chartWidth / timeRange; // Scale factor for bar widths

    console.log(`timeRange: ${timeRange}`); // 38
    console.log(`timeToPixelRatio: ${timeToPixelRatio}`);
    
    return (
        <ResponsiveContainer width={chartWidth} height={chartHeight}>
            <BarChart
                data={transformedData}
                // width={chartWidth}
                // height={chartHeight}
                // barCategoryGap={0}
                // margin={{ top: 0, right: 20, bottom: 50, left: 0 }}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
                <XAxis
                    // reversed
                    // mirror
                    type="number"
                    // dataKey="endTime"
                    // domain={[baseTime, lastTime]} // x axis starts at min value and ends at max value
                    domain={[50100000, 50138000]}
                    // angle={270}
                    // tickMargin={35}
                    angle={0}
                    tickMargin={0}
                    ticks={unixTickPositions} // Use explicit ticks
                    tickFormatter={(time) => {
                        const date = new Date(time);
                        // console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
                        console.log(date);
                        return `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
                        // return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
                    }}
                />
                <YAxis />
                <Tooltip labelFormatter={(time) => {
                    const date = new Date(time);
                    return `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
                }} />
                {transformedData.map((data, index) => (
                    <rect
                        key={`${data.startTime}-${data.player}`} // Unique key
                        // key={index}
                        x={((data.startTime - baseTime) * timeToPixelRatio) / 1000 } // Scaled x position  ref: /100
                        y={0} // Top-aligned bars
                        width={((data.endTime - data.startTime) * timeToPixelRatio) / 1000 } // Scale factor for width ref: /100


                        // x={data.startTime} // Use startTime directly in milliseconds
                        // y={0}
                        // width={data.endTime - data.startTime}
                        height={"100%"} // Fixed height
                        // height={data.height} // Dynamic height
                        fill={data.color} // Dynamic color
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};