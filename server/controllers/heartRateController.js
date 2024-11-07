import HeartRate from '../models/HeartRate.js';

export const addHeartRate = async (req, res) => {
    const { matchId, playerId } = req.params;
    const { time, value } = req.body;
    
    try {
        const newHeartRate = await HeartRate.create({
            matchId,
            playerId,
            time,
            value
        });
        res.status(201).json(newHeartRate);
    } catch (error) {
        res.status(400).json({ error: 'Error adding heart rate data' });
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