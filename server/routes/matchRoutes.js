import { Router } from 'express';
import { createMatch, getAllMatches, getMatchById, updateMatch, deleteMatch } from '../controllers/matchController.js';
const router = Router();

// CRUD operations for matches
router.post('/', createMatch);
router.get('/', getAllMatches);
router.get('/:matchId', getMatchById);
router.put('/:matchId', updateMatch);
router.delete('/:matchId', deleteMatch);

export default router;