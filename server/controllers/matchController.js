import Match from '../models/Match.js';

export const createMatch = async (req, res) => {
    const { sport, date, startTime } = req.body;
    try {
        const match = await Match.create({
            sport,
            date,
            startTime
        });
        res.status(201).json(match);
    } catch (error) {
        res.status(500).json({ error: 'Error creating match' });
    }
};

export const getAllMatches = async (req, res) => {
    try {
        const matches = await Match.findAll();
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching matches' });
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
    const { matchId } = req.params;
    const { endTime, matchDuration, winnerId } = req.body;
    try {
        const match = await Match.findByPk(matchId);
        
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }
    
        // Update only the provided fields
        if (endTime) match.endTime = endTime;
        if (matchDuration) match.matchDuration = matchDuration;
        if (winnerId) match.winnerId = winnerId;
    
        await match.save(); // Save the updated match
        res.status(200).json(match);

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