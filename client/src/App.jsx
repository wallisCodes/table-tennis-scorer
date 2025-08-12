import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AuthForm from './components/AuthForm';
import MatchCreation from './components/MatchCreation';
import Scores from './components/Scores';
import Results from './components/Results';
import Dashboard from './components/Dashboard';
import { verifyToken } from './api';


export default function App(){
    const [user, setUser] = useState(null);
    const [matchDetails, setMatchDetails] = useState(
        {
            sport: "table-tennis", // testing null starting value
            date: null, // Unix timestamp, used for filtering in dashboard
            startTime: null, // hh:mm:ss format
            endTime: null, // hh:mm:ss format
            duration: null, // Unix timestamp, used for filtering in dashboard
            userId: null
        }
    );
    const matchStatus = useRef("pending"); // pending, active or complete
    // const [players, setPlayers] = useState([]);
    const [players, setPlayers] = useState([ // for testing purposes
        {
            name: "Wallis",
            age: 28,
            colour: "#ff00ff",
            points: 10 // testing purposes
        },
        {
            name: "Lau",
            age: 56,
            colour: "#00ff00",
            points: 9 // testing purposes
        }
    ]);
    const [scoreHistory, setScoreHistory] = useState([]);
    // Creating refs to store session ids for user, players, match and match player records
    const userIdRef = useRef(null);
    const playerIdsRef = useRef(null);
    const matchIdRef = useRef(null);
    const matchPlayerIdsRef = useRef(null);


    // Verify user on page refresh
    useEffect(() => {
        const verifyUser = async () => {
            const userData = await verifyToken(); // Checking token on refresh
            if (userData) {
                setUser(userData);
            } else {
                setUser(null); // Ensures userId is reset if no token
            }
        };
        verifyUser();
    }, []);
    

    // Get current time in hh:mm:ss format
    function getCurrentTime(){
        const currentTime = new Date();
        // optionally padding with a 0 is crucial when sorting times inside of CombinedGraph component
        const hours = `${("0" + currentTime.getHours()).slice(-2)}`;
        const minutes = `${("0" + currentTime.getMinutes()).slice(-2)}`;
        const seconds = `${("0" + currentTime.getSeconds()).slice(-2)}`;
        
        const timeFormatted = `${hours}:${minutes}:${seconds}`;
        return timeFormatted;
    }
    

    // Formatting function which ensures there is exactly one HR value every second
    function smoothHeartRateData(rawData, firstTime, finalTime){
        const smoothedData = [];
        let previousValue = null;

        for (let timestamp = firstTime; timestamp <= finalTime; timestamp += 1000) {
            // Get all readings for the current second
            const readings = rawData.filter(
                (entry) => new Date(`1970-01-01T${entry.time}`).getTime() === timestamp
            );

            // Convert timestamp back into date format
            const date = new Date(timestamp);
            const timestampDate = `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;

            if (readings.length > 0) {
                // Average multiple readings for the same second
                const average = Math.ceil(
                    readings.reduce((sum, entry) => sum + entry.value, 0) / readings.length
                );
                smoothedData.push({ time: timestampDate, value: average });
                previousValue = average; // Update previousValue
            } 
            else if (previousValue !== null) {
                // Fill gaps with the previous value
                smoothedData.push({ time: timestampDate, value: previousValue });
            }
        }
        return smoothedData;
    }


    // Used to generate mock HR data for testing purposes
    const [mockData, setMockData] = useState(false);
    // const [mockData, setMockData] = useState(true);

    if (mockData === true){
        useEffect(() => {
            setDeviceStatusOne("mock data");
            setDeviceStatusTwo("mock data");

            function generateRandomHRValues(max, min) {
                const currentTime = getCurrentTime();
                
                setHeartRateOne(prevData => [
                    ...prevData, 
                    {
                        value: Math.floor(Math.random() * (max - min + 1) + min),
                        time: currentTime
                    }
                ]);

                setHeartRateTwo(prevData => [
                    ...prevData, 
                    {
                        value: Math.floor(Math.random() * (max - min + 1) + min),
                        time: currentTime
                    }
                ]);
            }
            generateRandomHRValues(109, 181);

            const int = setInterval(() => { //generates HR data between X and Y (excluding X and Y) bpm every Z ms for both players
                generateRandomHRValues(109, 181);
            }, 1000);
    
            return () => clearInterval(int);
        }, []);
    }


    //////////////////////////////   BLUETOOTH CODE   //////////////////////////////
    const [heartRateOne, setHeartRateOne] = useState([]);
    const heartRateOneOnly = heartRateOne.map(data => data.value);
    const [deviceInitialisedOne, setDeviceInitialisedOne] = useState(false);
    const [deviceStatusOne, setDeviceStatusOne] = useState("disconnected");
    const [pausedOne, setPausedOne] = useState(false);
    const [reconnectOverrideOne, setReconnectOverrideOne] = useState(false);
    const [batteryLevelOne, setBatteryLevelOne] = useState(null);

    const disconnectedManuallyRefOne = useRef(false);
    const deviceRefOne = useRef(null);  // Store Bluetooth device
    const characteristicRefOne = useRef(null); // Store heart rate characteristic to resume later
    const batteryCharacteristicRefOne = useRef(null); // Store battery level characteristic


    // Function to connect to Bluetooth heart rate sensor one
    async function connectToHeartRateSensorOne() {
        if (matchStatus.current === "pending"){
            console.log("Function called: connectToHeartRateSensorOne()");
            try {
                const deviceOne = await navigator.bluetooth.requestDevice({
                    filters: [{ services: ["heart_rate"] }],
                    optionalServices: ["battery_service"],
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
                
                // Listen for heart rate changes by re-adding event listener
                characteristicOne.addEventListener("characteristicvaluechanged", handleHeartRateMeasurementOne);
                characteristicRefOne.current = characteristicOne; // Store heart rate characteristic
                await startHeartRateNotificationsOne(characteristicOne); // Subscribe to heart rate changes
    
                // Access battery service and read battery level
                const batteryServiceOne = await server.getPrimaryService("battery_service");
                const batteryLevelCharacteristicOne = await batteryServiceOne.getCharacteristic("battery_level");
                const batteryLevelValueOne = await batteryLevelCharacteristicOne.readValue();
                setBatteryLevelOne(batteryLevelValueOne.getUint8(0)); // Read and store initial battery level
    
                // Listen for battery level changes by re-adding event listener
                batteryLevelCharacteristicOne.addEventListener("characteristicvaluechanged", handleBatteryLevelOne);
                batteryCharacteristicRefOne.current = batteryLevelCharacteristicOne; // Store battery level characteristic
                await batteryLevelCharacteristicOne.startNotifications(); // Start notifications for battery level changes
            } 
            catch (error) {
                console.error("Failed to connect to heart rate sensor one:", error);
            }
        }
        else if (matchStatus.current === "active" || matchStatus.current === "complete") {
            alert("You cannot connect a device after the game has started. You must restart.");
        }
        else {
            console.log(`Error: matchStatus: ${matchStatus.current}`);
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


    // Function to handle battery level updates
    function handleBatteryLevelOne(event){
        console.log("Battery level one measured.");
        const value = event.target.value;
        const batteryValue = value.getUint8(0);
        setBatteryLevelOne(batteryValue);
    }


    // Stop battery level readings by removing event listener
    async function stopBatteryLevelOne(){
        console.log("Battery level one measurements stopped.");
        // await batteryCharacteristicRefOne.current.stopNotifications();
        batteryCharacteristicRefOne.current.removeEventListener("characteristicvaluechanged", handleBatteryLevelOne);
        batteryCharacteristicRefOne.current = null;
    }


    // Function to handle device disconnection
    function handleDisconnectionOne(){
        console.log("Function called: handleDisconnectionOne()");
        stopBatteryLevelOne();
    
        // Reconnect if connection dropped (automatic disconnect), don't reconnect otherwise (manual disconnect)
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
    
                characteristic.addEventListener("characteristicvaluechanged", handleHeartRateMeasurementOne);
                characteristicRefOne.current = characteristic;
                await startHeartRateNotificationsOne(characteristic);
                disconnectedManuallyRefOne.current = false;

                // Access battery service and read battery level
                const batteryServiceOne = await device.gatt.getPrimaryService("battery_service");
                const batteryLevelCharacteristicOne = await batteryServiceOne.getCharacteristic("battery_level");
                const batteryLevelValueOne = await batteryLevelCharacteristicOne.readValue();
                setBatteryLevelOne(batteryLevelValueOne.getUint8(0)); // Read and store initial battery level

                // Listen for battery level changes
                batteryLevelCharacteristicOne.addEventListener("characteristicvaluechanged", handleBatteryLevelOne);
                batteryCharacteristicRefOne.current = batteryLevelCharacteristicOne; // Store battery level characteristic
                await batteryLevelCharacteristicOne.startNotifications(); // Start notifications for battery level changes

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
        }
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
    const [heartRateTwo, setHeartRateTwo] = useState([]);
    const heartRateTwoOnly = heartRateTwo.map(data => data.value);
    const [deviceInitialisedTwo, setDeviceInitialisedTwo] = useState(false);
    const [deviceStatusTwo, setDeviceStatusTwo] = useState("disconnected");
    const [pausedTwo, setPausedTwo] = useState(false);
    const [reconnectOverrideTwo, setReconnectOverrideTwo] = useState(false);
    const [batteryLevelTwo, setBatteryLevelTwo] = useState(null);

    const disconnectedManuallyRefTwo = useRef(false);
    const deviceRefTwo = useRef(null);  // Store Bluetooth device
    const characteristicRefTwo = useRef(null); // Store heart rate characteristic to resume later
    const batteryCharacteristicRefTwo = useRef(null); // Store battery level characteristic


    // Function to connect to Bluetooth heart rate sensor Two
    async function connectToHeartRateSensorTwo() {
        if (matchStatus.current === "pending"){
            console.log("Function called: connectToHeartRateSensorTwo()");
            try {
                const deviceTwo = await navigator.bluetooth.requestDevice({
                    filters: [{ services: ["heart_rate"] }],
                    optionalServices: ["battery_service"],
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
                
                // Listen for heart rate changes by re-adding event listener
                characteristicTwo.addEventListener("characteristicvaluechanged", handleHeartRateMeasurementTwo);
                characteristicRefTwo.current = characteristicTwo; // Store heart rate characteristic
                await startHeartRateNotificationsTwo(characteristicTwo); // Subscribe to heart rate changes
    
                // Access battery service and read battery level
                const batteryServiceTwo = await server.getPrimaryService("battery_service");
                const batteryLevelCharacteristicTwo = await batteryServiceTwo.getCharacteristic("battery_level");
                const batteryLevelValueTwo = await batteryLevelCharacteristicTwo.readValue();
                setBatteryLevelTwo(batteryLevelValueTwo.getUint8(0)); // Read and store initial battery level
    
                // Listen for battery level changes by re-adding event listener
                batteryLevelCharacteristicTwo.addEventListener("characteristicvaluechanged", handleBatteryLevelTwo);
                batteryCharacteristicRefTwo.current = batteryLevelCharacteristicTwo; // Store battery level characteristic
                await batteryLevelCharacteristicTwo.startNotifications(); // Start notifications for battery level changes
            } 
            catch (error) {
                console.error("Failed to connect to heart rate sensor Two:", error);
            }
        }
        else if (matchStatus.current === "active"){
            alert("You cannot connect a device after the game has started. You must restart.");
        }
        else {
            console.log(`Error: matchStatus: ${matchStatus.current}`);
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


    // Function to handle battery level updates
    function handleBatteryLevelTwo(event){
        console.log("Battery level two measured.");
        const value = event.target.value;
        const batteryValue = value.getUint8(0);
        setBatteryLevelTwo(batteryValue);
    }


    // Stop battery level readings by removing event listener
    async function stopBatteryLevelTwo(){
        console.log("Battery level two measurements stopped.");
        batteryCharacteristicRefTwo.current.removeEventListener("characteristicvaluechanged", handleBatteryLevelTwo);
        batteryCharacteristicRefTwo.current = null;
    }


    // Function to handle device disconnection
    function handleDisconnectionTwo(){
        console.log("Function called: handleDisconnectionTwo()");
        stopBatteryLevelTwo();
    
        // Reconnect if connection dropped (automatic disconnect), don't reconnect otherwise (manual disconnect)        
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
    
                characteristic.addEventListener("characteristicvaluechanged", handleHeartRateMeasurementTwo);
                characteristicRefTwo.current = characteristic;
                await startHeartRateNotificationsTwo(characteristic);
                disconnectedManuallyRefTwo.current = false;

                // Access battery service and read battery level
                const batteryServiceTwo = await device.gatt.getPrimaryService("battery_service");
                const batteryLevelCharacteristicTwo = await batteryServiceTwo.getCharacteristic("battery_level");
                const batteryLevelValueTwo = await batteryLevelCharacteristicTwo.readValue();
                setBatteryLevelTwo(batteryLevelValueTwo.getUint8(0)); // Read and store initial battery level

                // Listen for battery level changes
                batteryLevelCharacteristicTwo.addEventListener("characteristicvaluechanged", handleBatteryLevelTwo);
                batteryCharacteristicRefTwo.current = batteryLevelCharacteristicTwo; // Store battery level characteristic
                await batteryLevelCharacteristicTwo.startNotifications(); // Start notifications for battery level changes

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
            <Navbar 
                user={user}
                setUser={setUser}
                matchStatus={matchStatus}
            />

            <Routes>
                <Route 
                    path="/" 
                    element={
                        <Home />
                    }
                />

                <Route 
                    path="/auth"
                    element={
                        <AuthForm
                            userIdRef={userIdRef}
                            setUser={setUser}
                            matchIdRef={matchIdRef}
                            matchDetails={matchDetails}
                            setMatchDetails={setMatchDetails}
                            matchStatus={matchStatus}
                        />
                    }
                />

                <Route 
                    path="/create"
                    element={
                        <MatchCreation 
                            players={players}
                            setPlayers={setPlayers}
                            playerIdsRef={playerIdsRef}
                            matchDetails={matchDetails}
                            setMatchDetails={setMatchDetails}
                        />
                    }
                />

                <Route 
                    path="/scores"
                    element={
                        <Scores
                            matchDetails={matchDetails}
                            setMatchDetails={setMatchDetails} 
                            matchStatus={matchStatus}
                            players={players}
                            setPlayers={setPlayers}
                            getCurrentTime={getCurrentTime}
                            heartRateOne={heartRateOne}
                            setHeartRateOne={setHeartRateOne}
                            heartRateOneOnly={heartRateOneOnly}
                            scoreHistory={scoreHistory}
                            setScoreHistory={setScoreHistory}
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
                            batteryLevelOne={batteryLevelOne}
                            heartRateTwo={heartRateTwo}
                            setHeartRateTwo={setHeartRateTwo}
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
                            batteryLevelTwo={batteryLevelTwo}
                            mockData={mockData}
                            userIdRef={userIdRef}
                            playerIdsRef={playerIdsRef}
                            matchIdRef={matchIdRef}
                            matchPlayerIdsRef={matchPlayerIdsRef}
                        />
                    }
                />

                <Route 
                    path="/results"
                    element={
                        <Results 
                            players={players}
                            matchDetails={matchDetails}
                            matchStatus={matchStatus}
                            heartRateOne={heartRateOne}
                            heartRateTwo={heartRateTwo}
                            smoothHeartRateData={smoothHeartRateData}
                            scoreHistory={scoreHistory}
                        />
                    }
                />

                <Route 
                    path="/dashboard"
                    element={
                        <Dashboard />
                    }
                />
            </Routes>
        </>
    )
}