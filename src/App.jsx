import { useState, useEffect } from 'react'
import GeneralForm from './components/GeneralForm';
import PlayerForm from './components/PlayerForm';
import GameTracking from './components/GameTracking';
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

    const [players, setPlayers] = useState([]);
    // const [players, setPlayers] = useState([ // for testing purposes
    //     {
    //         id: uuidv4(),
    //         name: "Cunningham",
    //         age: 28,
    //         colour: "#ffffff",
    //         serving: false,
    //         points: 0,
    //     },
    //     {
    //         id: uuidv4(),
    //         name: "Griffiths",
    //         age: 56,
    //         colour: "#000000",
    //         serving: false,
    //         points: 0,
    //     }
    // ]);
    const [p1HeartRate, setP1HeartRate] = useState([70]); // 130
    const [p2HeartRate, setP2HeartRate] = useState([70]); // 150
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
                points: 0
            }
        ]);
    }
    

    // Used to generate mock HR data for testing purposes
    // const [mockData, setMockData] = useState(false);

    // if (mockData === true){
    //     useEffect(() => {
    //         function generateRandomHRValues(max, min){
    //             //TODO: add timestamp to data
    //             setP1HeartRate(prevData => {
    //                 return [...prevData, Math.floor(Math.random() * (max - min + 1) + min)]
    //             });

    //             setP2HeartRate(prevData => {
    //                 return [...prevData, Math.floor(Math.random() * (max - min + 1) + min)]
    //             });
    //         }
    //         generateRandomHRValues(116, 160);
        
    //         const int = setInterval(() => { //generates HR data between X and Y (excluding X and Y) bpm every Z ms for both players
    //             generateRandomHRValues(116, 160);
    //         }, 5000);
    
    //         return () => clearInterval(int);
    //     }, []);
    // }


    

    // Bluetooth code
    const [bluetoothOne, setBluetoothOne] = useState(false);
    const [bluetoothTwo, setBluetoothTwo] = useState(false);

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
        // setP1HeartRate(heartRateOne);
        
        // Ignore spurious HR data
        if (20 <= heartRateOne && heartRateOne < 250){
            setP1HeartRate(prevData => {
                return [...prevData, heartRateOne]
            });
        }
        
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
        console.log(`%c\n💚 Player 1: ${heartRateOne} ${arrow}`, 'font-size: 24px;', '\n\n(To disconnect, refresh or close tab)\n\n');
    }

    function printHeartRateTwo(event) {
        const heartRateTwo = event.target.value.getInt8(1);
        // setP2HeartRate(heartRateTwo);

        // Ignore spurious HR data
        if (20 <= heartRateTwo && heartRateTwo < 250){
            setP2HeartRate(prevData => {
                return [...prevData, heartRateTwo]
            });
        }

        const prev = hrDataTwo[hrDataTwo.length - 1];
        hrDataTwo[hrDataTwo.length] = heartRateTwo;
        hrDataTwo = hrDataTwo.slice(-200);
        let arrow = '';
        if (heartRateTwo !== prev) arrow = heartRateTwo > prev ? '⬆' : '⬇';
        console.clear();
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
                        players={players}
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
                    setP1HeartRate={setP1HeartRate}
                    p2HeartRate={p2HeartRate}
                    setP2HeartRate={setP2HeartRate}
                    players={players}
                    setPlayers={setPlayers}
                    backToInput={backToInput}
                    bluetoothOne={bluetoothOne}
                    connectOne={connectOne}
                    printHeartRateOne={printHeartRateOne}
                    bluetoothTwo={bluetoothTwo}
                    connectTwo={connectTwo}
                    printHeartRateTwo={printHeartRateTwo}
                />
            </div>
            }
        </>
    )
}