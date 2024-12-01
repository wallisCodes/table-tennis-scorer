import React from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import { parse, format } from 'date-fns';
import { parse, differenceInSeconds } from 'date-fns';


const exampleHRDataOne = [
    { time: "14:55:03", value: 172 },
    { time: "14:55:04", value: 169 },
    { time: "14:55:05", value: 156 },
    { time: "14:55:06", value: 145 },
    { time: "14:55:07", value: 144 },
];

const exampleHRDataTwo = [
    { time: "14:55:03", value: 72 },
    { time: "14:55:04", value: 69 },
    { time: "14:55:05", value: 56 },
    { time: "14:55:06", value: 45 },
    { time: "14:55:07", value: 44 },
];

const exampleScoringData = [
    { player: "P2", time: "14:55:08" },
    { player: "P1", time: "14:55:10" },
    { player: "P1", time: "14:55:12" },
    { player: "P2", time: "14:55:14" },
    { player: "P1", time: "14:55:16" }
];


const processData = (hrDataOne, hrDataTwo, scoringData) => {
    const allTimes = [
        ...hrDataOne.map((d) => d.time),
        ...hrDataTwo.map((d) => d.time),
        ...scoringData.map((d) => d.time),
    ];
    const uniqueTimes = [...new Set(allTimes)].sort();
    console.log("uniqueTimes:");
    console.log(uniqueTimes);

    // Interpolated HR values
    const hrOneMap = Object.fromEntries(hrDataOne.map((d) => [d.time, d.value]));
    const hrTwoMap = Object.fromEntries(hrDataTwo.map((d) => [d.time, d.value]));
    console.log("hrOneMap:");
    console.log(hrOneMap);
    
    // Create master dataset with scores as bar chart data
    const data = uniqueTimes.map((time) => {
        // Identify which player scored for this time
        const scoreIndex = scoringData.findIndex((d) => d.time === time);
        const player = scoreIndex !== -1 ? scoringData[scoreIndex].player : null;

        return {
            time,
            hrOne: hrOneMap[time] || null,
            hrTwo: hrTwoMap[time] || null,
            player,
        };
    });
    console.log("data:");
    console.log(data);    

    // Add widths for score areas
    const scoreBars = scoringData.map((score, i) => {
        const prevTime = i === 0 ? uniqueTimes[0] : scoringData[i - 1].time;
        return {
            start: prevTime,
            end: score.time,
            player: score.player,
        };
    });
    console.log("scoreBars:");
    console.log(scoreBars);
    
    return { data, scoreBars };
};



// Example data after processing
const exampleProcessedData = processData(exampleHRDataOne, exampleHRDataTwo, exampleScoringData);

export default function GraphTestThree(){
    const { data, scoreBars } = exampleProcessedData;
    // Helper to convert time to position
    const convertTimeToPos = (time) => parse(time, "HH:mm:ss", new Date()).getTime();

    const lineData = [
        { time: "14:55:03", hrOne: 172, hrTwo: 72 },
        { time: "14:55:04", hrOne: 169, hrTwo: 69 },
        { time: "14:55:05", hrOne: 156, hrTwo: 56 },
        { time: "14:55:06", hrOne: 145, hrTwo: 45 },
        { time: "14:55:07", hrOne: 144, hrTwo: 44 }
    ];

    return (
        <ResponsiveContainer width="100%" height="90%">
            <LineChart
                data={lineData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                {/* Grid */}
                <CartesianGrid strokeDasharray="none" horizontal={true} vertical={false} />

                {/* Axes */}
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />

                {/* Heart Rate Lines */}
                <Line type="monotone" dataKey="hrOne" stroke="blue" dot={false} />
                <Line type="monotone" dataKey="hrTwo" stroke="red" dot={false} />

                {/* Scoring Areas */}
                {scoreBars.map((bar, index) => (
                    <rect
                        key={`bar-${index}`}
                        x={convertTimeToPos(bar.start)}
                        y={0}
                        width={differenceInSeconds(parse(bar.end, "HH:mm:ss", new Date()), parse(bar.start, "HH:mm:ss", new Date()))}
                        height="100%"
                        fill={bar.player === "P1" ? "rgba(0,0,255,0.5)" : "rgba(255,0,0,0.5)"}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};