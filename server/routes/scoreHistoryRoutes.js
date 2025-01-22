import { Router } from 'express';
import { createScoringBatch, getScoreHistory } from '../controllers/scoreHistoryController.js';
const router = Router();

router.post('/:matchId', createScoringBatch);
router.get('/:matchId', getScoreHistory);

export default router;