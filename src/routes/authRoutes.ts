import express from 'express';
import { register, verifyEmail } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.get('/verifyEmail/:token', verifyEmail);

export default router;
