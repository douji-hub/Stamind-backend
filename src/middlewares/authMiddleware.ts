import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header not provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user || !user.session_tokens.includes(token)) {
            return res.status(401).json({ message: 'Unauthorized request' });
        }

        // Append user information to the request object
        req.user = user;
        next();
    } catch (error: any) {
        res.status(401).json({ message: 'Authorization failed', error: error.message });
    }
};
