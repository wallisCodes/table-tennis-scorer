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
            points: 12,
        },
        {
            id: uuidv4(),
            name: "Lau",
            age: 56,
            colour: "#000000",
            serving: false,
            points: 12,
        }
    ]);
    const [p1HeartRate, setP1HeartRate] = useState([
        {
            value: 80,
            time: ""
        }
    ]);
    const [p2HeartRate, setP2HeartRate] = useState([
        {
            value: 80,
            time: ""
        }
    ]);
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
    const [mockData, setMockData] = useState(false);

    if (mockData === true){
        useEffect(() => {

            function generateRandomHRValues(max, min) {
                const currentTime = getCurrentTime();
                // console.log(`Current time inside mockData useEffect: ${currentTime}`);
                
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
            generateRandomHRValues(116, 180);
        
            const int = setInterval(() => { //generates HR data between X and Y (excluding X and Y) bpm every Z ms for both players
                generateRandomHRValues(116, 180);
            }, 1000);
    
            return () => clearInterval(int);
        }, []);
    }


    // Bluetooth code
    const [bluetoothOne, setBluetoothOne] = useState(false);
    const [bluetoothTwo, setBluetoothTwo] = useState(false);

    async function connectOne(props) {
        const deviceOne = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['heart_rate'] }]
            // acceptAllDevices: false,
        })

        console.log('Connecting to GATT Server...');
        const server = await deviceOne.gatt?.connect();

        console.log('Getting Heart Rate...');
        const service = await server.getPrimaryService('heart_rate');

        console.log('Getting Heart Rate Measurement Characteristic...');
        const char = await service.getCharacteristic('heart_rate_measurement');

        setBluetoothOne(true);
        char.oncharacteristicvaluechanged = props.onChange;
        char.startNotifications();
        return char;
    }


    // async function connectTwo(props) {
    //     const deviceTwo = await navigator.bluetooth.requestDevice({
    //         filters: [{ services: ['heart_rate'] }]
    //     })

    //     console.log('Connecting to GATT Server...');
    //     const server = await deviceTwo.gatt?.connect();

    //     console.log('Getting Heart Rate...');
    //     const service = await server.getPrimaryService('heart_rate');

    //     console.log('Getting Heart Rate Measurement Characteristic...');
    //     const char = await service.getCharacteristic('heart_rate_measurement');

    //     setBluetoothTwo(true);
    //     char.oncharacteristicvaluechanged = props.onChange;
    //     char.startNotifications();
    //     return char;
    // }




    let deviceTwo;

    async function scanDeviceTwo() {
        deviceTwo = null;
        try {
            console.log('Requesting Bluetooth Device...');
            deviceTwo = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['heart_rate'] }]
            })

            deviceTwo.addEventListener('gattserverdisconnected', onDisconnected);            
            connect();
        } 
        catch(error) {
            console.log('Scan/connection error: ' + error);
        }        

        
        // console.log('Connecting to GATT Server...');
        // const server = await deviceTwo.gatt?.connect();
        // setBluetoothTwo(true); // TODO: think of a better way to track connection

        // console.log('Getting Heart Rate...');
        // const service = await server.getPrimaryService('heart_rate');

        // console.log('Getting Heart Rate Measurement Characteristic...');
        // const char = await service.getCharacteristic('heart_rate_measurement');
    }

    async function connect() {
        console.log(`deviceTwo before: ${JSON.parse(JSON.stringify(deviceTwo))}`);
        console.log('Connecting to Bluetooth Device...');
        const server = await deviceTwo.gatt.connect();
        console.log('> Bluetooth Device connected');
        console.log(`deviceTwo after: ${JSON.parse(JSON.stringify(deviceTwo))}`);   
        
        console.log(`Server: ${server}`);
        // console.log(`Server (JSON): ${JSON.stringify(server)}`);
        
        
        setBluetoothTwo(true); // TODO: think of a better way to track connection

        console.log('Getting Heart Rate...');
        const service = await server.getPrimaryService('heart_rate');
        // console.log(`Service: ${service}`);
        // console.log(`Service (JSON): ${JSON.stringify(service)}`);

        console.log('Getting Heart Rate Measurement Characteristic...');
        const char = await service.getCharacteristic('heart_rate_measurement');
        // console.log(`Char: ${char}`);
        // console.log(`Char (JSON): ${JSON.stringify(char)}`);

        // char.oncharacteristicvaluechanged = props.onChange;
        // char.startNotifications();
        // return char;
    }

    function onDisconnectButtonClick() {
        if (!deviceTwo) {
            console.log("deviceTwo undefined");
            return;
        }

        console.log('Disconnecting from Bluetooth Device...');
        if (deviceTwo.gatt.connected) {
            deviceTwo.gatt.disconnect();
            // setBluetoothTwo(false);
        } else {
            console.log('> Bluetooth Device is already disconnected');
        }
    }

    function onDisconnected(event) {
        // Object event.target is Bluetooth Device getting disconnected
        console.log('> Bluetooth Device disconnected');
    }

    function onReconnectButtonClick() {
        if (!deviceTwo) {
            console.log("deviceTwo undefined");
            return;
        }
        if (deviceTwo.gatt.connected) {
            console.log('> Bluetooth Device is already connected');
            return;
        }
        try {
            connect();
        } catch(error) {
            console.log('Reconnect error: ' + error);
        }
    }



    // BLUETOOTH TESTING
    // async function onScanButtonClick() {
    //     // deleted previous sample code
        
    //     bluetoothDevice = null;
    //     try {
    //         console.log('Requesting Bluetooth Device...');
    //         bluetoothDevice = await navigator.bluetooth.requestDevice(options);
    //         bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
    //         connect();
    //     } catch(error) {
    //         console.log('Argh! ' + error);
    //     }
    
      
    //     async function connect() {
    //         console.log('Connecting to Bluetooth Device...');
    //         await bluetoothDevice.gatt.connect();
    //         console.log('> Bluetooth Device connected');
    //     }
      
    //     function onDisconnectButtonClick() {
    //         if (!bluetoothDevice) {
    //             return;
    //         }

    //         console.log('Disconnecting from Bluetooth Device...');
    //         if (bluetoothDevice.gatt.connected) {
    //             bluetoothDevice.gatt.disconnect();
    //         } else {
    //             console.log('> Bluetooth Device is already disconnected');
    //         }
    //     }
      
    //     function onDisconnected(event) {
    //         // Object event.target is Bluetooth Device getting disconnected.
    //         console.log('> Bluetooth Device disconnected');
    //     }
      
    //     function onReconnectButtonClick() {
    //         if (!bluetoothDevice) {
    //             return;
    //         }
    //         if (bluetoothDevice.gatt.connected) {
    //             console.log('> Bluetooth Device is already connected');
    //             return;
    //         }
    //         try {
    //             connect();
    //         } catch(error) {
    //             console.log('Argh! ' + error);
    //         }
    //     }
    // }





  
    function printHeartRateOne(event) {
        const heartRateOne = event.target.value.getInt8(1);
        const currentTime = getCurrentTime();
        // console.log(`Current time inside print fn 1: ${currentTime}`);
        
        // Ignore spurious HR data
        if (0 <= heartRateOne && heartRateOne < 250){
            setP1HeartRate(prevData => [
                ...prevData, 
                {
                    value: heartRateOne,
                    time: currentTime
                }
            ]);
        }
        
        // Is this code needed? Yes, for debugging in chrome/edge
        const prev = hrDataOne[hrDataOne.length - 1];
        hrDataOne[hrDataOne.length] = heartRateOne;
        hrDataOne = hrDataOne.slice(-200);
        let arrow = '';
        if (heartRateOne !== prev) arrow = heartRateOne > prev ? '⬆' : '⬇';
        // console.clear();
        console.log(`%c\n💚 Player 1: ${heartRateOne} ${arrow}`, 'font-size: 24px;', '\n\n(To disconnect, refresh or close tab)\n\n');
        console.log(`Current time: ${currentTime}`);
    }


    function printHeartRateTwo(event) {
        const heartRateTwo = event.target.value.getInt8(1);
        const currentTime = getCurrentTime();
        console.log(`Current time inside print fn 2: ${currentTime}`);

        // Ignore spurious HR data
        if (0 <= heartRateTwo && heartRateTwo < 250){
            setP2HeartRate(prevData => [
                ...prevData, 
                {
                    value: heartRateTwo,
                    time: currentTime
                }
            ]);
        }

        // Is this code needed? Yes, for debugging in chrome/edge
        const prev = hrDataTwo[hrDataTwo.length - 1];
        hrDataTwo[hrDataTwo.length] = heartRateTwo;
        hrDataTwo = hrDataTwo.slice(-200);
        let arrow = '';
        if (heartRateTwo !== prev) arrow = heartRateTwo > prev ? '⬆' : '⬇';
        // console.clear();
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
                    getCurrentTime={getCurrentTime}
                    toInput={toInput}
                    toScores={toScores}
                    toResults={toResults}
                    bluetoothOne={bluetoothOne}
                    connectOne={connectOne}
                    printHeartRateOne={printHeartRateOne}
                    bluetoothTwo={bluetoothTwo}
                    // connectTwo={connectTwo}
                    printHeartRateTwo={printHeartRateTwo}
                    scanDeviceTwo={scanDeviceTwo}
                    onDisconnectButtonClick={onDisconnectButtonClick}
                    onReconnectButtonClick={onReconnectButtonClick}
                    // connect={connect}
                    // onDisconnected={onDisconnected}
                    deviceTwo={deviceTwo}
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