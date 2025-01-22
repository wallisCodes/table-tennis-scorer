import { Router } from 'express';
import { createHeartRateBatch, getHeartRateByPlayer } from '../controllers/heartRateController.js';
const router = Router();

router.post('/:matchId/:playerId', createHeartRateBatch);
router.get('/:matchId/:playerId', getHeartRateByPlayer);

export default router;