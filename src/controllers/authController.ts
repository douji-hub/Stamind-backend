import { Request, Response } from 'express';
import { registerUser } from '../services/authServices';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;
        await registerUser(email, password, username);
        res.status(201).json({ message: 'Please check your email to verify account' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

