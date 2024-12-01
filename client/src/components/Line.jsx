import { Line } from "react-chartjs-2";
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function LineGraph({players, heartRateOneOnly, heartRateOneTimeOnly, heartRateTwoOnly, heartRateTwoTimeOnly}){
    // console.log(`p1HeartRate: ${JSON.stringify(p1HeartRate)}`);
    const minsAndSecs = new Date().toJSON().substring(14, 19);
    
    // console.log(`minutes and seconds only: ${minsAndSecs}`);
    
    const p1HROnlyFormatted = heartRateOneOnly.slice(1);
    const p1HRTimeOnlyFormatted = heartRateOneTimeOnly.slice(1);
    const p2HROnlyFormatted = heartRateTwoOnly.slice(1);
    const p2HRTimeOnlyFormatted = heartRateTwoTimeOnly.slice(1);

    const longestTimeDataset = p1HRTimeOnlyFormatted.length - p2HRTimeOnlyFormatted.length >= 0 ? p1HRTimeOnlyFormatted : p2HRTimeOnlyFormatted; 

    // console.log(`longestDataset: ${longestDatasetTimeOnly}`);
    
    // const exampleHRDataOne = [
    //     {time: "14:55:3", value: 172},
    //     {time: "14:55:3", value: 158},
    //     {time: "14:55:4", value: 169},
    //     {time: "14:55:5", value: 156},
    //     {time: "14:55:6", value: 145},
    //     {time: "14:55:7", value: 144}
    // ];
    
    // const exampleHRDataTwo = [
    //     {time: "14:55:3", value: 72},
    //     {time: "14:55:3", value: 58},
    //     {time: "14:55:4", value: 69},
    //     {time: "14:55:5", value: 56},
    //     {time: "14:55:6", value: 45},
    //     {time: "14:55:7", value: 44}
    // ];
    
    // const exampleScoringData = [
    //     {player: "P2", time: "14:58:28"},
    //     {player: "P1", time: "14:58:32"},
    //     {player: "P1", time: "14:58:37"},
    //     {player: "P2", time: "14:58:41"},
    //     {player: "P1", time: "14:58:47"}
    // ];

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "white"
                }
            },
            title: {
                display: true,
                text: "Heart rates in BPM for both players",
                color: "white"
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "white"
                }
            },
            y: {
                ticks: {
                    color: "white"
                }
            }
        }
    };

    // const data_test = {
    //     labels: longestTimeDataset,
    //     datasets: [
    //         {
    //             label: players[0].name,
    //             data: p1HROnlyFormatted,
    //             borderColor: players[0].colour
    //         },
    //         {
    //             label: players[1].name,
    //             data: p2HROnlyFormatted,
    //             borderColor: players[1].colour
    //         }
    //     ]
    // };

    const data_test_2 = {
        labels: longestTimeDataset,
        datasets: [
            {
                label: players[0].name,
                data: p1HROnlyFormatted,
                borderColor: players[0].colour
            },
            {
                label: players[1].name,
                data: p2HROnlyFormatted,
                borderColor: players[1].colour
            }
        ]
    };


    return <Line options={options} data={data_test_2}/>
}

