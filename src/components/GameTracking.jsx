import { useState } from 'react'

export default function GameTracking({playerOne, playerTwo}){

    return (
        <>
            <div className="players-container">
                <ul className="player-one">
                    <li className="player-name">{playerOne.name}</li>
                    <li className="player-score">{playerOne.score}</li>
                    <li className="player-heart-rate">{`${playerOne.heartRate} bpm`}</li>
                    <li className="player-serving">{playerOne.serving ? "Serving" : ""}</li>
                </ul>
                <ul className="player-two">
                    <li className="player-name">{playerTwo.name}</li>
                    <li className="player-score">{playerTwo.score}</li>
                    <li className="player-heart-rate">{`${playerTwo.heartRate} bpm`}</li>
                    <li className="player-serving">{playerTwo.serving ? "Serving" : ""}</li>
                </ul>
            </div>
            <div className="match-progress">{`${playerOne.games} - ${playerTwo.games}`}</div>
            <div className="recent-points">Last 5 points (wip)</div>
        </>
    )
}