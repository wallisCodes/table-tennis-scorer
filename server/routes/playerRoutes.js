import { Router } from 'express';
import { createPlayers, getAllPlayers, getPlayerById, updatePlayer, deletePlayer, deleteAllPlayers } from '../controllers/playerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', createPlayers);
router.get('/', getAllPlayers);
router.get('/:playerId', authenticateToken, getPlayerById);
router.put('/:playerId', updatePlayer);
router.delete('/:playerId', authenticateToken, deletePlayer);
router.delete('/', authenticateToken, deleteAllPlayers);

export default router;