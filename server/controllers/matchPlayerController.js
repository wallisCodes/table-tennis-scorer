import MatchPlayer from '../models/MatchPlayer.js';
  
// Controller to bulk create (in practice will only be two) match-player records
export const createMatchPlayer = async (req, res) => {
    const matchPlayers = req.body; // Expecting an array of match-player objects
    try {
        const newMatchPlayers = await MatchPlayer.bulkCreate(matchPlayers);
        res.status(201).json(newMatchPlayers);
    } catch (error) {
        console.error('Error adding match-player records:', error);
        res.status(500).json({ error: 'Error adding match-player records' });
    }
};
  
// Controller to get all match-player records for a specific match
export const getMatchPlayerByMatch = async (req, res) => {
    const { matchId } = req.params;
    try {
        const matchPlayers = await MatchPlayer.findAll({ where: { matchId } });
        res.status(200).json(matchPlayers);
    } catch (error) {
        console.error('Error fetching match-player records:', error);
        res.status(500).json({ error: 'Error fetching match-player records' });
    }
};

// Controller to get all match-player records for a specific player
export const getMatchPlayerByPlayer = async (req, res) => {
    const { playerId } = req.params;
    try {
        const matchPlayers = await MatchPlayer.findAll({ where: { playerId } });
    
        if (matchPlayers.length === 0) {
            return res.status(404).json({ message: 'No match-player records found for the specified player' });
        }
        res.status(200).json(matchPlayers);
    } catch (error) {
        console.error('Error fetching match-player records by player:', error);
        res.status(500).json({ error: 'Error fetching match-player records by player' });
    }
}
  
// Controller to update a specific match-player record
export const updateMatchPlayer = async (req, res) => {
    const { id } = req.params;
    const { finalScore } = req.body; // Only finalScore is to be updated
    try {
        const matchPlayer = await MatchPlayer.findByPk(id);
        
        if (!matchPlayer) {
            return res.status(404).json({ error: 'Match-player record not found' });
        }
        matchPlayer.finalScore = finalScore;
        await matchPlayer.save();
        res.status(200).json(matchPlayer);

    } catch (error) {
        console.error('Error updating match-player record:', error);
        res.status(500).json({ error: 'Error updating match-player record' });
    }
};
  
// Controller to delete a specific match-player record
export const deleteMatchPlayer = async (req, res) => {
    const { id } = req.params;
    try {
        const rowsDeleted = await MatchPlayer.destroy({ where: { id } });

        if (rowsDeleted === 0) {
            return res.status(404).json({ error: 'Match-player record not found' });
        }
        res.status(200).json({ message: 'Match-player record deleted successfully' });
    } catch (error) {
        console.error('Error deleting match-player record:', error);
        res.status(500).json({ error: 'Error deleting match-player record' });
    }
};