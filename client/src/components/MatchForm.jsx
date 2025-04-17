import React, { useState } from "react";


export default function MatchForm({toScores}) {
    const sports = ["table-tennis", "badminton", "squash", "tennis"];

    const [selectedSport, setSelectedSport] = useState("table-tennis");
    const [players, setPlayers] = useState([]);
    const [formData, setFormData] = useState({ name: "", age: "", color: "#000000" });

    const handleAddPlayer = () => {
        if (!formData.name || !formData.age) return;
        setPlayers([...players, formData]);
        setFormData({ name: "", age: "", color: "#000000" });
    };

    const handleEdit = (index) => {
        const playerToEdit = players[index];
        setFormData(playerToEdit);
        setPlayers(players.filter((_, i) => i !== index));
    };

    const handleDelete = (index) => {
        setPlayers(players.filter((_, i) => i !== index));
    };

    const handleConfirm = () => {
        toScores();
    };

    return (
        <div className="container">
            <h1>Create Match</h1>

            <div className="section">
                <h2>Select a sport</h2>
                <div className="sport-options">
                    {sports.map((sport) => (
                        <div
                            key={sport}
                            className={`sport-item ${selectedSport === sport ? "selected" : ""}`}
                            onClick={() => setSelectedSport(sport)}
                        >
                        {sport}
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <h2>Add Players</h2>
                {players.length < 2 && (
                <div className="form">
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Age"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                    <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                    <button onClick={handleAddPlayer}>Add Player</button>
                </div>
                )}

                <ul className="player-list">
                {players.map((player, index) => (
                    <li key={index} style={{ borderLeft: `5px solid ${player.color}` }}>
                    <span>{player.name}, {player.age} years old</span>
                    <div className="player-actions">
                        <button onClick={() => handleEdit(index)}>Edit</button>
                        <button onClick={() => handleDelete(index)}>Delete</button>
                    </div>
                    </li>
                ))}
                </ul>
            </div>

            <button className="confirm" onClick={handleConfirm} disabled={players.length !== 2}>
                Confirm Match
            </button>
        </div>
    );
}