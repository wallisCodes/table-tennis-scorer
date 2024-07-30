import { useState, useEffect } from "react";

// export default function GameTracking({p1HeartRate, setP1HeartRate, p2HeartRate, setP2HeartRate, players, setPlayers, backToInput}){
export default function GameTracking({p1HeartRate, p2HeartRate, players, setPlayers, backToInput, bluetoothOne,
                                    connectOne, printHeartRateOne, bluetoothTwo, connectTwo, printHeartRateTwo
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
            case (90 <= heartRatePercent && heartRatePercent <= 100):
                bgColor = "#de105b"; //red
                break
            default: bgColor = "#c2cbca"; //grey
        }
        return {backgroundColor: bgColor};
    }


    // SCORING STATE & LOGIC
    const [winner, setWinner] = useState(null);
    const [showWinner, setShowWinner] = useState(false);
    const [scoreHistory, setScoreHistory] = useState([]);


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
            setScoreHistory(prevScoreHistory => [...prevScoreHistory, `P${playerIndex + 1}`]);
        } else if (!increment && players[playerIndex].points > 0) {
            setScoreHistory(prevScoreHistory => prevScoreHistory.slice(0, -1));
        }
    };


    useEffect(() => {
        if (players.length >= 2) {
            const [player1, player2] = players;

            if (player1.points >= 21 && player1.points - player2.points >= 2) {
                setWinner(player1.name);
                setShowWinner(true);
            } else if (player2.points >= 21 && player2.points - player1.points >= 2) {
                setWinner(player2.name);
                setShowWinner(true);
            }
        }
    }, [players]); // Run this effect whenever 'players' state changes

    function handleGoBack(){
        setShowWinner(false);
        setWinner(null); // Reset the winner state in order to make changes to score again
    };
    
    
    // Generating dots for last 5 points
    const lastFivePoints = scoreHistory.slice(-5);
    const recentPointsP1 = lastFivePoints.map((point, index) => <div className={`point-circle ${point === "P1" ? "point-won" : "point-lost"}`} key={index}></div>);
    const recentPointsP2 = lastFivePoints.map((point, index) => <div className={`point-circle ${point === "P2" ? "point-won" : "point-lost"}`} key={index}></div>);

    return (
        <>
            <div className="players-container">
                {/* Back button */}
                <svg onClick={backToInput} className="back-button" width="48" height="48" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m10.978 14.999v3.251c0 .412-.335.75-.752.75-.188 0-.375-.071-.518-.206-1.775-1.685-4.945-4.692-6.396-6.069-.2-.189-.312-.452-.312-.725 0-.274.112-.536.312-.725 1.451-1.377 4.621-4.385 6.396-6.068.143-.136.33-.207.518-.207.417 0 .752.337.752.75v3.251h9.02c.531 0 1.002.47 1.002 1v3.998c0 .53-.471 1-1.002 1z" fillRule="nonzero"/>
                </svg>

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
                    <li className="heart-rate-box" style={bluetoothOne ? (chooseBackgroundColor(calcHRPercent(p1HeartRate[p1HeartRate.length - 1], players[0].age))) : ({backgroundColor: "#c2cbca"})}>
                        {bluetoothOne ? (
                            <div className="player-heart-rate">
                                <div className="heart-rate-stats">
                                    <div>{`${calcHRPercent(p1HeartRate[p1HeartRate.length - 1], players[0].age)}%`}</div>
                                    <div className="hr-absolute">
                                        <div>{p1HeartRate[p1HeartRate.length - 1]}</div>
                                        <div className="hr-extremities">
                                            <div className="player-max-heart-rate">
                                                <svg className="hr-max-icon" height="40" width="32" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="m16.843 13.789c.108.141.157.3.157.456 0 .389-.306.755-.749.755h-8.501c-.445 0-.75-.367-.75-.755 0-.157.05-.316.159-.457 1.203-1.554 3.252-4.199 4.258-5.498.142-.184.36-.29.592-.29.23 0 .449.107.591.291 1.002 1.299 3.044 3.945 4.243 5.498z"/>
                                                </svg>
                                                <span>{Math.max(...p1HeartRate)}</span>
                                            </div>
                                            <div className="player-min-heart-rate">
                                                <svg className="hr-max-icon" height="40" width="32" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z"/>
                                                </svg>
                                                <span>{Math.min(...p1HeartRate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <svg className="heart-rate-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                                    <path d="M18.905 14c-2.029 2.401-4.862 5.005-7.905 8-5.893-5.8-11-10.134-11-14.371 0-6.154 8.114-7.587 11-2.676 2.865-4.875 11-3.499 11 2.676 0 .784-.175 1.572-.497 2.371h-6.278c-.253 0-.486.137-.61.358l-.813 1.45-2.27-4.437c-.112-.219-.331-.364-.576-.38-.246-.016-.482.097-.622.299l-1.88 2.71h-1.227c-.346-.598-.992-1-1.732-1-1.103 0-2 .896-2 2s.897 2 2 2c.74 0 1.386-.402 1.732-1h1.956c.228 0 .441-.111.573-.297l.989-1.406 2.256 4.559c.114.229.343.379.598.389.256.011.496-.118.629-.337l1.759-2.908h8.013v2h-5.095z"/>
                                </svg>
                            </div>
                            ) : (
                            <button className="bluetooth-connect-btn" onClick={() => connectOne({ onChange: printHeartRateOne }).catch(console.error)}>Connect HR Monitor</button>   
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
                    <li className="heart-rate-box" style={bluetoothTwo ? (chooseBackgroundColor(calcHRPercent(p2HeartRate[p2HeartRate.length - 1], players[1].age))) : ({backgroundColor: "#c2cbca"})}>
                        {bluetoothTwo ? (
                            <div className="player-heart-rate">
                                <div className="heart-rate-stats">
                                    <div>{`${calcHRPercent(p2HeartRate[p2HeartRate.length - 1], players[1].age)}%`}</div>
                                    <div className="hr-absolute">
                                        <div>{p2HeartRate[p2HeartRate.length - 1]}</div>
                                        <div className="hr-extremities">
                                            <div className="player-max-heart-rate">
                                                <svg className="hr-max-icon" height="40" width="32" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="m16.843 13.789c.108.141.157.3.157.456 0 .389-.306.755-.749.755h-8.501c-.445 0-.75-.367-.75-.755 0-.157.05-.316.159-.457 1.203-1.554 3.252-4.199 4.258-5.498.142-.184.36-.29.592-.29.23 0 .449.107.591.291 1.002 1.299 3.044 3.945 4.243 5.498z"/>
                                                </svg>
                                                <span>{Math.max(...p2HeartRate)}</span>
                                            </div>
                                            <div className="player-min-heart-rate">
                                                <svg className="hr-max-icon" height="40" width="32" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z"/>
                                                </svg>
                                                <span>{Math.min(...p2HeartRate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <svg className="heart-rate-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                                    <path d="M18.905 14c-2.029 2.401-4.862 5.005-7.905 8-5.893-5.8-11-10.134-11-14.371 0-6.154 8.114-7.587 11-2.676 2.865-4.875 11-3.499 11 2.676 0 .784-.175 1.572-.497 2.371h-6.278c-.253 0-.486.137-.61.358l-.813 1.45-2.27-4.437c-.112-.219-.331-.364-.576-.38-.246-.016-.482.097-.622.299l-1.88 2.71h-1.227c-.346-.598-.992-1-1.732-1-1.103 0-2 .896-2 2s.897 2 2 2c.74 0 1.386-.402 1.732-1h1.956c.228 0 .441-.111.573-.297l.989-1.406 2.256 4.559c.114.229.343.379.598.389.256.011.496-.118.629-.337l1.759-2.908h8.013v2h-5.095z"/>
                                </svg>
                            </div>
                            ) : (
                            <button className="bluetooth-connect-btn" onClick={() => connectTwo({ onChange: printHeartRateTwo }).catch(console.error)}>Connect HR Monitor</button>
                        )}
                    </li>
                </ul>
            </div>
        </>
    )
}