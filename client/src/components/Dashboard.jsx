import { useState, useEffect } from "react";

export default function Dashboard({toResults, scoreHistory, heartRateOne}){
    // ==================== TESTING FETCH REQUESTS ====================
    const [nonGetRequestCount, setNonGetRequestCount] = useState(0);
    const [allPlayers, setAllPlayers] = useState([]);
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
        try {
            const response = await fetch("http://localhost:3000/api/players");

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

    async function createPlayers(){
        try {
            const response = await fetch("http://localhost:3000/api/players", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockPlayersData)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to create player batch records: ${response.status}`);
            }
            const batch = await response.json();
            setNonGetRequestCount(count => count + 1);
            console.log("Success! Player batch added to database", batch);

            // Retrieve player ids to be used in future api calls
            const playerIds = batch.map(player => player.id);
            console.log("Player ids:", playerIds);

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
            const response = await fetch("http://localhost:3000/api/players", {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete all players: ${response.status}`);
            }

            console.log("Success! ALL players deleted from database.");
            setNonGetRequestCount(count => count + 1);
        } catch (error) {
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
            const response = await fetch("http://localhost:3000/api/matches", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockMatchData)
            });
      
            if (!response.ok) {
                throw new Error(`Failed to create match: ${response.status}`);
            }

            const newMatch = await response.json();
            console.log('Match created:', newMatch);

            const matchId = newMatch.id;
            console.log("Match id:", matchId);
            console.log("Testing console log works inside ceateMatch() function.");
            return matchId;

        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async function getAllMatches(){
        try {
            const response = await fetch("http://localhost:3000/api/matches");

            if (!response.ok) {
                throw new Error(`Failed to retrieve matches: ${response.status}`);
            }

            const matches = await response.json();
            console.log('Matches retrieved successfully:', matches);
        } catch (error) {
            console.error('Error:', error.message);
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
        
            if (!response.ok) {
                throw new Error(`Failed to update match: ${response.status}`);
            }

            const updatedMatch = await response.json();
            console.log('Match updated:', updatedMatch);

        } catch (error) {
            console.error('Error:', error.message);
        }
    }



    // ========================== MATCH PLAYER TESTING ========================== //
    async function createMatchPlayers() {
        const mockMatchPlayerData = [
            {
                matchId: 1,
                playerId: 1,
                finalScore: null
            },
            {
                matchId: 1,
                playerId: 2,
                finalScore: null
            }
        ];

        try {
            const response = await fetch("http://localhost:3000/api/match-player", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockMatchPlayerData),
            });
        
            if (!response.ok) {
                throw new Error(`Failed to create match player record: ${response.status}`);
            }
            const data = await response.json();
            console.log('Match player record created successfully', data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }


    async function getPlayersByMatch(){
        try {
            const response = await fetch(`http://localhost:3000/api/match-player/${matchId}`);

            if (!response.ok) {
                throw new Error(`Failed to retrieve match player records for specific match: ${response.status}`);
            }
            const data = await response.json();
            console.log('Specific match players retrieved successfully', data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }


    async function getMatchesByPlayer(){
        try {
            const response = await fetch(`http://localhost:3000/api/match-player/player/${playerId}`);

            if (!response.ok) {
                throw new Error(`Failed to retrieve match player records for specific player: ${response.status}`);
            }
            const data = await response.json();
            console.log('Specific player matches retrieved successfully', data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }


    async function updateMatchPlayer (){
        const matchPlayerId = 1;
        const mockFinalScore = 20;
        try {
            const response = await fetch(`http://localhost:3000/api/match-player/${matchPlayerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ finalScore: mockFinalScore })
            });

            if (!response.ok) {
                throw new Error(`Failed to retrieve match player records for specific player: ${response.status}`);
            }
            const data = await response.json();
            console.log('Match player record updated successfully', data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }


    // ========================== SCORE HISTORY TESTING ========================== //  
    async function createScoreHistory() {
        try {
            const response = await fetch(`http://localhost:3000/api/score-history/${matchId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scoreHistory)
            });
        
            if (!response.ok) {
                throw new Error(`Failed to create score history batch: ${response.status}`);
            }
            const scoreBatch = await response.json();
            console.log("Score history batch created successfully:", scoreBatch);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    
    
    async function getScoreHistory(){
        try {
            const response = await fetch(`http://localhost:3000/api/score-history/${matchId}`);
    
            if (!response.ok) {
                throw new Error(`Failed to retrieve score history records for specific match: ${response.status}`);
            }
            const scoreData = await response.json();
            console.log('Score history retrieved successfully', scoreData);
    
        } catch (error) {
            console.error('Error:', error.message);
        }
    }


    // ========================== HEART RATE TESTING ========================== //    
    async function createHeartRate(){
        try {
            const response = await fetch(`http://localhost:3000/api/heart-rate/${matchId}/${playerId}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(heartRateOne)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to create heart rate batch: ${response.status}`);
            }
            const batch = await response.json();
            console.log("Success! HR batch added to database:", batch);

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

            {/* Retrieving all players from the database */}
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

                {/* Retrieving all matches from the database */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">GET ALL matches</h3>
                    <button onClick={getAllMatches} className="block-button">Get Matches</button>
                </div>
            
                {/* Update match inside db */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">UPDATE match</h3>
                    <button onClick={() => updateMatch(matchId)} className="block-button">Update Match</button>
                </div>
            </div>

            <div className="block-row-container">
                {/* Create match player */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">POST/ADD match_player</h3>
                    <button onClick={createMatchPlayers} className="block-button">Add MatchPlayer</button>
                </div>

                {/* Retrieving match-player records for a specific match */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">GET match_player (specific match)</h3>
                    <button onClick={getPlayersByMatch} className="block-button">Get MatchPlayer Players</button>
                </div>

                {/* Retrieving match-player records for a specific player */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">GET match_player (specific player)</h3>
                    <button onClick={getMatchesByPlayer} className="block-button">Get MatchPlayer Matches</button>
                </div>

                {/* Updating specific match-player record */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">UPDATE match_player</h3>
                    <button onClick={updateMatchPlayer} className="block-button">Update MatchPlayer</button>
                </div>
            </div>

            <div className="block-row-container">
                {/* Create single score record from scoreHistory data */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">POST/ADD score batch</h3>
                    <button onClick={createScoreHistory} className="block-button">Add Score Batch</button>
                </div>

                {/* Retrieving scoreHistory data */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">GET score history</h3>
                    <button onClick={getScoreHistory} className="block-button">Get Score Batch</button>
                </div>
            </div>

            <div className="block-row-container">
                {/* Create batched HR record from heartRateOne data */}
                <div className="dashboard-test-block">
                    <h3 className="block-title">POST/ADD heart rate batch</h3>
                    <button onClick={createHeartRate} className="block-button">Add HR Batch</button>
                </div>
            </div>
        </div>
    )
}