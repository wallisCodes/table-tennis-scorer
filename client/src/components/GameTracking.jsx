import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import { createHeartRate, createMatch, createMatchPlayers, createScoreHistory, updateMatch, updateMatchPlayer } from "../api";
import { calcHRPercent, chooseBackgroundColor, chooseStatusColor, getMatchDuration } from "../utility";
// import _ from 'lodash';

export default function GameTracking({
    matchDetails, setMatchDetails, matchStatus, players, setPlayers, getCurrentTime, toInput, toResults, heartRateOne, heartRateOneOnly, scoreHistory,
    setScoreHistory, deviceInitialisedOne, deviceStatusOne, pausedOne, reconnectOverrideOne, disconnectedManuallyRefOne, handleManualDisconnectOne,
    handleManualReconnectOne, connectToHeartRateSensorOne, handlePauseOne, handleResumeOne, batteryLevelOne, heartRateTwo, heartRateTwoOnly,
    deviceInitialisedTwo, deviceStatusTwo, pausedTwo, reconnectOverrideTwo, disconnectedManuallyRefTwo, handleManualDisconnectTwo,
    handleManualReconnectTwo, connectToHeartRateSensorTwo, handlePauseTwo, handleResumeTwo, batteryLevelTwo, mockData, userIdRef, playerIdsRef, matchIdRef, matchPlayerIdsRef
}){
    // Dynamically assign player colours to tracking screen based on previous user input
    const p1TeamStyles = {
        backgroundColor: players[0].colour,
        borderRight: "2px solid white"
    }

    const p2TeamStyles = {
        backgroundColor: players[1].colour,
        borderLeft: "2px solid white"
    }

    // SCORING STATE & LOGIC
    const [winner, setWinner] = useState(null);
    const [showWinner, setShowWinner] = useState(false);
    const [modal, setModal] = useState(false); // Modal for receiver to choose extra points played if tied 14-14
    const [receiversChoice, setReceiversChoice] = useState(0);
    const [scoreCooldown, setScoreCooldown] = useState(false);
    const shortCooldown = 1000;
    const longCooldown = 1000; // TODO: change back to 3000

    function updatePlayerPoints(playerIndex, increment = true){
        // Only update scores if they haven't been updated within [cooldownDuration] ms
        if (!scoreCooldown){
            // Update individual player inside players state with latest points
            setPlayers(prevPlayers => {
                const updatedPlayers = [...prevPlayers]; // Creating shallow copy of players array
    
                if (playerIndex >= 0 && playerIndex < updatedPlayers.length) {
                    const currentPoints = updatedPlayers[playerIndex].points;
    
                    // Only update points if no one has won yet or if decrementing
                    if ((!winner) || !increment) {
                        const newPoints = increment ? currentPoints + 1 : Math.max(0, currentPoints - 1);
                        updatedPlayers[playerIndex] = {
                            ...updatedPlayers[playerIndex],
                            points: newPoints
                        };
                    }
                }
                return updatedPlayers;
            });
    
            // If incrementing points, also add entry to scoreHistory
            if (increment) {
                const currentTime = getCurrentTime();
                setScoreHistory(prevScoreHistory => [
                    ...prevScoreHistory,
                    {
                        winner: `P${playerIndex + 1}`,
                        time: currentTime
                    }
                ]);
            
            // If decrementing points and points are non-zero, remove latest entry from scoreHistory
            } else if (!increment && players[playerIndex].points > 0) {
                setScoreHistory(prevScoreHistory => prevScoreHistory.slice(0, -1));
            }

            setScoreCooldown(true);
            setTimeout(() => setScoreCooldown(false), longCooldown);
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
    const recentPointsP1 = lastFivePoints.map((point, index) => <div className={`point-circle ${point.winner === "P1" ? "point-won" : "point-lost"}`} key={index}></div>);
    const recentPointsP2 = lastFivePoints.map((point, index) => <div className={`point-circle ${point.winner === "P2" ? "point-won" : "point-lost"}`} key={index}></div>);
    

    async function startMatch(){
        matchStatus.current = "active";
        setScoreCooldown(true);
        // Record start of match in matchDetails
        const currentTime = getCurrentTime();
        // Dividing by 1000 crucial here! Allows integer size constraint set out by Postgres to be obeyed
        // Storing currentDate in milliseconds would require changing data type on the backend to BIG INT
        const currentDate = Math.floor(new Date().getTime() / 1000);

        // Create matchDetails manually BEFORE setting state
        const newMatchDetailsState = {
            sport: matchDetails.sport, // Keep previous sport
            date: currentDate,
            startTime: currentTime,
            userId: userIdRef.current
        };

        // Pass directly into the fetch function instead of waiting for state update
        await startMatchFetchRequests(newMatchDetailsState);
        // THEN update the state (not used in fetch)
        setMatchDetails(newMatchDetailsState);

        setTimeout(() => setScoreCooldown(false), shortCooldown);
    }


    // Keeping track of whether startMatchFetchRequests/finishMatchFetchRequests have been executed,
    // so they don't accidentally execute twice and create/update too many records in the database
    const hasExecutedStartRef = useRef(false);
    const hasExecutedFinishRef = useRef(false);

    // Function to create match record, retrieve matchId and use it alongside playerIds to create matchPlayer records
    async function startMatchFetchRequests(matchDetails){
        if (hasExecutedStartRef.current) return; // Prevent duplicate execution
        hasExecutedStartRef.current = true; // Mark as executed

        // Saving match record and returning match id for future use
        matchIdRef.current = await createMatch(matchDetails);
        console.log("matchIdRef:", matchIdRef.current);
        // Saving match player records (one for each player) and returning matchPlayer ids for future use
        matchPlayerIdsRef.current = await createMatchPlayers(playerIdsRef.current, matchIdRef.current);
    }
    
    
    function finishMatch(){
        matchStatus.current = "complete";
        const currentTime = getCurrentTime();
        const matchDuration = getMatchDuration(matchDetails.startTime, currentTime);
        
        // Create updated match details BEFORE setting state
        const updatedMatchDetailsState = {
            ...matchDetails,
            endTime: currentTime,
            duration: matchDuration
        };

        // console.log("updatedMatchDetailsState (aka matchDetails):", updatedMatchDetailsState);
        
        // Pass directly into fetch function instead of waiting for state update
        finishMatchFetchRequests(updatedMatchDetailsState);
        // THEN update the state (this doesn't affect the fetch function)
        setMatchDetails(updatedMatchDetailsState);
        // Automatically navigate to Results "page"
        toResults();
    }


    // Function to update match/match player records, and save scoring/heart rate datasets 
    async function finishMatchFetchRequests(matchDetails){
        if (hasExecutedFinishRef.current) return; // Prevent duplicate execution
        hasExecutedFinishRef.current = true; // Mark as executed

        // Calculate winnerId from both players points
        const winnerIndex = players[0].points > players[1].points ? 0 : 1;
        const winnerId = playerIdsRef.current[winnerIndex];

        // Updating match with endTime, duration and winnerId
        const updatedMatchData = {
            endTime: matchDetails.endTime,
            matchDuration: matchDetails.duration,
            winnerId
        }
        updateMatch(matchIdRef.current, updatedMatchData);

        // Updating first match player record with finalScore
        updateMatchPlayer(matchPlayerIdsRef.current[0], { finalScore: players[0].points });
        // Updating second match player record with finalScore
        updateMatchPlayer(matchPlayerIdsRef.current[1], { finalScore: players[1].points });
        // Saving score history batch data
        createScoreHistory(matchIdRef.current, scoreHistory);
        // Saving heart rate batch data for player one
        createHeartRate(matchIdRef.current, playerIdsRef.current[0], heartRateOne);
        // Saving heart rate batch data for player two
        createHeartRate(matchIdRef.current, playerIdsRef.current[1], heartRateTwo);
    }


    return (
        <>
            <div className="score-tracking-container">
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
                <div className="player-one">
                    {/* Player name, colour and score */}
                    <div className="player-details">
                        <div className="player-one-banner">
                            <div className="player-team-one" style={p1TeamStyles}></div>
                            <span className="player-one-name">{players[0].name}</span>
                        </div>

                        {matchStatus.current === "pending" ? (
                            <button className="start-game-btn" onClick={startMatch}>Start Match</button>
                            ) : (
                                matchStatus.current === "active" ? (showWinner ? (
                                    <div className="winner-box">
                                        <h1 className="winner-name">{winner} wins!</h1>
                                        <div className="post-match-buttons">
                                            <button className="post-match-btn" onClick={handleGoBack}>View Score</button>
                                            <button className="post-match-btn" onClick={finishMatch}>Match Complete</button>
                                        </div>
                                    </div>
                                    ) : (
                                    <div className="score-container">
                                        <div className="player-points">
                                            <button onClick={() => updatePlayerPoints(0, false)} disabled={players[0].points === 0 || scoreCooldown} className="score-minus">-</button>
                                            <div className="score-value">{players[0].points}</div>
                                            <button onClick={() => updatePlayerPoints(0, true)} disabled={scoreCooldown} className="score-plus">+</button>
                                        </div>
                                        <div className="recent-points">{recentPointsP1}</div>
                                    </div>
                                )) : (
                                    <h1 className="">Match complete!</h1>
                                )
                            )
                        }
                    </div>
                    
                    {/* Heart rate display */}
                    <div className="heart-rate-box" style={(deviceStatusOne === "connected" || mockData) && heartRateOne.length > 0 ? (chooseBackgroundColor(calcHRPercent(heartRateOne[heartRateOne.length - 1].value, players[0].age))) : ({backgroundColor: "#c2cbca"})}>
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

                                {/* Wait until readings come in to display them */}
                                {heartRateOne.length > 0 ? (
                                    <>
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
                                    </>
                                    ) : (
                                    <h3>Loading...</h3>
                                )}

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
                    </div>
                </div>

                
                {/* Second player/team display */}
                <div className="player-two">
                    {/* Player name, colour and score */}
                    <div className="player-details">
                        <div className="player-two-banner">
                            <span className="player-two-name">{players[1].name}</span>
                            <div className="player-team-two" style={p2TeamStyles}></div>
                        </div>

                        {matchStatus.current === "active" ? (
                            showWinner ? (
                                <div className="winner-box">
                                    <h1 className="winner-name">{winner} wins!</h1>
                                    <div className="post-match-buttons">
                                        <button className="post-match-btn" onClick={handleGoBack}>View Score</button>
                                        <button className="post-match-btn" onClick={finishMatch}>Match Complete</button>
                                    </div>
                                </div>
                                ) : (
                                <div className="score-container">
                                    <div className="player-points">
                                        <button onClick={() => updatePlayerPoints(1, false)} disabled={players[1].points === 0 || scoreCooldown} className="score-minus">-</button>
                                        <div className="score-value">{players[1].points}</div>
                                        <button onClick={() => updatePlayerPoints(1, true)} disabled={scoreCooldown} className="score-plus">+</button>
                                    </div>
                                    <div className="recent-points">{recentPointsP2}</div>
                                </div>
                            )) : ( 
                            matchStatus.current === "complete" && <h1 className="">Match complete!</h1>
                        )}
                    </div>
                    
                    {/* Heart rate display */}
                    <div className="heart-rate-box" style={(deviceStatusTwo === "connected" || mockData) && heartRateTwo.length > 0 ? (chooseBackgroundColor(calcHRPercent(heartRateTwo[heartRateTwo.length - 1].value, players[1].age))) : ({backgroundColor: "#c2cbca"})}>
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

                                {/* Wait until readings come in to display them */}
                                {heartRateTwo.length > 0 ? (
                                    <>
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
                                    </>
                                    ) : (
                                    <h3>Loading...</h3>
                                )}

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
                    </div>
                </div>

                {/* Results button, only render if the match is either active or complete AND at least one type of data is available */}
                {(matchStatus.current != "pending" && (scoreHistory.length > 0 || heartRateOne.length > 0 || heartRateTwo.length > 0)) &&
                    <svg onClick={toResults} className="next-button" width="48" height="48" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="m13.022 14.999v3.251c0 .412.335.75.752.75.188 0 .375-.071.518-.206 1.775-1.685 4.945-4.692 6.396-6.069.2-.189.312-.452.312-.725 0-.274-.112-.536-.312-.725-1.451-1.377-4.621-4.385-6.396-6.068-.143-.136-.33-.207-.518-.207-.417 0-.752.337-.752.75v3.251h-9.02c-.531 0-1.002.47-1.002 1v3.998c0 .53.471 1 1.002 1z" fillRule="nonzero"/>
                    </svg>
                }
            </div>
        </>
    )
}