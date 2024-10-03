import { Request, Response } from 'express';
import {
    registerUserService,
    verifyEmailTokenService,
    loginUserService,
    logoutUserService,
    forgetPasswordService,
    resetPasswordService
} from '../services/authServices';

export const registerController = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;
        await registerUserService(email, password, username);
        res.status(201).json({ message: 'Please check your email to verify account' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const verifyEmailController = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        await verifyEmailTokenService(token);
        res.json({ message: 'Account verification successful, you can log in now' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await loginUserService(email, password);
        res.json({ token });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const logoutController = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized request' });
        }

        await logoutUserService(token);
        res.json({ message: 'Logout successful' });
    } catch (error: any) {
        res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await forgetPasswordService(email);
        res.json({ message: 'Password reset email has been sent, please check your email' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const resetPasswordController = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;
        await resetPasswordService(token, newPassword);
        res.json({ message: 'Password reset successful, you can login now' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};