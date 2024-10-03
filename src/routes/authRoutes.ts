import express from 'express';
import { register, verifyEmail, login, logout, forgotPassword, resetPassword } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.get('/verifyEmail/:token', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);


export default router;
