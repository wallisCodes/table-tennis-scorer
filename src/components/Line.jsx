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


    return (
        <>
            <Line options={options} data={data_test}/>
        </>
    )
}