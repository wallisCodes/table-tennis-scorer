import { Router } from 'express';
import { createHeartRateBatch, getHeartRateByPlayer, deleteHeartRateByPlayer } from '../controllers/heartRateController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/:matchId/:playerId', createHeartRateBatch);
router.get('/:matchId/:playerId', authenticateToken, getHeartRateByPlayer);
router.delete('/:matchId/:playerId', authenticateToken, deleteHeartRateByPlayer);

export default router;