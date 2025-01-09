import { Router } from 'express';
import { addHeartRate, getHeartRateByPlayer } from '../controllers/heartRateController.js';
const router = Router();

router.post('/:matchId/:playerId', addHeartRate);
router.get('/:matchId/:playerId', getHeartRateByPlayer);

export default router;