import { useState } from 'react'
import './App.css'

function App() {
    const [playerOne, setPlayerOne] = useState({name: "John", score: 8, heartRate: 100, serving: true, games: 0});
    const [playerTwo, setPlayerTwo] = useState({name: "Gary", score: 6, heartRate: 100, serving: false, games: 1});
    const [format, setFormat] = useState("1");
    const [p1HeartRate, setP1HeartRate] = useState(0);



    async function connect(props) {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['heart_rate'] }],
            acceptAllDevices: false,
        })

        console.log(`%c\n<3`, 'font-size: 82px;', 'Starting HR...\n\n');
        const server = await device.gatt?.connect();
        const service = await server.getPrimaryService('heart_rate');
        const char = await service.getCharacteristic('heart_rate_measurement');
        char.oncharacteristicvaluechanged = props.onChange;
        char.startNotifications();
        return char;
    }
  
  
  
  
  
    function printHeartRate(event) {
        // setHeartRate(event.target.value.getInt8(1));
        const heartRate = event.target.value.getInt8(1);
        setP1HeartRate(heartRate);
        const prev = hrData[hrData.length - 1];
        hrData[hrData.length] = heartRate;
        hrData = hrData.slice(-200);
        let arrow = '';
        if (heartRate !== prev) arrow = heartRate > prev ? '⬆' : '⬇';
        console.clear();
        console.graph(hrData);
        console.log(`%c\n💚 ${heartRate} ${arrow}`, 'font-size: 24px;', '\n\n(To disconnect, refresh or close tab)\n\n');
    }
  
  
    // function setupConsoleGraphExample(height, width) {
    //     const canvas = document.createElement('canvas');
    //     const context = canvas.getContext('2d');
    //     canvas.height = height;
    //     canvas.width = width;
    //     context.fillStyle = '#fff';
    //     window.console.graph = data => {
    //         const n = data.length;
    //         const units = Math.floor(width / n);
    //         width = units * n;
    //         context.clearRect(0, 0, width, height);
    //         for (let i = 0; i < n; ++i) {
    //             context.fillRect(i * units, 0, units, 100 - (data[i] / 2));
    //         }
    //         console.log('%c ', `font-size: 0; padding-left: ${width}px; padding-bottom: ${height}px;
    //         background: url("${canvas.toDataURL()}"), -webkit-linear-gradient(#eee, #888);`,)
    //     }
    // }

    // console.log("Testing");

    // // Basic example that prints a live updating chart of the heart rate history.
    // // Note: This should only be used as a quick/hacky test, it's not optimized.
    // let hrData = new Array(200).fill(10);
    
    // console.clear();
    // setupConsoleGraphExample(100, 400);
    // connect({ onChange: printHeartRate }).catch(console.error);






    return (
        <>
            <div className="players-container">
                <ul className="player-one">
                    <li className="player-name">{playerOne.name}</li>
                    <li className="player-score">{playerOne.score}</li>
                    <li className="player-heart-rate">{`${p1HeartRate} bpm`}</li>
                    <li className="player-serving">{playerOne.serving ? "Serving" : ""}</li>
                </ul>
                <ul className="player-two">
                    <li className="player-name">{playerTwo.name}</li>
                    <li className="player-score">{playerTwo.score}</li>
                    <li className="player-heart-rate">{`${playerTwo.heartRate} bpm`}</li>
                    <li className="player-serving">{playerTwo.serving ? "Serving" : ""}</li>
                </ul>
            </div>
            <div className="match-progress">{`${playerOne.games} - ${playerTwo.games}`}</div>
            <button onClick={() => connect({ onChange: printHeartRate }).catch(console.error)}>Connect HR monitor</button>
            <div className="recent-points">Last 10 points (wip)</div>
        </>
    )
}

export default App