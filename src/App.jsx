import { useState } from 'react'
import GeneralForm from './components/GeneralForm';
import GameTracking from './components/GameTracking';
import { v4 as uuidv4 } from "uuid"

uuidv4();

export default function App(){
    const [sport, setSport] = useState(""); //
    const [matchType, setMatchType] = useState("singles");
    const [bestOf, setBestOf] = useState("1");
    const [playerOne, setPlayerOne] = useState({name: "John", score: 8, heartRate: 100, serving: true, games: 0});
    const [playerTwo, setPlayerTwo] = useState({name: "Gary", score: 6, heartRate: 100, serving: false, games: 1});
    const [players, setPlayers] = useState([]);
    const [score, setScore] = useState();

    function addPlayer(name, age, colour){
        setPlayers([
            ...players,
            {
                id: uuidv4(),
                name: name,
                age: age,
                colour: colour
            }
        ]);
    }

    return (
        <>
            <GeneralForm 
                sport={sport}
                setSport={setSport}
                matchType={matchType}
                setMatchType={setMatchType}
                bestOf={bestOf}
                setBestOf={setBestOf}
                addPlayer={addPlayer}
            />
            <GameTracking 
                playerOne={playerOne}
                playerTwo={playerTwo}
            />
        </>
    )
}