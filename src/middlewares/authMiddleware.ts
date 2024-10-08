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

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unprovided or malformed authorization header' });
        }

        const token = authHeader.substring(7); // remove 'Bearer '
        const decoded: any = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user || !user.sessionTokens.includes(token)) {
            return res.status(401).json({ message: 'Unauthorized request' });
        }

        // Append user information to the request object
        req.user = user;
        next();
    } catch (error: any) {
        res.status(401).json({ message: 'Authorization failed', error: error.message });
    }
};
