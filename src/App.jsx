import { useState, useEffect, useRef } from 'react'
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
        
        const timeFormatted = `${hours}:${minutes}:${seconds}`;
        return timeFormatted;
    }
    

    // Used to generate mock HR data for testing purposes
    const [mockData, setMockData] = useState(false);

    if (mockData === true){
        useEffect(() => {

            function generateRandomHRValues(max, min) {
                const currentTime = getCurrentTime();
                
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

    const p1HeartRateOnly = p1HeartRate.map(data => data.value);
    const p2HeartRateOnly = p2HeartRate.map(data => data.value);
    const p1HRTimeOnly = p1HeartRate.map(data => data.time);
    const p2HRTimeOnly = p2HeartRate.map(data => data.time);

    // Bluetooth code
    const [bluetoothOne, setBluetoothOne] = useState(false);
    // const [bluetoothTwo, setBluetoothTwo] = useState(false);

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




  
    function printHeartRateOne(event) {
        const heartRateOne = event.target.value.getInt8(1);
        const currentTime = getCurrentTime();
        
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
        console.log(`%c\n💚 Player 1: ${heartRateOne} ${arrow}`, 'font-size: 24px;');
        console.log(`Current time: ${currentTime}`);
    }



    // Is this code needed?
    let hrDataOne = new Array(200).fill(10);


    function toInput(){
        setDisplay("input");
    }

    function toScores(){
        setDisplay("scores");
    }

    function toResults(){
        setDisplay("results");
    }


    // -------------------- BLUETOOTH TESTING --------------------
    // const [heartRate, setHeartRate] = useState(null);
    const [heartRate, setHeartRate] = useState([
        {
            value: 80,
            time: ""
        }
    ]);
    const heartRateOnly = heartRate.map(data => data.value);
    const heartRateTimeOnly = heartRate.map(data => data.time);
    const [deviceInitialised, setDeviceInitialised] = useState(false);
    const [deviceConnected, setDeviceConnected] = useState(false);
    const [paused, setPaused] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);

    const disconnectedManuallyRef = useRef(false);
    const deviceRef = useRef(null);  // Store Bluetooth device
    const characteristicRef = useRef(null); // Store characteristic to resume later


    // Function to connect to a Bluetooth heart rate sensor
    async function connectToHeartRateSensor() {
        console.log("Function called: connectToHeartRateSensor()");
        
        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ["heart_rate"] }]
            });

            deviceRef.current = device;
            device.addEventListener('gattserverdisconnected', handleDisconnection);
            setDeviceInitialised(true);
            setDeviceConnected(true);
            disconnectedManuallyRef.current = false;

            console.log('Connecting to GATT Server...');
            const server = await device.gatt.connect();
            console.log('Getting Heart Rate...');
            const service = await server.getPrimaryService("heart_rate");
            console.log('Getting Heart Rate Measurement Characteristic...');
            const characteristic = await service.getCharacteristic("heart_rate_measurement");
                    
            characteristic.addEventListener("characteristicvaluechanged", handleHeartRateMeasurement);
            characteristicRef.current = characteristic; // Store characteristic
            await startHeartRateNotifications(characteristic); // Subscribe to heart rate changes
        } 
        catch (error) {
            console.error("Failed to connect to heart rate sensor:", error);
        }
    };


    // Function to start heart rate notifications
    async function startHeartRateNotifications(characteristic){
        console.log("Function called: startHeartRateNotifications()");
        await characteristic.startNotifications();
        setPaused(false);
    };


    // Function to stop heart rate notifications (pause)
    async function stopHeartRateNotifications(characteristic){
        console.log("Function called: stopHeartRateNotifications()");
        await characteristic.stopNotifications();
        characteristic.removeEventListener("characteristicvaluechanged", handleHeartRateMeasurement);
        setPaused(true);
    };


    // Function to handle heart rate measurement updates
    function handleHeartRateMeasurement(event){
        const value = event.target.value;
        const heartRateValue = value.getUint8(1); // Extract heart rate value
        const currentTime = getCurrentTime();
        
        // Ignore spurious HR data
        if (0 <= heartRateValue && heartRateValue < 220){
            setHeartRate(prevData => [
                ...prevData, 
                {
                    value: heartRateValue,
                    time: currentTime
                }
            ]);
        }
    };


    // Function to handle device disconnection
    function handleDisconnection(){
        console.log("Function called: handleDisconnection()");        
        if (!disconnectedManuallyRef.current) {
            setDeviceConnected(false);
            reconnectToDevice(deviceRef.current);
        } else {
            setDeviceConnected(false);
            console.log("Device was disconnected manually.");
        }
    };


    // Function to reconnect to the device (max 3 times)
    async function reconnectToDevice(device){
        setReconnecting(true);
        console.log("Function called: reconnectToDevice()");

        let reconnectionAttempt = 0;
        const maxAttempts = 3;

        console.log(`START: reconnectionAttempt #${reconnectionAttempt}`);
        console.log(`START: reconnection attempts remaining: ${maxAttempts - reconnectionAttempt}`);
        
        
        // Attempt to reconnect until max attempts has been reached
        do {
            try {
                console.log('Connecting to GATT Server...');
                await device.gatt.connect();
                console.log('Getting Heart Rate...');
                const service = await device.gatt.getPrimaryService("heart_rate");
                console.log('Getting Heart Rate Measurement Characteristic...');
                const characteristic = await service.getCharacteristic("heart_rate_measurement");
    
                //Need to re-add event listener because it gets removed when disconnecting manually
                characteristic.addEventListener("characteristicvaluechanged", handleHeartRateMeasurement);
                characteristicRef.current = characteristic;
                await startHeartRateNotifications(characteristic);
                setDeviceConnected(true);
                setReconnecting(false);
                disconnectedManuallyRef.current = false;

                // break out of do-while loop if reconnected succesfully
                reconnectionAttempt = 5;
                break;
            } 
            catch (error) {
                console.error("Reconnection failed:", error);
                reconnectionAttempt++;
                console.log(`Reconnection attempt #${reconnectionAttempt}`);
                console.log(`Reconnection attempts remaining: ${maxAttempts - reconnectionAttempt}`);
                if (maxAttempts - reconnectionAttempt <= 0){
                    console.log("Maximum reconnection attempts met. Device failed to reconnect automatically.");
                }
            }
        } while (reconnectionAttempt < maxAttempts);  
    };


    // Pause button handler
    function handlePause(){
        console.log("Function called: handlePause()");
        if (characteristicRef.current && !paused) {
            stopHeartRateNotifications(characteristicRef.current);
        }
    };


    // Resume button handler
    function handleResume(){
        console.log("Function called: handleResume()");
        if (characteristicRef.current && paused) {
            startHeartRateNotifications(characteristicRef.current);
        }
    };

    // Function to handle manual disconnection
    async function handleManualDisconnect(){
        if (deviceRef.current && deviceRef.current.gatt.connected) {
            console.log("Function called: handleManualDisconnect()");
            disconnectedManuallyRef.current = true;
            setDeviceConnected(false);
            // console.log(`disconnectedManually STATUS before disconnect: ${disconnectedManuallyRef.current}`);
            await deviceRef.current.gatt.disconnect();
        }
    };


    // Function to handle manual reconnection
    async function handleManualReconnect(){
        if (deviceRef.current) {
            reconnectToDevice(deviceRef.current);
        }
    };


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
                    p1HeartRateOnly={p1HeartRateOnly}
                    p1HRTimeOnly={p1HRTimeOnly}
                    p2HeartRate={p2HeartRate}
                    setP2HeartRate={setP2HeartRate}
                    p2HeartRateOnly={p2HeartRateOnly}
                    p2HRTimeOnly={p2HRTimeOnly}
                    players={players}
                    setPlayers={setPlayers}
                    getCurrentTime={getCurrentTime}
                    toInput={toInput}
                    toScores={toScores}
                    toResults={toResults}
                    bluetoothOne={bluetoothOne}
                    connectOne={connectOne}
                    printHeartRateOne={printHeartRateOne}
                    heartRate={heartRate}
                    heartRateOnly={heartRateOnly}
                    deviceInitialised={deviceInitialised}
                    deviceConnected={deviceConnected}
                    paused={paused}
                    disconnectedManuallyRef={disconnectedManuallyRef}
                    handleManualDisconnect={handleManualDisconnect}
                    reconnecting={reconnecting}
                    handleManualReconnect={handleManualReconnect}
                    connectToHeartRateSensor={connectToHeartRateSensor}
                    handlePause={handlePause}
                    handleResume={handleResume}
                />
            }

            {display === "results" &&
                <Results 
                    toScores={toScores}
                    p1HeartRate={p1HeartRate}
                    p1HeartRateOnly={p1HeartRateOnly}
                    p1HRTimeOnly={p1HRTimeOnly}
                    heartRate={heartRate}
                    heartRateOnly={heartRateOnly}
                    heartRateTimeOnly={heartRateTimeOnly}
                    players={players}
                />
            }
        </>
    )
}