import { Router } from 'express';
import { createPlayer, getPlayerById, updatePlayer, deletePlayer } from '../controllers/playerController.js';
const router = Router();

// CRUD operations for players
router.post('/', createPlayer);
router.get('/:playerId', getPlayerById);
router.put('/:playerId', updatePlayer);
router.delete('/:playerId', deletePlayer);

export default router;