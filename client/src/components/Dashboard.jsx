import { useState, useEffect } from "react";

export default function Dashboard({toResults, heartRateOne}){
    // ==================== TESTING FETCH REQUESTS ====================
    const [nonGetRequestCount, setNonGetRequestCount] = useState(0);
    const [allPlayers, setAllPlayers] = useState([]);
    const [newPlayer, setNewPlayer] = useState({ name: "", age: "", colour: "" });
    const [playerIdToDelete, setPlayerIdToDelete] = useState("");


    async function readPlayerData(){
        const url = "http://localhost:3000/api/players";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const players = await response.json();           
            setAllPlayers(players);
            console.log("Players loaded successfully.");

        } catch (error) {
            console.error(error.message);
        }
    }


    async function createPlayer(){
        const url = "http://localhost:3000/api/players"
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(newPlayer),
                headers: myHeaders,
            });
            
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const player = await response.json();
            console.log(`JSON response: ${JSON.stringify(player)}`);
            console.log("Success! Player added to database.");
            
            setNonGetRequestCount(count => count + 1);
            setNewPlayer({ name: "", age: "", colour: "" }); // clear input

        } catch (error) {
            console.error(error.message);
        }
    }


    async function deleteSinglePlayer(){
        try {
            await fetch(`http://localhost:3000/api/players/${playerIdToDelete}`, {
                method: 'DELETE',
            });
            
            console.log("Success! Player deleted from database.");
            setNonGetRequestCount(count => count + 1);
            setPlayerIdToDelete(""); // clear input
        } catch (error) {
            console.error('Error deleting player:', error);
        }
    }    


    async function deleteAllPlayers(){
        try {
            await fetch('http://localhost:3000/api/players', {
                method: 'DELETE',
            });
            // setAllPlayers([]); // clear the players list
            console.log("Success! ALL players deleted from database.");
            setNonGetRequestCount(count => count + 1);
        } catch (error) {
            console.error('Error deleting all players:', error);
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

    // Goal: rerun playersTable whenever
    useEffect(() => {
        readPlayerData();
    }, [nonGetRequestCount]);


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
        </div>
    )
}