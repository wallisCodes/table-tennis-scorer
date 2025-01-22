import ScoreHistory from '../models/ScoreHistory.js';

export const createScoringBatch = async (req, res) => {
    const { matchId } = req.params;
    const scoreEvents = req.body; // Expecting an array of score events
  
    try {
        const records = scoreEvents.map((event) => ({
            ...event,
            matchId
        }));
    
        // Use bulkCreate to insert multiple records at once
        await ScoreHistory.bulkCreate(records);
        res.status(201).json(records);
    } catch (error) {
        res.status(500).json({ error: 'Error adding score event batch' });
    }
};

// Retrieve score history for a particular match
export const getScoreHistory = async (req, res) => {
    const { matchId } = req.params;
    
    try {
        const scoreHistory = await ScoreHistory.findAll({ where: { matchId } });
        res.status(200).json(scoreHistory);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching score history' });
    }
};