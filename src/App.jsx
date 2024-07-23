import { useState } from 'react'
import GeneralForm from './components/GeneralForm';
import PlayerForm from './components/PlayerForm';
import GameTracking from './components/GameTracking';
import { v4 as uuidv4 } from "uuid"

uuidv4();

export default function App(){
    const [matchDetails, setMatchDetails] = useState(
        {
            sport: "table-tennis",
            matchType: "singles",
            bestOf: "3"
        }
    );

    // const [players, setPlayers] = useState([]);
    const [players, setPlayers] = useState([ // for testing purposes
        {
            id: uuidv4(),
            name: "Josh",
            age: 28,
            colour: "#00ff00",
            serving: false,
            points: 0,
            games: 0
        },
        {
            id: uuidv4(),
            name: "Simon",
            age: 56,
            colour: "#ffff00",
            serving: false,
            points: 0,
            games: 0
        }
    ]);
    // const [scoreHistory, setScoreHistory] = useState([]);
    const [p1HeartRate, setP1HeartRate] = useState(130);
    const [p2HeartRate, setP2HeartRate] = useState(150);
    const [showScores, setShowScores] = useState(false);


    function addPlayer(name, age, colour){
        setPlayers([
            ...players,
            {
                id: uuidv4(),
                name: name,
                age: age,
                colour: colour,
                serving: false,
                points: 0,
                games: 0
                // heartRate: [85]
            }
        ]);
        // console.log(`players.length: ${players.length}`);
    }
    


    // Bluetooth code
    async function connectOne(props) {
        const deviceOne = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['heart_rate'] }],
            acceptAllDevices: false,
        })

        console.log(`%c\n<3`, 'font-size: 82px;', 'Starting HR 1...\n\n');
        const server = await deviceOne.gatt?.connect();
        const service = await server.getPrimaryService('heart_rate');
        const char = await service.getCharacteristic('heart_rate_measurement');
        char.oncharacteristicvaluechanged = props.onChange;
        char.startNotifications();
        return char;
    }


    async function connectTwo(props) {
        const deviceTwo = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['heart_rate'] }],
            acceptAllDevices: false,
        })

        console.log(`%c\n<3`, 'font-size: 82px;', 'Starting HR 2...\n\n');
        const server = await deviceTwo.gatt?.connect();
        const service = await server.getPrimaryService('heart_rate');
        const char = await service.getCharacteristic('heart_rate_measurement');
        char.oncharacteristicvaluechanged = props.onChange;
        char.startNotifications();
        return char;
    }

  
    function printHeartRateOne(event) {
        // setP1HeartRate(event.target.value.getInt8(1));
        const heartRateOne = event.target.value.getInt8(1);
        setP1HeartRate(heartRateOne);
        // setPlayers(prev => {                                   TO CONTINUE...
        //     return {
        //         ...prev,
        //         heartRate: heartRateOne
        //     }
        // })
        const prev = hrDataOne[hrDataOne.length - 1];
        hrDataOne[hrDataOne.length] = heartRateOne;
        hrDataOne = hrDataOne.slice(-200);
        let arrow = '';
        if (heartRateOne !== prev) arrow = heartRateOne > prev ? '⬆' : '⬇';
        console.clear();
        // console.graph(hrData);
        console.log(`%c\n💚 Player 1: ${heartRateOne} ${arrow}`, 'font-size: 24px;', '\n\n(To disconnect, refresh or close tab)\n\n');
    }

    function printHeartRateTwo(event) {
        const heartRateTwo = event.target.value.getInt8(1);
        setP2HeartRate(heartRateTwo);
        const prev = hrDataTwo[hrDataTwo.length - 1];
        hrDataTwo[hrDataTwo.length] = heartRateTwo;
        hrDataTwo = hrDataTwo.slice(-200);
        let arrow = '';
        if (heartRateTwo !== prev) arrow = heartRateTwo > prev ? '⬆' : '⬇';
        console.clear();
        // console.graph(hrData);
        console.log(`%c\n💚 Player 2: ${heartRateTwo} ${arrow}`, 'font-size: 24px;', '\n\n(To disconnect, refresh or close tab)\n\n');
    }

    let hrDataOne = new Array(200).fill(10);
    let hrDataTwo = new Array(200).fill(10);

    function backToInput(){
        setShowScores(false);
    }


    return (
        <>
            {!showScores &&
                <div>
                    <GeneralForm 
                        matchDetails={matchDetails}
                        setMatchDetails={setMatchDetails}
                        setShowScores={setShowScores}
                    />
                    <PlayerForm
                        players={players}
                        addPlayer={addPlayer}
                        matchDetails={matchDetails}
                    />
                </div>
            }
            

            {showScores &&
            <div>
                <GameTracking 
                    // incrementP1Score={incrementP1Score}
                    p1HeartRate={p1HeartRate}
                    p2HeartRate={p2HeartRate}
                    players={players}
                    backToInput={backToInput}
                />
                <button onClick={() => connectOne({ onChange: printHeartRateOne }).catch(console.error)}>Connect 1</button>
                <button onClick={() => connectTwo({ onChange: printHeartRateTwo }).catch(console.error)}>Connect 2</button>
            </div>
            }
        </>
    )
}