// routes/authRoutes.ts
import express from 'express';
import {
    registerController,
    verifyEmailController,
    loginController,
    logoutController,
    forgotPasswordController,
    resetPasswordController,
    resendEmailController
} from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/users', registerController); // register
router.get('/users/verify', verifyEmailController); //verifyEmail
router.post('/users/resend', resendEmailController);// resend email
router.post('/sessions', loginController); // login
router.delete('/sessions', authMiddleware, logoutController); // logout
router.post('/password-resets', forgotPasswordController); // forget password
router.put('/password-resets', resetPasswordController); // reset

export default router;
