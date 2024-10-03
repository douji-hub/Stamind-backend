import express from 'express';
import {
    registerController,
    verifyEmailController,
    loginController,
    logoutController,
    forgotPasswordController,
    resetPasswordController
} from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerController);
router.get('/verifyEmail/:token', verifyEmailController);
router.post('/login', loginController);
router.post('/logout', authMiddleware, logoutController);
router.post('/forgotPassword', forgotPasswordController);
router.post('/resetPassword', resetPasswordController);


export default router;
