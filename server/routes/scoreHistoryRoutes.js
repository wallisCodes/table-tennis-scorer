import { Router } from 'express';
import { addScoreEvent, getScoreHistory } from '../controllers/scoreHistoryController.js';
const router = Router();

// Add or retrieve score history for a match
router.post('/:matchId', addScoreEvent);
router.get('/:matchId', getScoreHistory);

export default router;