import { Router } from 'express';
import { createMatchPlayers, getMatchPlayerByMatch, getMatchPlayerByPlayer, updateMatchPlayer, deleteMatchPlayer } from '../controllers/matchPlayerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', createMatchPlayers);
router.get('/:matchId', authenticateToken, getMatchPlayerByMatch);
router.get('/player/:playerId', authenticateToken, getMatchPlayerByPlayer);
router.put('/:id', updateMatchPlayer);
router.delete('/:id', authenticateToken, deleteMatchPlayer);

export default router;