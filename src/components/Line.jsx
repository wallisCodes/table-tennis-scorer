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

export default function LineGraph({p1HeartRate, p1HeartRateOnly, p1HRTimeOnly, p2HeartRate, p2HeartRateOnly, p2HRTimeOnly, players}){
    // console.log(`p1HeartRate: ${JSON.stringify(p1HeartRate)}`);
    const minsAndSecs = new Date().toJSON().substring(14, 19);
    
    // console.log(`minutes and seconds only: ${minsAndSecs}`);
    
    const p1HROnlyFormatted = p1HeartRateOnly.slice(1);
    const p1HRTimeOnlyFormatted = p1HRTimeOnly.slice(1);
    const p2HROnlyFormatted = p2HeartRateOnly.slice(1);
    const p2HRTimeOnlyFormatted = p2HRTimeOnly.slice(1);

    const longestTimeDataset = p1HRTimeOnlyFormatted.length - p2HRTimeOnlyFormatted.length >= 0 ? p1HRTimeOnlyFormatted : p2HRTimeOnlyFormatted; 

    // console.log(`longestDataset: ${longestDatasetTimeOnly}`);
    

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

    const data_test = {
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

    // const data = {
    //     labels: [
    //         "Monday",
    //         "Tuesday",
    //         "Wednesday",
    //         "Thursday",
    //         "Friday",
    //         "Saturday",
    //         "Sunday"
    //     ],
    //     datasets: [
    //         {
    //             label: "Josh",
    //             data: [40, 10, 70, 30, 90, 20, 50],
    //             borderColor: players[0].colour
    //         },
    //         {
    //             label: "Simon",
    //             data: [60, 80, 10, 30, 60, 100, 0],
    //             borderColor: players[1].colour
    //         }
    //     ]
    // };

    return (
        <>
            <Line options={options} data={data_test}/>
        </>
    )
}