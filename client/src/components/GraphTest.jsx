import React from "react";
import { Chart, LineController, LineElement, PointElement, BarElement, CategoryScale, LinearScale, TimeScale, Title, Tooltip, Legend } from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart as ChartJS } from "react-chartjs-2";

Chart.register(LineController, LineElement, PointElement, BarElement, CategoryScale, LinearScale, TimeScale, Title, Tooltip, Legend);

const exampleHRDataOne = [
    { time: "14:55:3", value: 172 },
    { time: "14:55:4", value: 169 },
    { time: "14:55:5", value: 156 },
    { time: "14:55:6", value: 145 },
    { time: "14:55:7", value: 144 }
];

const exampleHRDataTwo = [
    { time: "14:55:3", value: 72 },
    { time: "14:55:4", value: 69 },
    { time: "14:55:5", value: 56 },
    { time: "14:55:6", value: 45 },
    { time: "14:55:7", value: 44 }
];

const exampleScoringData = [
    { player: "P2", time: "14:55:8" },
    { player: "P1", time: "14:55:10" },
    { player: "P1", time: "14:55:12" },
    { player: "P2", time: "14:55:14" },
    { player: "P1", time: "14:55:16" }
];

// Utility to create the master time dataset and align data
const prepareData = () => {
    const masterTime = Array.from(new Set([
        ...exampleHRDataOne.map(d => d.time),
        ...exampleHRDataTwo.map(d => d.time),
        ...exampleScoringData.map(d => d.time)
    ])).sort();

    const hrDataOne = masterTime.map(time => {
        const match = exampleHRDataOne.find(d => d.time === time);
        return match ? match.value : null;
    });

    const hrDataTwo = masterTime.map(time => {
        const match = exampleHRDataTwo.find(d => d.time === time);
        return match ? match.value : null;
    });

    const scores = masterTime.map(time => {
        const match = exampleScoringData.find(d => d.time === time);
        return match ? (match.player === "P1" ? 1 : -1) : 0;
    });

    const scoreColors = scores.map(score => (score > 0 ? "blue" : score < 0 ? "red" : null));

    return { masterTime, hrDataOne, hrDataTwo, scores, scoreColors };
};


export default function GraphTest(){
    const { masterTime, hrDataOne, hrDataTwo, scores, scoreColors } = prepareData();

    const data = {
        labels: masterTime,
        datasets: [
            {
                type: "line",
                label: "Player 1 Heart Rate",
                data: hrDataOne,
                borderColor: "blue",
                backgroundColor: "blue",
                fill: false
            },
            {
                type: "line",
                label: "Player 2 Heart Rate",
                data: hrDataTwo,
                borderColor: "green",
                backgroundColor: "green",
                fill: false
            },
            {
                type: "bar",
                label: "Scores",
                data: scores.map(score => Math.abs(score)), // Bar heights
                backgroundColor: scoreColors
            }
        ]
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                type: "time",
                time: {
                    parser: "HH:mm:ss",
                    tooltipFormat: "HH:mm:ss",
                    displayFormats: {
                        second: "HH:mm:ss"
                    }
                },
                title: { display: true, text: "Time" }
            },
            y: {
                title: { display: true, text: "Heart Rate / Scores" }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        if (context.dataset.type === "line") {
                            return `Heart Rate: ${context.raw}`;
                        }
                        if (context.dataset.type === "bar") {
                            return `Score: ${context.raw}`;
                        }
                        return null;
                    }
                }
            }
        }
    };

    return <ChartJS type="bar" data={data} options={options} />;
};