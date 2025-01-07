import { useState, useEffect } from "react";

export default function Dashboard({toResults, scoreHistory, heartRateOne}){
    // ==================== TESTING FETCH REQUESTS ====================
    const [nonGetRequestCount, setNonGetRequestCount] = useState(0);
    const [allPlayers, setAllPlayers] = useState([]);
    const [newPlayer, setNewPlayer] = useState({ name: "", age: "", colour: "" });
    const [playerIdToDelete, setPlayerIdToDelete] = useState("");
    const matchId = 1;
    const playerId = 1;

    const mockPlayersData = [
        {
            name: "Wallis",
            age: 28,
            colour: "#464646"
        },
        {
            name: "Lau",
            age: 56,
            colour: "#535353"
        }
    ];

    async function readPlayerData(){
        const url = "http://localhost:3000/api/players";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to read players: ${response.status}`);
            }
            const players = await response.json();           
            setAllPlayers(players);
            console.log("Players loaded successfully.");

        } catch (error) {
            console.error('Error:', error.message);
        }
    }


    async function createPlayer(){
        const url = "http://localhost:3000/api/players";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newPlayer)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to create player: ${response.status}`);
            }
            const player = await response.json();
            console.log(`JSON response: ${JSON.stringify(player)}`);
            console.log("Success! Player added to database.");
            
            setNonGetRequestCount(count => count + 1);
            setNewPlayer({ name: "", age: "", colour: "" }); // clear input

        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async function createPlayers(){
        // console.log("Function called: createPlayers()");
        const url = `http://localhost:3000/api/players/batch`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockPlayersData)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to create player batch records: ${response.status}`);
            }
            const batch = await response.json();
            setNonGetRequestCount(count => count + 1);
            console.log(`JSON response: ${JSON.stringify(batch)}`);
            console.log("Success! Player batch added to database.");

        } catch (error) {
            console.error('Error:', error.message);
        }
    }


    async function deleteSinglePlayer(){
        try {
            const response = await fetch(`http://localhost:3000/api/players/${playerIdToDelete}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to delete player: ${response.status}`);
            }

            console.log(`Player with ID ${playerIdToDelete} deleted successfully.`);
            setNonGetRequestCount(count => count + 1);
            setPlayerIdToDelete(""); // clear input
        } catch (error) {
            console.error('Error:', error.message);
        }
    }    


    async function deleteAllPlayers(){
        try {
            const response = await fetch('http://localhost:3000/api/players', {
                method: 'DELETE'
            });

            if (!response.ok) {
                console.log("response not OK");
                throw new Error(`Failed to delete all players: ${response.status}`);
            }

            console.log("Success! ALL players deleted from database.");
            setNonGetRequestCount(count => count + 1);
        } catch (error) {
            console.log("Error caught.");
            console.error('Error:', error.message);
        }
    }


    // Displays all players in database after latest GET
    function playersTable(players){
        // Display "Loading..."" before players have been requested
        if (!players.length) return <p>Loading...</p>;
      
        // Get table headers from keys of the first player object
        const columnNames = Object.keys(players[0]);
      
        return (
            <table className="players-table">
                <thead>
                    <tr>
                        {columnNames.map((column) => (
                            <th className="table-headers" key={column}>{column.charAt(0).toUpperCase() + column.slice(1)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {players.map((player) => (
                        <tr key={player.id}>
                        {columnNames.map((key) => (
                            <td className="table-data" key={key}>{player[key]}</td>
                        ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    // Re-render playersTable whenever a http request is triggered (excluding GET requests)
    useEffect(() => {
        readPlayerData();
    }, [nonGetRequestCount]);



    // ========================== MATCH TESTING ========================== //
    async function createMatch() {
        const mockMatchData = {
            sport: 'table-tennis',
            date: Math.floor(Date.now() / 1000), // Unix timestamp for the current date
            startTime: new Date().toLocaleTimeString('en-GB', { hour12: false }) // HH:mm:ss format
        };
      
        try {
            const response = await fetch('http://localhost:3000/api/matches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockMatchData)
            });
      
            if (response.ok) {
                const newMatch = await response.json();
                console.log('Match created:', newMatch);
            } else {
                console.error('Failed to create match');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    async function updateMatch() {
        const mockUpdatedData = {
            endTime: new Date().toLocaleTimeString('en-GB', { hour12: false }),
            matchDuration: 3600, // Example duration in seconds
            winnerId: 1 // Example player ID
        };
      
        try {
            const response = await fetch(`http://localhost:3000/api/matches/${matchId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockUpdatedData)
            });
        
            if (response.ok) {
                const updatedMatch = await response.json();
                console.log('Match updated:', updatedMatch);
            } else {
                console.error('Failed to update match');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }



    // ========================== SCORE HISTORY TESTING ========================== //
    async function createScoreHistory() {
        try {
            const response = await fetch(`http://localhost:3000/api/score-history/${matchId}/${playerId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scoreHistory[0])
            });
        
            if (!response.ok) {
                throw new Error(`Failed to create score history record: ${response.status}`);
            }
        
            console.log('Score history record created successfully.');
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
      
    async function createScoreHistoryBatch() {
        try {
            const response = await fetch(`http://localhost:3000/api/score-history/${matchId}/${playerId}/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scoreHistory)
            });
        
            if (!response.ok) {
                throw new Error(`Failed to create score history batch: ${response.status}`);
            }
        
            console.log('Score history batch created successfully.');
        } catch (error) {
            console.error('Error:', error.message);
        }
    }



    // ========================== HEART RATE TESTING ========================== //
    async function createHeartRate(){
        // console.log("Function called: createHeartRate()");
        const url = `http://localhost:3000/api/heart-rate/${matchId}/${playerId}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(heartRateOne[0]) // use first value for testing purposes
            });
            
            if (!response.ok) {
                throw new Error(`Failed to create heart rate record: ${response.status}`);
            }
            const singular = await response.json();
            console.log(`JSON response: ${JSON.stringify(singular)}`);
            console.log("Success! Singular HR record added to database.");
            
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    
    async function createHeartRateBatch(){
        console.log("Function called: createHeartRateBatch()");
        const url = `http://localhost:3000/api/heart-rate/${matchId}/${playerId}/batch`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(heartRateOne)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to create heart rate batch: ${response.status}`);
            }
            const batch = await response.json();
            console.log(`JSON response: ${JSON.stringify(batch)}`);
            console.log("Success! HR batch added to database.");

        } catch (error) {
            console.error('Error:', error.message);
        }
    }


    return (
        <div className="dashboard-container">
            {/* Back button */}
            <svg onClick={toResults} className="back-button"  width="48" height="48" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="m10.978 14.999v3.251c0 .412-.335.75-.752.75-.188 0-.375-.071-.518-.206-1.775-1.685-4.945-4.692-6.396-6.069-.2-.189-.312-.452-.312-.725 0-.274.112-.536.312-.725 1.451-1.377 4.621-4.385 6.396-6.068.143-.136.33-.207.518-.207.417 0 .752.337.752.75v3.251h9.02c.531 0 1.002.47 1.002 1v3.998c0 .53-.471 1-1.002 1z" fillRule="nonzero"/>
            </svg>            
            
            <h1 className="title-text">Backend Testing</h1>

            <div className="block-row-container">
                {/* Saving a player to the database */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">POST/ADD player</h3>
                    <div className="player-inputs">
                        <input
                            type="text"
                            placeholder="Name"
                            value={newPlayer.name}
                            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Age"
                            value={newPlayer.age}
                            onChange={(e) => setNewPlayer({ ...newPlayer, age: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Colour"
                            value={newPlayer.colour}
                            onChange={(e) => setNewPlayer({ ...newPlayer, colour: e.target.value })}
                        />
                    </div>
                    <button onClick={createPlayer} className="block-button">Add Player</button>
                </div>

                {/* Create two players */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">POST/ADD two players</h3>
                    <button onClick={createPlayers} className="block-button">Add TWO Players</button>
                </div>

                {/* Deleting specific player from the database */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">DELETE specific player</h3>
                    <input
                        type="text"
                        placeholder="Player ID"
                        value={playerIdToDelete}
                        onChange={(e) => setPlayerIdToDelete(e.target.value)}
                    />
                    <button onClick={deleteSinglePlayer} className="block-button">Delete Player</button>
                </div>

                {/* Deleting ALL players from the database */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">DELETE ALL players</h3>
                    <button onClick={deleteAllPlayers} className="block-button">Delete ALL Players</button>
                </div>
            </div>

            {/* Loading all players from the database */}
            <div className="dashboard-test-block">
                <h3 className="block-title">GET/RETRIEVE all players</h3>
                <button onClick={readPlayerData} className="block-button">Get Players</button>
                {playersTable(allPlayers)}
            </div>

            <div className="block-row-container">
                {/* Create match */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">POST/ADD match</h3>
                    <button onClick={createMatch} className="block-button">Add Match</button>
                </div>
            
                {/* Update match inside db */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">UPDATE match</h3>
                    <button onClick={() => updateMatch(matchId)} className="block-button">Update Match</button>
                </div>
            </div>

            <div className="block-row-container">
                {/* Create single score record from scoreHistory data */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">POST/ADD single score record</h3>
                    <button onClick={createScoreHistory} className="block-button">Add Score</button>
                </div>

                {/* Create multiple score records from scoreHistory data */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">POST/ADD score history batch</h3>
                    <button onClick={createScoreHistoryBatch} className="block-button">Add Score Batch</button>
                </div>
            </div>

            <div className="block-row-container">
                {/* Create single HR record from heartRateOne data */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">POST/ADD heart rate</h3>
                    <button onClick={createHeartRate} className="block-button">Add HR</button>
                </div>

                {/* Create batched HR record from heartRateOne data */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">POST/ADD heart rate batch</h3>
                    <button onClick={createHeartRateBatch} className="block-button">Add HR Batch</button>
                </div>
            </div>
        </div>
    )
}