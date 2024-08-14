import { useState, useEffect } from 'react'
import GeneralForm from './components/GeneralForm';
import PlayerForm from './components/PlayerForm';
import GameTracking from './components/GameTracking';
import Results from './components/Results';
import { v4 as uuidv4 } from "uuid"

uuidv4();

export default function App(){
    const [matchDetails, setMatchDetails] = useState(
        {
            sport: "squash",
            matchType: "singles",
            bestOf: "1"
        }
    );

    // const [players, setPlayers] = useState([]);
    const [players, setPlayers] = useState([ // for testing purposes
        {
            id: uuidv4(),
            name: "Wallis",
            age: 28,
            colour: "#ffffff",
            serving: false,
            points: 15,
        },
        {
            id: uuidv4(),
            name: "Lau",
            age: 56,
            colour: "#000000",
            serving: false,
            points: 15,
        }
    ]);
    const [p1HeartRate, setP1HeartRate] = useState([]); // 130
    const [p2HeartRate, setP2HeartRate] = useState([]); // 150
    const [display, setDisplay] = useState("input");


    function addPlayer(name, age, colour){
        setPlayers([
            ...players,
            {
                id: uuidv4(),
                name: name,
                age: age,
                colour: colour,
                serving: false,
                points: 0
            }
        ]);
    }


    function getCurrentTime(){
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();
        const milliseconds = currentTime.getMilliseconds();
        
        const timeFormatted = `${hours}:${minutes}:${seconds}:${milliseconds}`;
        return timeFormatted;
    }
    

    // Used to generate mock HR data for testing purposes
    const [mockData, setMockData] = useState(true);

    if (mockData === true){
        useEffect(() => {

            function generateRandomHRValues(max, min) {
                const currentTime = getCurrentTime();
                console.log(`Current time inside mockData useEffect: ${currentTime}`);
                
                setP1HeartRate(prevData => [
                    ...prevData, 
                    {
                        value: Math.floor(Math.random() * (max - min + 1) + min),
                        time: currentTime
                    }
                ]);

                setP2HeartRate(prevData => [
                    ...prevData, 
                    {
                        value: Math.floor(Math.random() * (max - min + 1) + min),
                        time: currentTime
                    }
                ]);
            }
            generateRandomHRValues(116, 160);
        
            const int = setInterval(() => { //generates HR data between X and Y (excluding X and Y) bpm every Z ms for both players
                generateRandomHRValues(116, 160);
            }, 20000);
    
            return () => clearInterval(int);
        }, []);
    }


    

    // Bluetooth code
    const [bluetoothOne, setBluetoothOne] = useState(true);
    const [bluetoothTwo, setBluetoothTwo] = useState(true);

    async function connectOne(props) {
        const deviceOne = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['heart_rate'] }],
            acceptAllDevices: false,
        })

        console.log(`%c\n<3`, 'font-size: 82px;', 'Starting HR 1...\n\n');
        const server = await deviceOne.gatt?.connect();
        const service = await server.getPrimaryService('heart_rate');
        const char = await service.getCharacteristic('heart_rate_measurement');
        setBluetoothOne(true);
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
        setBluetoothTwo(true);
        char.oncharacteristicvaluechanged = props.onChange;
        char.startNotifications();
        return char;
    }

  
    function printHeartRateOne(event) {
        const heartRateOne = event.target.value.getInt8(1);
        const currentTime = getCurrentTime();
        console.log(`Current time inside print fn 1: ${currentTime}`);
        
        // Ignore spurious HR data
        if (20 <= heartRateOne && heartRateOne < 250){
            // setP1HeartRate(prevData => {
            //     return [...prevData, heartRateOne]
            // });

            setP1HeartRate(prevData => [
                ...prevData, 
                {
                    value: heartRateOne,
                    time: currentTime
                }
            ]);
        }
        
        // Is this code needed?
        const prev = hrDataOne[hrDataOne.length - 1];
        hrDataOne[hrDataOne.length] = heartRateOne;
        hrDataOne = hrDataOne.slice(-200);
        let arrow = '';
        if (heartRateOne !== prev) arrow = heartRateOne > prev ? '⬆' : '⬇';
        console.clear();
        console.log(`%c\n💚 Player 1: ${heartRateOne} ${arrow}`, 'font-size: 24px;', '\n\n(To disconnect, refresh or close tab)\n\n');
    }

    function printHeartRateTwo(event) {
        const heartRateTwo = event.target.value.getInt8(1);
        const currentTime = getCurrentTime();
        console.log(`Current time inside print fn 2: ${currentTime}`);

        // Ignore spurious HR data
        if (20 <= heartRateTwo && heartRateTwo < 250){
            // setP2HeartRate(prevData => {
            //     return [...prevData, heartRateTwo]
            // });

            setP2HeartRate(prevData => [
                ...prevData, 
                {
                    value: heartRateTwo,
                    time: currentTime
                }
            ]);
        }

        // Is this code needed?
        const prev = hrDataTwo[hrDataTwo.length - 1];
        hrDataTwo[hrDataTwo.length] = heartRateTwo;
        hrDataTwo = hrDataTwo.slice(-200);
        let arrow = '';
        if (heartRateTwo !== prev) arrow = heartRateTwo > prev ? '⬆' : '⬇';
        console.clear();
        console.log(`%c\n💚 Player 2: ${heartRateTwo} ${arrow}`, 'font-size: 24px;', '\n\n(To disconnect, refresh or close tab)\n\n');
    }

    // Is this code needed?
    let hrDataOne = new Array(200).fill(10);
    let hrDataTwo = new Array(200).fill(10);

    function toInput(){
        setDisplay("input");
    }

    function toScores(){
        setDisplay("scores");
    }

    function toResults(){
        setDisplay("results");
    }


    return (
        <>
            {display === "input" &&
                <>
                    <GeneralForm 
                        matchDetails={matchDetails}
                        setMatchDetails={setMatchDetails}
                        toScores={toScores}
                        players={players}
                    />
                    <PlayerForm
                        players={players}
                        addPlayer={addPlayer}
                        matchDetails={matchDetails}
                    />
                </>
            }
            

            {display === "scores" &&
                <GameTracking 
                    p1HeartRate={p1HeartRate}
                    setP1HeartRate={setP1HeartRate}
                    p2HeartRate={p2HeartRate}
                    setP2HeartRate={setP2HeartRate}
                    players={players}
                    setPlayers={setPlayers}
                    toInput={toInput}
                    toScores={toScores}
                    toResults={toResults}
                    bluetoothOne={bluetoothOne}
                    connectOne={connectOne}
                    printHeartRateOne={printHeartRateOne}
                    bluetoothTwo={bluetoothTwo}
                    connectTwo={connectTwo}
                    printHeartRateTwo={printHeartRateTwo}
                />
            }

            {display === "results" &&
                <Results 
                    toScores={toScores}
                />
            }
        </>
    )
}