import { Router } from 'express';
import { registerUser, loginUser, logoutUser, verifyToken } from '../controllers/userController.js';
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/verifyToken', verifyToken);

export default router;
