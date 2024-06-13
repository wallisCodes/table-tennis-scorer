import { useState } from 'react'
import './App.css'

function App() {
  const [playerOne, setPlayerOne] = useState({name: "John", score: 8, heartRate: 100, serving: true, games: 0});
  const [playerTwo, setPlayerTwo] = useState({name: "Gary", score: 6, heartRate: 100, serving: false, games: 1});
  const [format, setFormat] = useState("1");

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
      <div className="recent-points">Last 10 points (wip)</div>
    </>
  )
}

export default App