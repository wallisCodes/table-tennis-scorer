import { Router } from 'express';
import { addScoreEvent, addScoreEventBatch, getScoreHistory } from '../controllers/scoreHistoryController.js';
const router = Router();

// Add or retrieve score history for a match
router.post('/:matchId/:playerId', addScoreEvent);
router.post('/:matchId/:playerId/batch', addScoreEventBatch);
router.get('/:matchId', getScoreHistory);

export default router;