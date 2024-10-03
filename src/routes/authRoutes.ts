import express from 'express';
import { register, verifyEmail, login, logout } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.get('/verifyEmail/:token', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);

export default router;
