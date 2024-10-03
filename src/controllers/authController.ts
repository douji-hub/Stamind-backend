import { Request, Response } from 'express';
import { registerUser, verifyEmailToken, loginUser, forgetPassword, resetPassword } from '../services/authServices';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;
        await registerUser(email, password, username);
        res.status(201).json({ message: 'Please check your email to verify account' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        await verifyEmailToken(token);
        res.json({ message: 'Account verification successful, you can log in now' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        res.json({ token });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized request' });
        }
        await logoutUser(token);
        res.json({ message: 'Logout successful' });
    } catch (error: any) {
        res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await forgetPassword(email);
        res.json({ message: 'Password reset email has been sent, please check your email' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;
        await resetPassword(token, newPassword);
        res.json({ message: 'Password reset successful, you can login now' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};