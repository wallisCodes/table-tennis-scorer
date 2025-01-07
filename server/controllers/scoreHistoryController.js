import ScoreHistory from '../models/ScoreHistory.js';

export const addScoreEvent = async (req, res) => {
    const { matchId, playerId } = req.params;
    const { time, winner } = req.body;
    
    try {
        const newScoreEvent = await ScoreHistory.create({
            matchId,
            playerId,
            time,
            winner
        });
        res.status(201).json(newScoreEvent);
    } catch (error) {
        res.status(400).json({ error: 'Error adding score event' });
    }
};

export const addScoreEventBatch = async (req, res) => {
    const { matchId, playerId } = req.params;
    const scoreEvents = req.body; // Expecting an array of score events
  
    try {
        const records = scoreEvents.map((event) => ({
            ...event,
            matchId,
            playerId
        }));
    
        // Use bulkCreate to insert multiple records at once
        await ScoreHistory.bulkCreate(records);
        res.status(201).json({ message: 'Score event batch added successfully' });
    } catch (error) {
        console.error('Error adding score event batch:', error);
        res.status(500).json({ error: 'Error adding score event batch' });
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