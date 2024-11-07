import Match from '../models/Match.js';

export const createMatch = async (req, res) => {
    try {
        const match = await Match.create(req.body);
        res.status(201).json(match);
    } catch (error) {
        res.status(400).json({ error: 'Error creating match' });
    }
};

export const getMatchById = async (req, res) => {
    try {
        const match = await Match.findByPk(req.params.matchId);
        res.status(200).json(match);
    } catch (error) {
        res.status(404).json({ error: 'Match not found' });
    }
};

export const updateMatch = async (req, res) => {
    try {
        const match = await Match.findByPk(req.params.matchId);
        if (match) {
            await match.update(req.body);
            res.status(200).json(match);
        } else {
            res.status(404).json({ error: 'Match not found' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error updating match' });
    }
  };
  
export const deleteMatch = async (req, res) => {
    try {
        const match = await Match.findByPk(req.params.matchId);
        if (match) {
            await match.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Match not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting match' });
    }
};