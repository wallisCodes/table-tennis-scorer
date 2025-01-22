import { Router } from 'express';
import { createPlayers, getAllPlayers, getPlayerById, updatePlayer, deletePlayer, deleteAllPlayers } from '../controllers/playerController.js';
const router = Router();

router.post('/', createPlayers);
router.get('/', getAllPlayers);
router.get('/:playerId', getPlayerById);
router.put('/:playerId', updatePlayer);
router.delete('/:playerId', deletePlayer);
router.delete('/', deleteAllPlayers);

export default router;