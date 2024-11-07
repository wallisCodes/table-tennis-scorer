import { Router } from 'express';
import { addHeartRate, getHeartRateByPlayer } from '../controllers/heartRateController.js';
const router = Router();

// Add or retrieve heart rate data for a match and player
router.post('/:matchId/:playerId', addHeartRate);
router.get('/:matchId/:playerId', getHeartRateByPlayer);

export default router;