import ScoreHistory from "../models/ScoreHistory.js";

export const createScoreHistory = async (req, res) => {
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
        console.error("Error adding score history", error);
        res.status(500).json({ error: "Error adding score history" });
    }
};

export const getScoreHistory = async (req, res) => {
    const { matchId } = req.params;
    
    try {
        const scoreHistory = await ScoreHistory.findAll({ where: { matchId } });
        res.status(200).json(scoreHistory);
    } catch (error) {
        console.error("Error fetching score history", error);
        res.status(500).json({ error: "Error fetching score history" });
    }
};

export const deleteScoreHistory = async (req, res) => {
    const { matchId } = req.params;

    try {
        const deletedCount = await ScoreHistory.destroy({ where: { matchId } });
        if (deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Score history not found for this match" });
        }
    } catch (error) {
        console.error("Error deleting score history:", error);
        res.status(500).json({ error: "Error deleting score history" });
    }
}