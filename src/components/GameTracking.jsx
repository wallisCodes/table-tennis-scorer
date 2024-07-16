export default function GameTracking({playerOne, incrementP1Score, playerTwo, p1HeartRate, p2HeartRate}){
    return (
        <>
            <div className="players-container">
                <ul className="player-one">
                    <li className="player-name">{playerOne.name}</li>
                    <li className="player-score">
                        {/* <button onClick={incrementP1Score}>+</button> */}
                        {playerOne.score}
                        {/* <button onClick={decrementP1Score}>-</button> */}
                    </li>
                    <li className="player-heart-rate">{`${p1HeartRate} bpm`}</li>
                    <li className="player-serving">{playerOne.serving ? "Serving" : ""}</li>
                </ul>
                <ul className="player-two">
                    <li className="player-name">{playerTwo.name}</li>
                    <li className="player-score">
                        {/* <button onClick={incrementP2Score}>+</button> */}
                        {playerTwo.score}
                        {/* <button onClick={decrementP2Score}>-</button> */}
                    </li>
                    <li className="player-heart-rate">{`${p2HeartRate} bpm`}</li>
                    <li className="player-serving">{playerTwo.serving ? "Serving" : ""}</li>
                </ul>
            </div>
            <div className="match-progress">{`${playerOne.games} - ${playerTwo.games}`}</div>
            <div className="recent-points">Last 5 points (wip)</div>
        </>
    )
}