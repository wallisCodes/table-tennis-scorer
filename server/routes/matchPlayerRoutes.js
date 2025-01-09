import { Router } from 'express';
import { addMatchPlayer, getMatchPlayerByMatch, getMatchPlayerByPlayer, updateMatchPlayer, deleteMatchPlayer } from '../controllers/matchPlayerController.js';

const router = Router();

router.post('/', addMatchPlayer);
router.get('/:matchId', getMatchPlayerByMatch);
router.get('/player/:playerId', getMatchPlayerByPlayer);
router.put('/:id', updateMatchPlayer);
router.delete('/:id', deleteMatchPlayer);

export default router;