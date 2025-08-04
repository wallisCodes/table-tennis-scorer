import { Router } from 'express';
import { createScoreHistory, getScoreHistory, deleteScoreHistory } from '../controllers/scoreHistoryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/:matchId', createScoreHistory);
router.get('/:matchId', authenticateToken, getScoreHistory);
router.delete('/:matchId', authenticateToken, deleteScoreHistory);

export default router;