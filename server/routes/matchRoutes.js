import { Router } from 'express';
import { createMatch, getMatchById, updateMatch, deleteMatch } from '../controllers/matchController.js';
const router = Router();

// CRUD operations for matches
router.post('/', createMatch);
router.get('/:matchId', getMatchById);
router.put('/:matchId', updateMatch);
router.delete('/:matchId', deleteMatch);

export default router;