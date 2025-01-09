import { Router } from 'express';
import { addScoreEvent, getScoreHistory } from '../controllers/scoreHistoryController.js';
const router = Router();

router.post('/:matchId/:playerId', addScoreEvent);
router.get('/:matchId', getScoreHistory);

export default router;