export default function GameTracking({p1HeartRate, p2HeartRate, players, setPlayers, backToInput}){
    function maxHeartRate(age){
        return 220 - age;
    }

    // Dynamically assign player colours to tracking screen based on previous user input
    const p1TeamStyles = {
        backgroundColor: players[0].colour
    }

    const p2TeamStyles = {
        backgroundColor: players[1].colour
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

    // console.log(`HR percent = ${JSON.stringify(calcHRPercent(130, 60))}`);
    // console.log(`bgColor style = ${JSON.stringify(chooseBackgroundColor(95))}`);


    // Scoring logic
    const incrementP1Score = () => {
        setPlayers(prevPlayers => {
            // Create a shallow copy of the previous players array
            const updatedPlayers = [...prevPlayers];
            
            // Check if the array is not empty and increase the points of the first player
            if (updatedPlayers.length > 0) {
                updatedPlayers[0] = { ...updatedPlayers[0], points: updatedPlayers[0].points + 1 };
            }
            
            return updatedPlayers;
        });
    };

    const decrementP1Score = () => {
        setPlayers(prevPlayers => {
            // Create a shallow copy of the previous players array
            const updatedPlayers = [...prevPlayers];
            
            // Check if the array is not empty and decrease the points of the first player, ensuring they don't go below 0
            if (updatedPlayers.length > 0) {
                const newPoints = Math.max(0, updatedPlayers[0].points - 1);
                updatedPlayers[0] = { ...updatedPlayers[0], points: newPoints };
            }
            
            return updatedPlayers;
        });
    };

    const incrementP2Score = () => {
        setPlayers(prevPlayers => {
            // Create a shallow copy of the previous players array
            const updatedPlayers = [...prevPlayers];
            
            // Check if the array is not empty and increase the points of the second player
            if (updatedPlayers.length > 0) {
                updatedPlayers[1] = { ...updatedPlayers[1], points: updatedPlayers[1].points + 1 };
            }
            
            return updatedPlayers;
        });
    };

    const decrementP2Score = () => {
        setPlayers(prevPlayers => {
            // Create a copy of the previous players array
            const updatedPlayers = [...prevPlayers];
            
            // Check if the array is not empty and decrease the points of the second player, ensuring they don't go below 0
            if (updatedPlayers.length > 0) {
                const newPoints = Math.max(0, updatedPlayers[1].points - 1);
                updatedPlayers[1] = { ...updatedPlayers[1], points: newPoints };
            }
            
            return updatedPlayers;
        });
    };



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
                        <li className="player-banner">
                            <div className="player-team-one" style={p1TeamStyles}></div>
                            <span className="player-name">{players[0].name}</span>
                        </li>
                        <li className="player-points">
                            <span onClick={decrementP1Score} disabled={players[0].points === 0} className="score-control">-</span>
                            <span>{players[0].points}</span>
                            <span onClick={incrementP1Score} className="score-control">+</span>
                        </li>
                    </div>
                    
                    {/* Heart rate display */}
                    <li className="player-heart-rate" style={chooseBackgroundColor(calcHRPercent(p1HeartRate, players[0].age))}>
                        <div className="heart-rate-stats">
                            <div>{`${calcHRPercent(p1HeartRate, players[0].age)}%`}</div>
                            <div>{p1HeartRate}</div>
                        </div>
                        <svg className="heart-rate-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                            <path d="M18.905 14c-2.029 2.401-4.862 5.005-7.905 8-5.893-5.8-11-10.134-11-14.371 0-6.154 8.114-7.587 11-2.676 2.865-4.875 11-3.499 11 2.676 0 .784-.175 1.572-.497 2.371h-6.278c-.253 0-.486.137-.61.358l-.813 1.45-2.27-4.437c-.112-.219-.331-.364-.576-.38-.246-.016-.482.097-.622.299l-1.88 2.71h-1.227c-.346-.598-.992-1-1.732-1-1.103 0-2 .896-2 2s.897 2 2 2c.74 0 1.386-.402 1.732-1h1.956c.228 0 .441-.111.573-.297l.989-1.406 2.256 4.559c.114.229.343.379.598.389.256.011.496-.118.629-.337l1.759-2.908h8.013v2h-5.095z"/>
                        </svg>
                    </li>
                    {/* Implement a more accurate way to calculate heart rate? */}
                    {/* <li className="player-max-heart-rate">{`Max: ${maxHeartRate(players[0].age)} bpm`}</li> 
                    <li className="player-serving">{players[0].serving ? "Serving" : "Not Serving"}</li> */}
                </ul>

                {/* Second player/team display */}
                <ul className="player-two">
                    {/* Player name, colour and score */}
                    <div className="player-details">
                        <li className="player-banner">
                            <span className="player-name">{players[1].name}</span>
                            <div className="player-team-two" style={p2TeamStyles}></div>
                        </li>
                        <li className="player-points">
                            <span onClick={decrementP2Score} className="score-control">-</span>
                            <span>{players[1].points}</span>
                            <span onClick={incrementP2Score} className="score-control">+</span>
                        </li>
                    </div>
                    
                    {/* Heart rate display */}
                    <li className="player-heart-rate" style={chooseBackgroundColor(calcHRPercent(p2HeartRate, players[1].age))}>
                        <div className="heart-rate-stats">
                            <div>{`${calcHRPercent(p2HeartRate, players[1].age)}%`}</div>
                            <div>{p2HeartRate}</div>
                        </div>
                        <svg className="heart-rate-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                            <path d="M18.905 14c-2.029 2.401-4.862 5.005-7.905 8-5.893-5.8-11-10.134-11-14.371 0-6.154 8.114-7.587 11-2.676 2.865-4.875 11-3.499 11 2.676 0 .784-.175 1.572-.497 2.371h-6.278c-.253 0-.486.137-.61.358l-.813 1.45-2.27-4.437c-.112-.219-.331-.364-.576-.38-.246-.016-.482.097-.622.299l-1.88 2.71h-1.227c-.346-.598-.992-1-1.732-1-1.103 0-2 .896-2 2s.897 2 2 2c.74 0 1.386-.402 1.732-1h1.956c.228 0 .441-.111.573-.297l.989-1.406 2.256 4.559c.114.229.343.379.598.389.256.011.496-.118.629-.337l1.759-2.908h8.013v2h-5.095z"/>
                        </svg>
                    </li>
                    {/* <li className="player-max-heart-rate">{`Max: ${220 - players[1].age} bpm`}</li> */}
                    {/* <li className="player-serving">{players[1].serving ? "Serving" : "Not Serving"}</li> */}
                </ul>
            </div>
            <div className="match-progress">{`${players[0].games} - ${players[1].games}`}</div>
            <div className="recent-points">Last 5 points (wip)</div>
        </>
    )
}