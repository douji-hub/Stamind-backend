import jwt from 'jsonwebtoken';
import {Response, NextFunction} from 'express';
import {IRequestWithUser} from "../interfaces/globalInterface";
import User, {IUser} from '../models/user';


export const authMiddleware = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    if (process.env.JWT_SECRET == undefined) throw new Error() // TODO: error 要有統一處理的地方
    const JWT_SECRET: string = process.env.JWT_SECRET || '';

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({message: 'Authorization header not provided'});
            return
        }

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({message: 'Unprovided or malformed authorization header'});
            return
        }

        const token = authHeader.substring(7); // remove 'Bearer '
        const decoded: any = jwt.verify(token, JWT_SECRET);

        const user: IUser | null = await User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({message: 'User is not exist'})
            return
        } else if (user.sessionTokens != token) {
            res.status(401).json({message: 'Unauthorized request'})
            return
        }


        // Append user information to the request object
        req.user = user
        next()
    } catch (error: any) {
        res.status(401).json({message: 'Authorization failed', error: error.message})
        return
    }
};
