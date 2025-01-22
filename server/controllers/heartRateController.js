import HeartRate from '../models/HeartRate.js';

export const createHeartRateBatch = async (req, res) => {
    const { matchId, playerId } = req.params;
    const heartRates = req.body; // Expect an array of { time, value }
  
    try {
        const records = heartRates.map((hr) => ({
            ...hr,
            matchId,
            playerId,
        }));
        
        await HeartRate.bulkCreate(records);
        res.status(201).json(records);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save heart rate batch data' });
    }
};

export const getHeartRateByPlayer = async (req, res) => {
    const { matchId, playerId } = req.params;
    
    try {
        const heartRates = await HeartRate.findAll({
            where: { matchId, playerId }
        });
        res.status(200).json(heartRates);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching heart rate data' });
    }
};