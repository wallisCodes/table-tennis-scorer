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
            sport: "table-tennis",
            matchType: "singles",
            bestOf: "1"
        }
    );

    const [players, setPlayers] = useState([]);
    // const [players, setPlayers] = useState([ // for testing purposes
    //     {
    //         id: uuidv4(),
    //         name: "Wallis",
    //         age: 28,
    //         colour: "#ffffff",
    //         serving: false,
    //         points: 12,
    //     },
    //     {
    //         id: uuidv4(),
    //         name: "Lau",
    //         age: 56,
    //         colour: "#000000",
    //         serving: false,
    //         points: 12,
    //     }
    // ]);
    // const [p1HeartRate, setP1HeartRate] = useState([
    //     {
    //         value: 80,
    //         time: ""
    //     }
    // ]);
    // const [p2HeartRate, setP2HeartRate] = useState([
    //     {
    //         value: 80,
    //         time: ""
    //     }
    // ]);
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
    

    // // Used to generate mock HR data for testing purposes
    // const [mockData, setMockData] = useState(false);

    // if (mockData === true){
    //     useEffect(() => {

    //         function generateRandomHRValues(max, min) {
    //             const currentTime = getCurrentTime();
                
    //             setP1HeartRate(prevData => [
    //                 ...prevData, 
    //                 {
    //                     value: Math.floor(Math.random() * (max - min + 1) + min),
    //                     time: currentTime
    //                 }
    //             ]);

    //             setP2HeartRate(prevData => [
    //                 ...prevData, 
    //                 {
    //                     value: Math.floor(Math.random() * (max - min + 1) + min),
    //                     time: currentTime
    //                 }
    //             ]);
    //         }
    //         generateRandomHRValues(116, 180);
        
    //         const int = setInterval(() => { //generates HR data between X and Y (excluding X and Y) bpm every Z ms for both players
    //             generateRandomHRValues(116, 180);
    //         }, 1000);
    
    //         return () => clearInterval(int);
    //     }, []);
    // }

    function toInput(){
        setDisplay("input");
    }

    function toScores(){
        setDisplay("scores");
    }

    function toResults(){
        setDisplay("results");
    }


    // -------------------- BLUETOOTH CODE --------------------
    // const [heartRate, setHeartRate] = useState(null);
    const [heartRateOne, setHeartRateOne] = useState([
        {
            value: 80,
            time: ""
        }
    ]);
    const heartRateOneOnly = heartRateOne.map(data => data.value);
    const heartRateOneTimeOnly = heartRateOne.map(data => data.time);
    const [deviceInitialisedOne, setDeviceInitialisedOne] = useState(false);
    const [deviceStatusOne, setDeviceStatusOne] = useState("disconnected");
    const [pausedOne, setPausedOne] = useState(false);
    const [reconnectOverrideOne, setReconnectOverrideOne] = useState(false);

    const disconnectedManuallyRefOne = useRef(false);
    const deviceRefOne = useRef(null);  // Store Bluetooth device
    const characteristicRefOne = useRef(null); // Store characteristic to resume later

    //////////////////////////////////////////////////////////////////////////////////

    const [heartRateTwo, setHeartRateTwo] = useState([
        {
            value: 80,
            time: ""
        }
    ]);
    const heartRateTwoOnly = heartRateTwo.map(data => data.value);
    const heartRateTwoTimeOnly = heartRateTwo.map(data => data.time);
    const [deviceInitialisedTwo, setDeviceInitialisedTwo] = useState(false);
    const [deviceStatusTwo, setDeviceStatusTwo] = useState("disconnected");
    const [pausedTwo, setPausedTwo] = useState(false);
    const [reconnectOverrideTwo, setReconnectOverrideTwo] = useState(false);

    const disconnectedManuallyRefTwo = useRef(false);
    const deviceRefTwo = useRef(null);  // Store Bluetooth device
    const characteristicRefTwo = useRef(null); // Store characteristic to resume later


    // Function to connect to Bluetooth heart rate sensor one
    async function connectToHeartRateSensorOne() {
        console.log("Function called: connectToHeartRateSensorOne()");
        try {
            const deviceOne = await navigator.bluetooth.requestDevice({
                filters: [{ services: ["heart_rate"] }]
            });
            setDeviceStatusOne("connecting");
            deviceRefOne.current = deviceOne;
            deviceOne.addEventListener('gattserverdisconnected', handleDisconnectionOne);
            setDeviceInitialisedOne(true);
            disconnectedManuallyRefOne.current = false;

            console.log('Connecting to GATT Server...');
            const server = await deviceOne.gatt.connect();
            setDeviceStatusOne("connected");
            console.log('Getting Heart Rate...');
            const service = await server.getPrimaryService("heart_rate");
            console.log('Getting Heart Rate Measurement Characteristic...');
            const characteristicOne = await service.getCharacteristic("heart_rate_measurement");
                    
            characteristicOne.addEventListener("characteristicvaluechanged", handleHeartRateMeasurementOne);
            characteristicRefOne.current = characteristicOne; // Store characteristic
            await startHeartRateNotificationsOne(characteristicOne); // Subscribe to heart rate changes
        } 
        catch (error) {
            console.error("Failed to connect to heart rate sensor one:", error);
        }
    };


    // Function to start heart rate notifications
    async function startHeartRateNotificationsOne(characteristic){
        console.log("Function called: startHeartRateNotificationsOne()");
        await characteristic.startNotifications();
        setPausedOne(false);
        setDeviceStatusOne("connected");
    };


    // Function to stop heart rate notifications (pause)
    async function stopHeartRateNotificationsOne(characteristic){
        console.log("Function called: stopHeartRateNotificationsOne()");
        await characteristic.stopNotifications();
        characteristic.removeEventListener("characteristicvaluechanged", handleHeartRateMeasurementOne);
        setPausedOne(true);
        setDeviceStatusOne("paused");
    };


    // Function to handle heart rate measurement updates
    function handleHeartRateMeasurementOne(event){
        const value = event.target.value;
        const heartRateValue = value.getUint8(1); // Extract heart rate value
        const currentTime = getCurrentTime();
        
        // Ignore spurious HR data
        if (0 <= heartRateValue && heartRateValue < 220){
            setHeartRateOne(prevData => [
                ...prevData, 
                {
                    value: heartRateValue,
                    time: currentTime
                }
            ]);
        }
    };


    // Function to handle device disconnection
    function handleDisconnectionOne(){
        console.log("Function called: handleDisconnectionOne()");        
        if (!disconnectedManuallyRefOne.current) {
            setDeviceStatusOne("disconnected");
            reconnectToDeviceOne(deviceRefOne.current);
        } else {
            setDeviceStatusOne("disconnected");
            console.log("Device was disconnected manually.");
        }
    };


    // Function to reconnect to the device (max 3 times)
    async function reconnectToDeviceOne(device){
        console.log("Function called: reconnectToDeviceOne()");

        let reconnectionAttempt = 0;
        const maxAttempts = 3;

        console.log(`ReconnectionAttempt #${reconnectionAttempt}`);
        console.log(`Reconnection attempts remaining: ${maxAttempts - reconnectionAttempt}`);
        
        
        // Attempt to reconnect until max attempts has been reached
        do {
            try {
                setDeviceStatusOne("reconnecting");
                console.log('Connecting to GATT Server...');
                await device.gatt.connect();
                console.log('Getting Heart Rate...');
                const service = await device.gatt.getPrimaryService("heart_rate");
                console.log('Getting Heart Rate Measurement Characteristic...');
                const characteristic = await service.getCharacteristic("heart_rate_measurement");
    
                //Need to re-add event listener because it gets removed when disconnecting manually
                characteristic.addEventListener("characteristicvaluechanged", handleHeartRateMeasurementOne);
                characteristicRefOne.current = characteristic;
                await startHeartRateNotificationsOne(characteristic);
                disconnectedManuallyRefOne.current = false;

                // break out of do-while loop if reconnected succesfully
                reconnectionAttempt = 5;
                setDeviceStatusOne("connected");
                break;
            } 
            catch (error) {
                console.error("Reconnection failed:", error);
                reconnectionAttempt++;
                console.log(`Reconnection attempt #${reconnectionAttempt}`);
                console.log(`Reconnection attempts remaining: ${maxAttempts - reconnectionAttempt}`);
                if (maxAttempts - reconnectionAttempt <= 0){
                    setDeviceStatusOne("disconnected");
                    setReconnectOverrideOne(true);
                    console.log("Maximum reconnection attempts met. Device failed to reconnect automatically.");
                }
            }
        } while (reconnectionAttempt < maxAttempts);  
    };


    // Pause button handler
    function handlePauseOne(){
        console.log("Function called: handlePauseOne()");
        if (characteristicRefOne.current && !pausedOne) {
            stopHeartRateNotificationsOne(characteristicRefOne.current);
        }
    };


    // Resume button handler
    function handleResumeOne(){
        console.log("Function called: handleResumeOne()");
        if (characteristicRefOne.current && pausedOne) {
            startHeartRateNotificationsOne(characteristicRefOne.current);
        }One
    };


    // Function to handle manual disconnection
    async function handleManualDisconnectOne(){
        if (deviceRefOne.current && deviceRefOne.current.gatt.connected) {
            console.log("Function called: handleManualDisconnectOne()");
            disconnectedManuallyRefOne.current = true;
            setDeviceStatusOne("disconnected");
            await deviceRefOne.current.gatt.disconnect();
        }
    };


    // Function to handle manual reconnection
    async function handleManualReconnectOne(){
        if (deviceRefOne.current) {
            reconnectToDeviceOne(deviceRefOne.current);
        }
    };



    /////////////////////////////////////////////////////////////////////////////////

    // Function to connect to Bluetooth heart rate sensor Two
    async function connectToHeartRateSensorTwo() {
        console.log("Function called: connectToHeartRateSensorTwo()");
        try {
            const deviceTwo = await navigator.bluetooth.requestDevice({
                filters: [{ services: ["heart_rate"] }]
            });
            setDeviceStatusTwo("connecting");
            deviceRefTwo.current = deviceTwo;
            deviceTwo.addEventListener('gattserverdisconnected', handleDisconnectionTwo);
            setDeviceInitialisedTwo(true);
            disconnectedManuallyRefTwo.current = false;

            console.log('Connecting to GATT Server...');
            const server = await deviceTwo.gatt.connect();
            setDeviceStatusTwo("connected");
            console.log('Getting Heart Rate...');
            const service = await server.getPrimaryService("heart_rate");
            console.log('Getting Heart Rate Measurement Characteristic...');
            const characteristicTwo = await service.getCharacteristic("heart_rate_measurement");
                    
            characteristicTwo.addEventListener("characteristicvaluechanged", handleHeartRateMeasurementTwo);
            characteristicRefTwo.current = characteristicTwo; // Store characteristic
            await startHeartRateNotificationsTwo(characteristicTwo); // Subscribe to heart rate changes
        } 
        catch (error) {
            console.error("Failed to connect to heart rate sensor Two:", error);
        }
    };


    // Function to start heart rate notifications
    async function startHeartRateNotificationsTwo(characteristic){
        console.log("Function called: startHeartRateNotificationsTwo()");
        await characteristic.startNotifications();
        setPausedTwo(false);
        setDeviceStatusTwo("connected");
    };


    // Function to stop heart rate notifications (pause)
    async function stopHeartRateNotificationsTwo(characteristic){
        console.log("Function called: stopHeartRateNotificationsTwo()");
        await characteristic.stopNotifications();
        characteristic.removeEventListener("characteristicvaluechanged", handleHeartRateMeasurementTwo);
        setPausedTwo(true);
        setDeviceStatusTwo("paused");
    };


    // Function to handle heart rate measurement updates
    function handleHeartRateMeasurementTwo(event){
        const value = event.target.value;
        const heartRateValue = value.getUint8(1); // Extract heart rate value
        const currentTime = getCurrentTime();
        
        // Ignore spurious HR data
        if (0 <= heartRateValue && heartRateValue < 220){
            setHeartRateTwo(prevData => [
                ...prevData, 
                {
                    value: heartRateValue,
                    time: currentTime
                }
            ]);
        }
    };


    // Function to handle device disconnection
    function handleDisconnectionTwo(){
        console.log("Function called: handleDisconnectionTwo()");        
        if (!disconnectedManuallyRefTwo.current) {
            setDeviceStatusTwo("disconnected");
            reconnectToDeviceTwo(deviceRefTwo.current);
        } else {
            setDeviceStatusTwo("disconnected");
            console.log("Device was disconnected manually.");
        }
    };


    // Function to reconnect to the device (max 3 times)
    async function reconnectToDeviceTwo(device){
        console.log("Function called: reconnectToDeviceTwo()");

        let reconnectionAttempt = 0;
        const maxAttempts = 3;

        console.log(`ReconnectionAttempt #${reconnectionAttempt}`);
        console.log(`Reconnection attempts remaining: ${maxAttempts - reconnectionAttempt}`);
        
        
        // Attempt to reconnect until max attempts has been reached
        do {
            try {
                setDeviceStatusTwo("reconnecting");
                console.log('Connecting to GATT Server...');
                await device.gatt.connect();
                console.log('Getting Heart Rate...');
                const service = await device.gatt.getPrimaryService("heart_rate");
                console.log('Getting Heart Rate Measurement Characteristic...');
                const characteristic = await service.getCharacteristic("heart_rate_measurement");
    
                //Need to re-add event listener because it gets removed when disconnecting manually
                characteristic.addEventListener("characteristicvaluechanged", handleHeartRateMeasurementTwo);
                characteristicRefTwo.current = characteristic;
                await startHeartRateNotificationsTwo(characteristic);
                disconnectedManuallyRefTwo.current = false;

                // break out of do-while loop if reconnected succesfully
                reconnectionAttempt = 5;
                setDeviceStatusTwo("connected");
                break;
            } 
            catch (error) {
                console.error("Reconnection failed:", error);
                reconnectionAttempt++;
                console.log(`Reconnection attempt #${reconnectionAttempt}`);
                console.log(`Reconnection attempts remaining: ${maxAttempts - reconnectionAttempt}`);
                if (maxAttempts - reconnectionAttempt <= 0){
                    setDeviceStatusTwo("disconnected");
                    setReconnectOverrideTwo(true);
                    console.log("Maximum reconnection attempts met. Device failed to reconnect automatically.");
                }
            }
        } while (reconnectionAttempt < maxAttempts);  
    };


    // Pause button handler
    function handlePauseTwo(){
        console.log("Function called: handlePauseTwo()");
        if (characteristicRefTwo.current && !pausedTwo) {
            stopHeartRateNotificationsTwo(characteristicRefTwo.current);
        }
    };


    // Resume button handler
    function handleResumeTwo(){
        console.log("Function called: handleResumeTwo()");
        if (characteristicRefTwo.current && pausedTwo) {
            startHeartRateNotificationsTwo(characteristicRefTwo.current);
        }
    };


    // Function to handle manual disconnection
    async function handleManualDisconnectTwo(){
        if (deviceRefTwo.current && deviceRefTwo.current.gatt.connected) {
            console.log("Function called: handleManualDisconnectTwo()");
            disconnectedManuallyRefTwo.current = true;
            setDeviceStatusTwo("disconnected");
            await deviceRefTwo.current.gatt.disconnect();
        }
    };


    // Function to handle manual reconnection
    async function handleManualReconnectTwo(){
        if (deviceRefTwo.current) {
            reconnectToDeviceTwo(deviceRefTwo.current);
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
                    players={players}
                    setPlayers={setPlayers}
                    getCurrentTime={getCurrentTime}
                    toInput={toInput}
                    toResults={toResults}
                    heartRateOne={heartRateOne}
                    heartRateOneOnly={heartRateOneOnly}
                    deviceInitialisedOne={deviceInitialisedOne}
                    deviceStatusOne={deviceStatusOne}
                    pausedOne={pausedOne}
                    reconnectOverrideOne={reconnectOverrideOne}
                    disconnectedManuallyRefOne={disconnectedManuallyRefOne}
                    handleManualDisconnectOne={handleManualDisconnectOne}
                    handleManualReconnectOne={handleManualReconnectOne}
                    connectToHeartRateSensorOne={connectToHeartRateSensorOne}
                    handlePauseOne={handlePauseOne}
                    handleResumeOne={handleResumeOne}
                    heartRateTwo={heartRateTwo}
                    heartRateTwoOnly={heartRateTwoOnly}
                    deviceInitialisedTwo={deviceInitialisedTwo}
                    deviceStatusTwo={deviceStatusTwo}
                    pausedTwo={pausedTwo}
                    reconnectOverrideTwo={reconnectOverrideTwo}
                    disconnectedManuallyRefTwo={disconnectedManuallyRefTwo}
                    handleManualDisconnectTwo={handleManualDisconnectTwo}
                    handleManualReconnectTwo={handleManualReconnectTwo}
                    connectToHeartRateSensorTwo={connectToHeartRateSensorTwo}
                    handlePauseTwo={handlePauseTwo}
                    handleResumeTwo={handleResumeTwo}
                    matchDetails={matchDetails}
                />
            }

            {display === "results" &&
                <Results 
                    toScores={toScores}
                    players={players}
                    heartRateOneOnly={heartRateOneOnly}
                    heartRateOneTimeOnly={heartRateOneTimeOnly}
                    heartRateTwoOnly={heartRateTwoOnly}
                    heartRateTwoTimeOnly={heartRateTwoTimeOnly}
                />
            }
        </>
    )
}