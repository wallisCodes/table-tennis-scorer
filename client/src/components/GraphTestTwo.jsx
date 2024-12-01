import React from "react";
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    BarElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart as ChartJS } from "react-chartjs-2";

Chart.register(
    LineController,
    LineElement,
    PointElement,
    BarElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend
);

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
    { player: "P2", time: "14:55:8" },
    { player: "P1", time: "14:55:10" },
    { player: "P1", time: "14:55:12" },
    { player: "P2", time: "14:55:14" },
    { player: "P1", time: "14:55:16" }
];

// Utility to create the master time dataset and align data
const prepareData = () => {
    const masterTime = Array.from(
        new Set([
            ...exampleHRDataOne.map((d) => d.time),
            ...exampleHRDataTwo.map((d) => d.time),
            ...exampleScoringData.map((d) => d.time),
        ])
    ).sort();

    const hrDataOne = masterTime.map((time) => {
        const match = exampleHRDataOne.find((d) => d.time === time);
        return match ? match.value : null;
    });

    const hrDataTwo = masterTime.map((time) => {
        const match = exampleHRDataTwo.find((d) => d.time === time);
        return match ? match.value : null;
    });

    const scoreBars = exampleScoringData.map((score, index) => {
        const startTime =
            index === 0
                ? masterTime[0] // First bar starts from the earliest time
                : exampleScoringData[index - 1].time;
        return {
            startTime,
            endTime: score.time,
            player: score.player,
        };
    });

    return { masterTime, hrDataOne, hrDataTwo, scoreBars };
};


export default function GraphTestTwo(){
    const { masterTime, hrDataOne, hrDataTwo, scoreBars } = prepareData();

    const barData = scoreBars.map((bar) => ({
        x: bar.startTime, // Left edge of the bar
        x2: bar.endTime,  // Right edge of the bar
        y: bar.player === "P1" ? 0.5 : -0.5, // Positioning score on separate levels
        player: bar.player,
    }));

    const data = {
        labels: masterTime,
        datasets: [
            {
                type: "line",
                label: "Player 1 Heart Rate",
                data: hrDataOne,
                borderColor: "blue",
                backgroundColor: "blue",
                fill: false,
                yAxisID: "y",
            },
            {
                type: "line",
                label: "Player 2 Heart Rate",
                data: hrDataTwo,
                borderColor: "green",
                backgroundColor: "green",
                fill: false,
                yAxisID: "y",
            },
            {
                type: "bar",
                label: "Scores",
                data: barData,
                backgroundColor: (ctx) => {
                    const bar = ctx.raw; // Access raw bar data
                    return bar.player === "P1"
                        ? "rgba(0, 0, 255, 0.5)" // 50% opacity blue
                        : "rgba(0, 128, 0, 0.5)"; // 50% opacity green
                },
                borderSkipped: false, // Prevents borders from being skipped
            },
        ],
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
                        second: "HH:mm:ss",
                    },
                },
                title: { display: true, text: "Time (HH:mm:ss)" },
            },
            y: {
                title: { display: true, text: "Heart Rate" },
                position: "left",
                beginAtZero: true,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        if (context.dataset.type === "line") {
                            return `Heart Rate: ${context.raw}`;
                        }
                        if (context.dataset.type === "bar") {
                            return `Score by ${context.raw.player}`;
                        }
                        return null;
                    },
                },
            },
        },
    };

    return <ChartJS type="bar" data={data} options={options} />;
};