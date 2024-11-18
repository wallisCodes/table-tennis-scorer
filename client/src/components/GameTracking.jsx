import { useState, useEffect } from "react";
import Modal from "./Modal";

export default function GameTracking({players, setPlayers, getCurrentTime, toInput, toResults, heartRateOne, heartRateOneOnly,
    deviceInitialisedOne, deviceStatusOne, pausedOne, reconnectOverrideOne, disconnectedManuallyRefOne, handleManualDisconnectOne,
    handleManualReconnectOne, connectToHeartRateSensorOne, handlePauseOne, handleResumeOne, batteryLevelOne, heartRateTwo, heartRateTwoOnly,
    deviceInitialisedTwo, deviceStatusTwo, pausedTwo, reconnectOverrideTwo, disconnectedManuallyRefTwo, handleManualDisconnectTwo,
    handleManualReconnectTwo, connectToHeartRateSensorTwo, handlePauseTwo, handleResumeTwo, batteryLevelTwo, matchDetails, mockData
}){
    function maxHeartRate(age){
        return 220 - age;
    }

    // Dynamically assign player colours to tracking screen based on previous user input
    const p1TeamStyles = {
        backgroundColor: players[0].colour,
        borderRight: "2px solid white"
    }

    const p2TeamStyles = {
        backgroundColor: players[1].colour,
        borderLeft: "2px solid white"
    }


    function calcHRPercent(heartRate, age){
        return Math.round(heartRate * 100 / maxHeartRate(age));
    }

    function chooseBackgroundColor(heartRatePercent){
        var bgColor = "";
        switch (true){
            case (0 <= heartRatePercent && heartRatePercent < 60):
                bgColor = "#c2cbca"; //grey
                break
            case (60 <= heartRatePercent && heartRatePercent < 70):
                bgColor = "#46c7ee"; //blue
                break
            case (70 <= heartRatePercent && heartRatePercent < 80):
                bgColor = "#9dbe4b"; //green
                break
            case (80 <= heartRatePercent && heartRatePercent < 90):
                bgColor = "#ffcb2d"; //yellow
                break
            case (90 <= heartRatePercent && heartRatePercent < 100):
                bgColor = "#de105b"; //red
                break
            case (100 <= heartRatePercent && heartRatePercent <= 150):
                bgColor = "#b100cd"; //purple
                break
            default: bgColor = "#c2cbca"; //grey
        }
        return {backgroundColor: bgColor};
    }

    function chooseStatusColor(deviceStatus){
        var bgColor = "";
        switch (true){
            case (deviceStatus === "connected"):
                bgColor = "green";
                break
            case (deviceStatus === "disconnected"):
                bgColor = "red";
                break
            case (deviceStatus === "paused"):
                bgColor = "blue";
                break
            case (deviceStatus === "reconnecting" || deviceStatus === "connecting"):
                bgColor = "orange";
                break
            case (deviceStatus === "mock data"):
                bgColor = "lightseagreen";
                break
            default: bgColor = "red";
        }
        return {backgroundColor: bgColor};
    }


    // SCORING STATE & LOGIC
    const [winner, setWinner] = useState(null);
    const [showWinner, setShowWinner] = useState(false);
    const [scoreHistory, setScoreHistory] = useState([]);
    const [modal, setModal] = useState(false); // Modal for receiver to choose extra points played if tied 14-14
    const [receiversChoice, setReceiversChoice] = useState(0); 


    function updatePlayerPoints(playerIndex, increment = true){
        setPlayers(prevPlayers => {
            const updatedPlayers = [...prevPlayers]; // Creating shallow copy of players array

            if (playerIndex >= 0 && playerIndex < updatedPlayers.length) {
                const currentPoints = updatedPlayers[playerIndex].points;

                // Only update points if no one has won yet or if decrementing
                if ((!winner) || !increment) {
                    const newPoints = increment
                        ? currentPoints + 1
                        : Math.max(0, currentPoints - 1);

                    updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], points: newPoints };
                }
            }
            return updatedPlayers;
        });

        if (increment) {
            const currentTime = getCurrentTime();
            setScoreHistory(prevScoreHistory => [
                ...prevScoreHistory,
                {
                    player: `P${playerIndex + 1}`,
                    time: currentTime
                }
            ]);

        } else if (!increment && players[playerIndex].points > 0) {
            setScoreHistory(prevScoreHistory => prevScoreHistory.slice(0, -1));
        }
    };


    function promptReceiver(){
        setTimeout(() => {
            setModal(true);
          }, "200");       
    }


    // Decide which scoring algorithm to execute depending on user sport choice
    useEffect(() => {
        if (matchDetails.sport === "table-tennis" || matchDetails.sport === "badminton"){
            // Table tennis & badminton scoring: first to 21 points wins, must be by two clear points (e.g. 22-20, 25-23)
            if (players.length === 2) {
                const [player1, player2] = players;
    
                if (player1.points >= 21 && player1.points - player2.points >= 2) {
                    setWinner(player1.name);
                    setShowWinner(true);
                } else if (player2.points >= 21 && player2.points - player1.points >= 2) {
                    setWinner(player2.name);
                    setShowWinner(true);
                }
            } 
        }
        else if (matchDetails.sport === "squash"){
            // Squash scoring: first to 15, except if it's 14-14 a modal pops up asking the receiver if they want to play 1 or 3 more points
            if (players.length === 2) {
                const [player1, player2] = players;
    
                if (player1.points === 14 && player2.points === 14) {
                    promptReceiver();
                }
                else if (player1.points === 15 + receiversChoice) {
                    setWinner(player1.name);
                    setShowWinner(true);
                } 
                else if (player2.points === 15 + receiversChoice) {
                    setWinner(player2.name);
                    setShowWinner(true);
                }
            }
        }
        else {
            console.log("Couldn't find matching scoring algorithm. Please check sport choice.");
        }
    }, [players]); // Run this effect whenever 'players' state changes


    function chooseOneExtraPoint(){
        setReceiversChoice(0);
        // console.log("Receiver chose 1 extra point!");
        setModal(false);
    }

    function chooseThreeExtraPoints(){
        setReceiversChoice(2);
        // console.log("Receiver chose 3 extra points!");
        setModal(false);
    }

    function handleGoBack(){
        setShowWinner(false);
        setWinner(null); // Reset the winner state in order to make changes to score again
    };
    
    
    // Generating dots for last 5 points
    const lastFivePoints = scoreHistory.slice(-5);
    const recentPointsP1 = lastFivePoints.map((point, index) => <div className={`point-circle ${point.player === "P1" ? "point-won" : "point-lost"}`} key={index}></div>);
    const recentPointsP2 = lastFivePoints.map((point, index) => <div className={`point-circle ${point.player === "P2" ? "point-won" : "point-lost"}`} key={index}></div>);

    return (
        <>
            <div className="players-container">
                {/* Back button */}
                <svg onClick={toInput} className="back-button" width="48" height="48" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m10.978 14.999v3.251c0 .412-.335.75-.752.75-.188 0-.375-.071-.518-.206-1.775-1.685-4.945-4.692-6.396-6.069-.2-.189-.312-.452-.312-.725 0-.274.112-.536.312-.725 1.451-1.377 4.621-4.385 6.396-6.068.143-.136.33-.207.518-.207.417 0 .752.337.752.75v3.251h9.02c.531 0 1.002.47 1.002 1v3.998c0 .53-.471 1-1.002 1z" fillRule="nonzero"/>
                </svg>

                {/* Modal that pops up when score is tied at 14-14 asking receiver how many more points should be played */}
                {modal && 
                <Modal
                    openModal={modal}
                    closeModal={() => setModal(false)}
                    className=""
                >
                    <h1 className="modal-header">Extra points (receiver's choice)</h1>
                    <div className="modal-buttons">
                        <button onClick={chooseOneExtraPoint} className="modal-button">1</button>
                        <button onClick={chooseThreeExtraPoints} className="modal-button">3</button>
                    </div>                
                </Modal>}
                

                {/* First player/team display */}
                <ul className="player-one">
                    {/* Player name, colour and score */}
                    <div className="player-details">
                        <li className="player-one-banner">
                            <div className="player-team-one" style={p1TeamStyles}></div>
                            <span className="player-one-name">{players[0].name}</span>
                        </li>

                        {showWinner ? (
                            <div className="winner-box">
                                <h1 className="winner-name">{winner} wins!</h1>
                                <button className="view-score-btn" onClick={handleGoBack}>View Score</button>
                            </div>
                            ) : (
                            <div>
                                <li className="player-points">
                                    <span onClick={() => updatePlayerPoints(0, false)} disabled={players[0].points === 0} className="score-minus">-</span>
                                    <span>{players[0].points}</span>
                                    <span onClick={() => updatePlayerPoints(0, true)} className="score-plus">+</span>
                                </li>
                                <div className="recent-points">{recentPointsP1}</div>
                            </div>
                        )}
                    </div>
                    
                    {/* Heart rate display */}
                    <li className="heart-rate-box" style={(deviceStatusOne === "connected" || mockData) && heartRateOne ? (chooseBackgroundColor(calcHRPercent(heartRateOne[heartRateOne.length - 1].value, players[0].age))) : ({backgroundColor: "#c2cbca"})}>
                        {deviceInitialisedOne || mockData ? (
                            <div className="player-heart-rate">
                                <div className="bluetooth-buttons">                                  
                                    {/* Display pause/resume buttons depending on HR characteristic measurements */}
                                    {pausedOne ? (
                                        <button onClick={handleResumeOne} className="bluetooth-disconnect-btn">Resume</button>
                                    ) : (
                                        <button onClick={handlePauseOne} className="bluetooth-disconnect-btn">Pause</button>
                                    )}

                                    {/* Display disconnect/reconnect buttons depending on connection status */}
                                    {disconnectedManuallyRefOne.current || reconnectOverrideOne ? (
                                        <button onClick={handleManualReconnectOne} className="bluetooth-reconnect-btn">Reconnect</button>
                                    ) : (
                                        <button onClick={handleManualDisconnectOne} className="bluetooth-disconnect-btn">Disconnect</button>
                                    )}
                                </div>
                                <div className="heart-rate-stats">
                                    <div>{`${calcHRPercent(heartRateOne[heartRateOne.length - 1].value, players[0].age)}%`}</div>
                                    <div className="hr-absolute">
                                        <div>{heartRateOne[heartRateOne.length - 1].value}</div>
                                        <div className="hr-extremities">
                                            <div className="player-max-heart-rate">
                                                <svg className="hr-max-icon" height="40" width="32" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="m16.843 13.789c.108.141.157.3.157.456 0 .389-.306.755-.749.755h-8.501c-.445 0-.75-.367-.75-.755 0-.157.05-.316.159-.457 1.203-1.554 3.252-4.199 4.258-5.498.142-.184.36-.29.592-.29.23 0 .449.107.591.291 1.002 1.299 3.044 3.945 4.243 5.498z"/>
                                                </svg>
                                                <span>{Math.max(...heartRateOneOnly)}</span>
                                            </div>
                                            <div className="player-min-heart-rate">
                                                <svg className="hr-max-icon" height="40" width="32" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z"/>
                                                </svg>
                                                <span>{Math.min(...heartRateOneOnly)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <svg className="heart-rate-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                                    <path d="M18.905 14c-2.029 2.401-4.862 5.005-7.905 8-5.893-5.8-11-10.134-11-14.371 0-6.154 8.114-7.587 11-2.676 2.865-4.875 11-3.499 11 2.676 0 .784-.175 1.572-.497 2.371h-6.278c-.253 0-.486.137-.61.358l-.813 1.45-2.27-4.437c-.112-.219-.331-.364-.576-.38-.246-.016-.482.097-.622.299l-1.88 2.71h-1.227c-.346-.598-.992-1-1.732-1-1.103 0-2 .896-2 2s.897 2 2 2c.74 0 1.386-.402 1.732-1h1.956c.228 0 .441-.111.573-.297l.989-1.406 2.256 4.559c.114.229.343.379.598.389.256.011.496-.118.629-.337l1.759-2.908h8.013v2h-5.095z"/>
                                </svg>
                                <div className="device-status">
                                    <div style={chooseStatusColor(deviceStatusOne)} className="device-status-circle"></div>
                                    <div className="device-status-text">{deviceStatusOne}</div>
                                </div>

                                {/* Don't display battery level when using mock data */}
                                {!mockData && 
                                    <div className="device-battery">
                                        <svg className="battery-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 7v10h-17v-10h17zm2-2h-21v14h21v-14zm1 11h.75c.69 0 1.25-.56 1.25-1.25v-5.5c0-.69-.56-1.25-1.25-1.25h-.75v8z"/>
                                        </svg>
                                        <div className="device-battery-value">{batteryLevelOne ? `${batteryLevelOne}%` : "Loading..."}</div>
                                    </div>
                                }
                            </div>
                            ) : (
                            <button className="bluetooth-connect-btn" onClick={connectToHeartRateSensorOne}>Connect HR Monitor</button>
                        )}
                    </li>
                </ul>

                



                {/* Second player/team display */}
                <ul className="player-two">
                    {/* Player name, colour and score */}
                    <div className="player-details">
                        <li className="player-two-banner">
                            <span className="player-two-name">{players[1].name}</span>
                            <div className="player-team-two" style={p2TeamStyles}></div>
                        </li>

                        {showWinner ? (
                            <div className="winner-box">
                                <h1 className="winner-name">{winner} wins!</h1>
                                <button className="view-score-btn" onClick={handleGoBack}>View Score</button>
                            </div>
                            ) : (
                            <div>
                                <li className="player-points">
                                    <span onClick={() => updatePlayerPoints(1, false)} disabled={players[1].points === 0} className="score-minus">-</span>
                                    <span>{players[1].points}</span>
                                    <span onClick={() => updatePlayerPoints(1, true)} className="score-plus">+</span>
                                </li>
                                <div className="recent-points">{recentPointsP2}</div>
                            </div>
                        )}
                    </div>
                    
                    {/* Heart rate display */}
                    <li className="heart-rate-box" style={(deviceStatusTwo === "connected" || mockData) && heartRateTwo ? (chooseBackgroundColor(calcHRPercent(heartRateTwo[heartRateTwo.length - 1].value, players[1].age))) : ({backgroundColor: "#c2cbca"})}>
                        {deviceInitialisedTwo || mockData ? (
                            <div className="player-heart-rate">
                                <div className="bluetooth-buttons">                                  
                                    {/* Display pause/resume buttons depending on HR characteristic measurements */}
                                    {pausedTwo ? (
                                        <button onClick={handleResumeTwo} className="bluetooth-disconnect-btn">Resume</button>
                                    ) : (
                                        <button onClick={handlePauseTwo} className="bluetooth-disconnect-btn">Pause</button>
                                    )}

                                    {/* Display disconnect/reconnect buttons depending on connection status */}
                                    {disconnectedManuallyRefTwo.current || reconnectOverrideTwo ? (
                                        <button onClick={handleManualReconnectTwo} className="bluetooth-reconnect-btn">Reconnect</button>
                                    ) : (
                                        <button onClick={handleManualDisconnectTwo} className="bluetooth-disconnect-btn">Disconnect</button>
                                    )}
                                </div>
                                <div className="heart-rate-stats">
                                    <div>{`${calcHRPercent(heartRateTwo[heartRateTwo.length - 1].value, players[1].age)}%`}</div>
                                    <div className="hr-absolute">
                                        <div>{heartRateTwo[heartRateTwo.length - 1].value}</div>
                                        <div className="hr-extremities">
                                            <div className="player-max-heart-rate">
                                                <svg className="hr-max-icon" height="40" width="32" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="m16.843 13.789c.108.141.157.3.157.456 0 .389-.306.755-.749.755h-8.501c-.445 0-.75-.367-.75-.755 0-.157.05-.316.159-.457 1.203-1.554 3.252-4.199 4.258-5.498.142-.184.36-.29.592-.29.23 0 .449.107.591.291 1.002 1.299 3.044 3.945 4.243 5.498z"/>
                                                </svg>
                                                <span>{Math.max(...heartRateTwoOnly)}</span>
                                            </div>
                                            <div className="player-min-heart-rate">
                                                <svg className="hr-max-icon" height="40" width="32" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z"/>
                                                </svg>
                                                <span>{Math.min(...heartRateTwoOnly)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <svg className="heart-rate-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                                    <path d="M18.905 14c-2.029 2.401-4.862 5.005-7.905 8-5.893-5.8-11-10.134-11-14.371 0-6.154 8.114-7.587 11-2.676 2.865-4.875 11-3.499 11 2.676 0 .784-.175 1.572-.497 2.371h-6.278c-.253 0-.486.137-.61.358l-.813 1.45-2.27-4.437c-.112-.219-.331-.364-.576-.38-.246-.016-.482.097-.622.299l-1.88 2.71h-1.227c-.346-.598-.992-1-1.732-1-1.103 0-2 .896-2 2s.897 2 2 2c.74 0 1.386-.402 1.732-1h1.956c.228 0 .441-.111.573-.297l.989-1.406 2.256 4.559c.114.229.343.379.598.389.256.011.496-.118.629-.337l1.759-2.908h8.013v2h-5.095z"/>
                                </svg>
                                <div className="device-status">
                                    <div style={chooseStatusColor(deviceStatusTwo)} className="device-status-circle"></div>
                                    <div className="device-status-text">{deviceStatusTwo}</div>
                                </div>

                                {/* Don't display battery level when using mock data */}
                                {!mockData && 
                                    <div className="device-battery">
                                        <svg className="battery-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 7v10h-17v-10h17zm2-2h-21v14h21v-14zm1 11h.75c.69 0 1.25-.56 1.25-1.25v-5.5c0-.69-.56-1.25-1.25-1.25h-.75v8z"/>
                                        </svg>
                                        <div className="device-battery-value">{batteryLevelTwo ? `${batteryLevelTwo}%` : "Loading..."}</div>
                                    </div>
                                }
                            </div>
                            ) : (
                            <button className="bluetooth-connect-btn" onClick={connectToHeartRateSensorTwo}>Connect HR Monitor</button>
                        )}
                    </li>
                </ul>

                {/* Results button */}
                <svg onClick={toResults} className="next-button" width="48" height="48" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m13.022 14.999v3.251c0 .412.335.75.752.75.188 0 .375-.071.518-.206 1.775-1.685 4.945-4.692 6.396-6.069.2-.189.312-.452.312-.725 0-.274-.112-.536-.312-.725-1.451-1.377-4.621-4.385-6.396-6.068-.143-.136-.33-.207-.518-.207-.417 0-.752.337-.752.75v3.251h-9.02c-.531 0-1.002.47-1.002 1v3.998c0 .53.471 1 1.002 1z" fillRule="nonzero"/>
                </svg>
            </div>
        </>
    )
}