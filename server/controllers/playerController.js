import Player from '../models/Player.js';

export const createPlayer = async (req, res) => {
    try {
        const player = await Player.create(req.body);
        res.status(201).json(player);
    } catch (error) {
        res.status(400).json({ error: 'Error creating player' });
    }
};

export const getPlayerById = async (req, res) => {
    try {
        const player = await Player.findByPk(req.params.playerId);
        if (player) {
            res.status(200).json(player);
        } else {
            res.status(404).json({ error: 'Player not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching player' });
    }
};

export const updatePlayer = async (req, res) => {
    try {
        const player = await Player.findByPk(req.params.playerId);
        if (player) {
            await player.update(req.body);
            res.status(200).json(player);
        } else {
            res.status(404).json({ error: 'Player not found' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error updating player' });
    }
};

export const deletePlayer = async (req, res) => {
    try {
        const player = await Player.findByPk(req.params.playerId);
        if (player) {
            await player.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Player not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting player' });
    }
};