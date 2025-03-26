import Player from "../models/Player.js";

export const createPlayers = async (req, res) => {
    const players = req.body; // Expecting an array of player objects
    try {
        // Use bulkCreate to insert multiple players
        const newPlayers = await Player.bulkCreate(players);
        res.status(201).json(newPlayers);
    } catch (error) {
        console.error("Error adding players:", error);
        res.status(500).json({ error: "Error adding players" });
    }
};

export const getAllPlayers = async (req, res) => {
    try {
        const players = await Player.findAll();
        res.status(200).json(players);
    } catch (error) {
        console.error("Error fetching players", error);
        res.status(500).json({ error: "Error fetching players" });
    }
};

export const getPlayerById = async (req, res) => {
    try {
        const player = await Player.findByPk(req.params.playerId);
        if (player) {
            res.status(200).json(player);
        } else {
            res.status(404).json({ error: "Player not found" });
        }
    } catch (error) {
        console.error("Error fetching player", error);
        res.status(500).json({ error: "Error fetching player" });
    }
};

export const updatePlayer = async (req, res) => {
    try {
        const player = await Player.findByPk(req.params.playerId);
        if (player) {
            await player.update(req.body);
            res.status(200).json(player);
        } else {
            res.status(404).json({ error: "Player not found" });
        }
    } catch (error) {
        console.error("Error updating player", error);
        res.status(400).json({ error: "Error updating player" });
    }
};

export const deletePlayer = async (req, res) => {
    try {
        const player = await Player.findByPk(req.params.playerId);
        if (player) {
            await player.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Player not found" });
        }
    } catch (error) {
        console.error("Error deleting player", error);
        res.status(500).json({ error: "Error deleting player" });
    }
};

export const deleteAllPlayers = async (req, res) => {
    try {
        await Player.destroy({ where: {} }); // Deletes all entries in the table
        res.status(200).json({ message: "All players deleted" });
    } catch (error) {
        console.error("Error deleting all players", error);
        res.status(500).json({ error: "Error deleting all players" });
    }
};