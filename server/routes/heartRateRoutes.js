import { Router } from 'express';
import { addHeartRate, addHeartRateBatch, getHeartRateByPlayer } from '../controllers/heartRateController.js';
const router = Router();

// Add or retrieve heart rate data for a match and player
router.post('/:matchId/:playerId', addHeartRate);
router.post('/:matchId/:playerId/batch', addHeartRateBatch);
router.get('/:matchId/:playerId', getHeartRateByPlayer);

export default router;