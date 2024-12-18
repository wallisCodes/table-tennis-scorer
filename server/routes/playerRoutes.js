import { Router } from 'express';
import { createPlayer, getAllPlayers, getPlayerById, updatePlayer, deletePlayer, deleteAllPlayers } from '../controllers/playerController.js';
const router = Router();

// CRUD operations for players
router.post('/', createPlayer);
router.get('/', getAllPlayers);
router.get('/:playerId', getPlayerById);
router.put('/:playerId', updatePlayer);
router.delete('/:playerId', deletePlayer);
router.delete('/', deleteAllPlayers);

export default router;