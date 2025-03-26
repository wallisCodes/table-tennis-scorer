// ========================== USER FETCH REQUESTS ========================== //
export async function registerUser(email, password) {
    try {
        const response = await fetch("http://localhost:3000/api/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include" // Allows cookies to be sent with the request
        });
        
        if (!response.ok) {
            throw new Error(`Failed to register user: ${response.status}`);
        }
        console.log("User registered successfully!");

        const newUser = await response.json();
        console.log("newUser:", newUser);
        return newUser.id;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}


export async function loginUser(email, password) {
    try {
        const response = await fetch("http://localhost:3000/api/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include" // Allows cookies to be sent with the request
        });
        
        if (!response.ok) {
            throw new Error(`Failed to login user: ${response.status}`);
        }
        console.log("User logged in successfully!");

        const existingUser = await response.json();
        console.log("existingUser:", existingUser);
        return existingUser;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}


export async function logoutUser() {
    try {
        const response = await fetch("http://localhost:3000/api/user/logout", {
            method: "POST",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to logout");
        }

        console.log("User logged out successfully!");
        return true;

    } catch (error) {
        console.error("Error logging out:", error.message);
        return false;
    }
}


// Function to auto-authenticate users when refreshing page
export async function verifyToken(){
    try {
        const response = await fetch("http://localhost:3000/api/user/verifyToken", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Failed to verify token: ${response.status}`);
        }
        const user = await response.json();
        return user;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}


// ========================== PLAYER FETCH REQUESTS ========================== //
export async function createPlayers(playerData){
    try {
        const response = await fetch("http://localhost:3000/api/players", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playerData)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create player batch records: ${response.status}`);
        }
        const batch = await response.json();
        console.log("Success! Player batch added to database", batch);

        // Retrieve player ids to be used in future api calls
        const playerIds = batch.map(player => player.id);
        console.log("Player ids:", playerIds);
        return playerIds;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}


export async function getAllPlayers(){
    try {
        const response = await fetch("http://localhost:3000/api/players");

        if (!response.ok) {
            throw new Error(`Failed to retrieve players: ${response.status}`);
        }
        const players = await response.json();
        console.log("Players loaded successfully.");
        return players;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}


export async function getPlayerById(playerId){
    try {
        const response = await fetch(`http://localhost:3000/api/players/${playerId}`);

        if (!response.ok) {
            throw new Error(`Failed to retrieve specific player: ${response.status}`);
        }
        const player = await response.json();
        console.log("Individual player loaded successfully.");
        return player;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}


export async function deleteSinglePlayer(playerId){
    try {
        const response = await fetch(`http://localhost:3000/api/players/${playerId}`, {
            method: "DELETE"
        });
        
        if (!response.ok) {
            throw new Error(`Failed to delete player: ${response.status}`);
        }
        console.log(`Player with ID ${playerIdToDelete} deleted successfully.`);

    } catch (error) {
        console.error("Error:", error.message);
    }
}    


export async function deleteAllPlayers(){
    try {
        const response = await fetch("http://localhost:3000/api/players", {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Failed to delete all players: ${response.status}`);
        }
        console.log("Success! ALL players deleted from database.");

    } catch (error) {
        console.error("Error:", error.message);
    }
}


// ========================== MATCH FETCH REQUESTS ========================== //
export async function createMatch(matchData){ 
    try {
        const response = await fetch("http://localhost:3000/api/match", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(matchData),
            credentials: "include"
        });
  
        const newMatch = await response.json();
        
        if (!response.ok) {
            console.error("Failed response body:", newMatch);
            throw new Error(`Failed to create match: ${response.status}`);
        }
        console.log("Match created:", newMatch);
        
        // Retrieve match id to be used in future api calls
        console.log("Match id:", newMatch.id);
        return newMatch.id;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}


export async function claimMatch(matchId, userId) {
    try {
        const response = await fetch(`http://localhost:3000/api/match/${matchId}/claim`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Failed to claim match: ${response.status}`);
        }
        const claimedMatch = await response.json();
        console.log("Claimed match successfully:", claimedMatch);
        return claimedMatch;

    } catch (error) {
        console.error("Error claiming match:", error);
        return null;
    }
}


export async function getAllMatches(){
    try {
        const response = await fetch("http://localhost:3000/api/match", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Failed to retrieve matches: ${response.status}`);
        }
        const matches = await response.json();
        console.log("Matches retrieved successfully:", matches);
        return matches;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}


export async function updateMatch(matchId, updateData){  
    try {
        const response = await fetch(`http://localhost:3000/api/match/${matchId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData)
        });
    
        if (!response.ok) {
            throw new Error(`Failed to update match: ${response.status}`);
        }
        const updatedMatch = await response.json();
        console.log("Match updated:", updatedMatch);
        return updatedMatch;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}



// ========================== MATCH-PLAYER FETCH REQUESTS ========================== //
export async function createMatchPlayers(playerIds, matchId){
    // Creating match-player records from player ids and match id
    const matchPlayers = [
        {
            matchId,
            playerId: playerIds[0],
            finalScore: null
        },
        {
            matchId,
            playerId: playerIds[1],
            finalScore: null
        }
    ];

    try {
        const response = await fetch("http://localhost:3000/api/match-player", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(matchPlayers),
        });
    
        if (!response.ok) {
            throw new Error(`Failed to create match player records: ${response.status}`);
        }
        const matchPlayerData = await response.json();
        console.log("Match player records created successfully", matchPlayerData);

        // Retrieve matchPlayer id to be used in future api calls
        const matchPlayerIds = matchPlayerData.map(matchPlayer => matchPlayer.id);
        console.log("Match player ids:", matchPlayerIds);
        return matchPlayerIds;

    } catch (error) {
        console.error("Error:", error.message);
    }
}


export async function getPlayersByMatch(matchId){
    try {
        const response = await fetch(`http://localhost:3000/api/match-player/${matchId}`);

        if (!response.ok) {
            throw new Error(`Failed to retrieve match player records for specific match: ${response.status}`);
        }
        const playerData = await response.json();
        console.log("Specific match players retrieved successfully", playerData);
        return playerData;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}


export async function getMatchesByPlayer(playerId){
    try {
        const response = await fetch(`http://localhost:3000/api/match-player/player/${playerId}`);

        if (!response.ok) {
            throw new Error(`Failed to retrieve match player records for specific player: ${response.status}`);
        }
        const matchData = await response.json();
        console.log("Specific player matches retrieved successfully", matchData);
        return matchData;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}

export async function updateMatchPlayer(matchPlayerId, playerScore){
    try {
        const response = await fetch(`http://localhost:3000/api/match-player/${matchPlayerId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playerScore)
        });

        if (!response.ok) {
            throw new Error(`Failed to update match player records for specific player: ${response.status}`);
        }
        const matchPlayerData = await response.json();
        console.log("Match player record updated successfully", matchPlayerData);
        return matchPlayerData;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}


// ========================== SCORE HISTORY FETCH REQUESTS ========================== //  
export async function createScoreHistory(matchId, scoreHistoryData){
    try {
        const response = await fetch(`http://localhost:3000/api/score-history/${matchId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(scoreHistoryData)
        });
    
        if (!response.ok) {
            throw new Error(`Failed to create score history batch: ${response.status}`);
        }
        const scoreBatch = await response.json();
        console.log("Score history batch created successfully:", scoreBatch);
        return scoreBatch;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}


export async function getScoreHistory(matchId){
    try {
        const response = await fetch(`http://localhost:3000/api/score-history/${matchId}`);

        if (!response.ok) {
            throw new Error(`Failed to retrieve score history records for specific match: ${response.status}`);
        }
        const scoreData = await response.json();
        console.log("Score history retrieved successfully", scoreData);
        return scoreData;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}


// ========================== HEART RATE FETCH REQUESTS ========================== //    
export async function createHeartRate(matchId, playerId, heartRateData){
    try {
        const response = await fetch(`http://localhost:3000/api/heart-rate/${matchId}/${playerId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(heartRateData)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create heart rate batch: ${response.status}`);
        }
        const batch = await response.json();
        console.log("Success! HR batch added to database:", batch);
        // return batch;

    } catch (error) {
        console.error("Error:", error.message);
    }
}


export async function getHeartRate(matchId, playerId){
    try {
        const response = await fetch(`http://localhost:3000/api/heart-rate/${matchId}/${playerId}`);

        if (!response.ok) {
            throw new Error(`Failed to retrieve heart rate records for specific player: ${response.status}`);
        }
        const heartRateData = await response.json();
        console.log("Heart rate data retrieved successfully", heartRateData);
        return heartRateData;

    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}