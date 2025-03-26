import jwt from "jsonwebtoken";
import Match from "../models/Match.js";

export const createMatch = async (req, res) => {
    const { sport, date, startTime } = req.body;
    let userId = null; // Default to null for anonymous users

    // console.log("Incoming Request:", req.method, req.path);
    // console.log("Request Headers:", req.headers);
    // console.log("Request Cookies:", req.cookies);

    // Check if the request contains a token
    if (req.cookies?.token) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            userId = decoded.userId; // Assign userId if authenticated
            console.log("Token Valid. User ID:", userId);
        } catch (error) {
            console.warn("Invalid token, proceeding as anonymous user:", error.message);
        }
    } else {
        console.log("No token found, creating match as anonymous user.");
    }
    console.log("Attempting to create match with userId:", userId);
    
    try {
        const match = await Match.create({
            sport,
            date,
            startTime,
            userId // Saves userId if logged in, otherwise stays null
        });

        console.log("Match Created:", match);
        res.status(201).json(match);
    } catch (error) {
        console.error("Error creating match:", error);
        res.status(500).json({ error: "Error creating match" });
    }
};

export const claimMatch = async (req, res) => {
    try {
        const { matchId } = req.params;
        const { userId } = req.body;

        console.log(`Attempting to claim match ${matchId} for user ${userId}`);
        const match = await Match.findByPk(matchId);

        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }

        if (match.userId) {
            return res.status(400).json({ error: "Match already belongs to a user" });
        }

        match.userId = userId;
        await match.save();

        console.log("Match successfully claimed:", match);
        res.status(200).json(match);
    } catch (error) {
        console.error("Error claiming match:", error);
        res.status(500).json({ error: "Error claiming match" });
    }
};

export const getAllMatches = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorised (no token provided)" });
        }

        const userId = req.user.userId; // Extract user ID from JWT
        const matches = await Match.findAll({ where: { userId } }); // Fetch only this user's matches
        res.status(200).json(matches);

    } catch (error) {
        console.error("Error fetching matches:", error);
        res.status(500).json({ message: "Error fetching matches" });
    }
};


export const getMatchById = async (req, res) => {
    try {
        const match = await Match.findByPk(req.params.matchId);
        res.status(200).json(match);

    } catch (error) {
        console.error("Match not found:", error);
        res.status(404).json({ error: "Match not found" });
    }
};

export const updateMatch = async (req, res) => {
    const { matchId } = req.params;
    const { endTime, matchDuration, winnerId } = req.body;
    try {
        const match = await Match.findByPk(matchId);
        
        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }
    
        // Update only the provided fields
        if (endTime) match.endTime = endTime;
        if (matchDuration) match.matchDuration = matchDuration;
        if (winnerId) match.winnerId = winnerId;
    
        await match.save(); // Save the updated match
        res.status(200).json(match);

    } catch (error) {
        console.error("Error updating match:", error);
        res.status(400).json({ error: "Error updating match" });
    }
};
  
export const deleteMatch = async (req, res) => {
    try {
        const match = await Match.findByPk(req.params.matchId);
        if (match) {
            await match.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Match not found" });
        }
    } catch (error) {
        console.error("Error deleting match:", error);
        res.status(500).json({ error: "Error deleting match" });
    }
};