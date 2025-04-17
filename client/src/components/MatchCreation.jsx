import { useState } from 'react';
import { createPlayers } from "../api";
import badmintonImg from '../images/badminton.png';
import squashImg from '../images/squash.png';
import tableTennisImg from '../images/table-tennis.png';

export default function MatchCreation({players, setPlayers, playerIdsRef, matchDetails, setMatchDetails, toScores}){
    const sportChoices = ["table-tennis", "badminton", "squash"];
    const sportChoicesText = ["Table Tennis", "Badminton", "Squash"]; 
    const sportImages = [tableTennisImg, badmintonImg, squashImg];

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [colour, setColour] = useState("#000000");

    //Testing
    const [playerData, setPlayerData] = useState({ name: "", age: "", colour: "#000000" });

    function addPlayer(){
        // Check inputs aren't empty
        if (!name || !age){
            alert("Please ensure there are no empty fields.");
        } else {
            setPlayers([
                ...players,
                {
                    name,
                    age,
                    colour,
                    points: 0
                }
            ]);

            // Resetting form inputs after adding player
            setName("");
            setAge("");
            setColour("#000000");
        }
    }


    const editPlayer = (index) => {
        const playerToEdit = players[index];
        setPlayerData(playerToEdit);
        setPlayers(players.filter((_, i) => i !== index));
    };

    const handleDelete = (index) => {
        setPlayers(players.filter((_, i) => i !== index));
    };




    async function startMatch(){
        // Check sport selected and correct number of players have been added
        if (!matchDetails.sport){
            alert("Please select a sport.");
        } else if (players.length !== 2) {
            alert("Please ensure you have exactly two players added.");
        } else {
            playerIdsRef.current = await createPlayers(players);
            toScores();
        }
    }


    return (
        <div className="input-container">
            {/* Sport Selection section */}
            <div className="input-group">
                <h1>Sport Selection</h1>
                <div className="sport-options">
                    {sportChoices.map((sport, index) => (
                        <div
                            key={sport}
                            className={`sport-item ${matchDetails.sport === sport ? "selected" : ""}`}
                            onClick={() => setMatchDetails({
                                ...matchDetails,
                                sport
                            })}
                        >
                            <img src={sportImages[index]} alt={`${sport} image`}/>
                            <p>{sportChoicesText[index]}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Player Selection section */}
            <h1>Player Selection</h1>
            <div className="player-selection">
                {/* Player inputs + add player button */}
                <div className="input-group">
                    <div className="player-inputs">
                        <div className="label-input-group">
                            <label htmlFor="player-name" className="">Name</label>
                            <input 
                                type="text"
                                id="player-name"
                                placeholder="Enter Name"
                                onChange={e => setName(e.target.value)}
                                value={name}
                                className="text-input"
                                required
                            />
                        </div>
                        <div className="label-input-group">
                            <label htmlFor="player-age" className="">Age</label>
                            <input 
                                type="number"
                                id="player-age"
                                placeholder="Enter Age"
                                onChange={e => setAge(e.target.value)}
                                value={age}
                                className="number-input"
                                required
                            />
                        </div>
                        <div className="label-input-group">
                            <label htmlFor="player-colour" className="">Colour</label>
                            <input 
                                type="color"
                                id="player-colour"
                                onChange={e => setColour(e.target.value)}
                                value={colour}
                                className="colour-input"
                                required
                            />
                        </div>
                        <button onClick={addPlayer} disabled={players.length >= 2} className="add-player-button">Add Player</button>
                    </div>
                </div>

                {/* Player list display */}
                { players.length === 0 ? 
                    <p className="player-list-info">Added players will be displayed here!</p>
                    :
                    <ul className="player-list">
                        {players.map((player, index) => (
                            <li key={index} className="player-group">
                                <div className="player-text-colour">
                                    <span>{player.name} ({player.age})</span>
                                    <div style={{backgroundColor: player.colour}} className="colour-box"></div>
                                </div>
                                <div className="player-actions">
                                    <button onClick={() => editPlayer(index)} className="player-action-button">Edit</button>
                                    <button onClick={() => deletePlayer(index)} className="player-action-button">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                }
            </div>
            
            {/* Button to initiate match */}
            <button onClick={startMatch} className="match-start-button">Start Match</button>
        </div>
    )
}