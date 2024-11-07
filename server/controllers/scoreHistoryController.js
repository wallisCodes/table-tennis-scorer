import ScoreHistory from '../models/ScoreHistory.js';

export const addScoreEvent = async (req, res) => {
    const { matchId } = req.params;
    const { playerId, scoreEvent, timestamp } = req.body;
    
    try {
        const newScoreEvent = await ScoreHistory.create({
            matchId,
            playerId,
            scoreEvent,
            timestamp
        });
        res.status(201).json(newScoreEvent);
    } catch (error) {
        res.status(400).json({ error: 'Error adding score event' });
    }
};

export const getScoreHistory = async (req, res) => {
    const { matchId } = req.params;
    
    try {
        const scoreHistory = await ScoreHistory.findAll({ where: { matchId } });
        res.status(200).json(scoreHistory);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching score history' });
    }
};