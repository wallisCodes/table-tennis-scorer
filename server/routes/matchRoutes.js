import { Router } from 'express';
import { createMatch, claimMatch, getAllMatches, getMatchById, updateMatch, deleteMatch } from '../controllers/matchController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// CRUD operations for matches
router.post('/', createMatch);
router.get('/', authenticateToken, getAllMatches);
router.get('/:matchId', authenticateToken, getMatchById);
router.put('/:matchId', updateMatch);
router.put("/:matchId/claim", authenticateToken, claimMatch);
router.delete('/:matchId', authenticateToken, deleteMatch);

export default router;