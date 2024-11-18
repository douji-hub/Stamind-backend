import { ObjectId } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import * as spaceService from '../services/spaceService';
import { configureDynamicWebSocket } from '../config/webSocketConfig';
import Redis from 'ioredis';
import { IRequestWithUser } from '../interfaces/globalInterface';
import User from '../models/user';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(REDIS_URL);

// Create a new space
export const createSpace = async (req: IRequestWithUser, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'User not authorized' });
            return
        }

        // Create the Space
        const space = await spaceService.createSpace(user._id as ObjectId);

        res.status(201).json(space);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating space' });
    }
};

// Get space details
export const getSpaceDetails = async (req: IRequestWithUser, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'User not authorized' });
            return
        }

        const spaceDetails = await spaceService.getSpaceDetails(user._id as ObjectId);
        res.status(200).json(spaceDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching space details' });
    }
};

// delete space
export const deleteSpace = async (req: IRequestWithUser, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'User not authorized' });
            return
        }

        const { spaceId } = req.body;

        await spaceService.deleteSpace(user._id as ObjectId, spaceId);

        res.status(200).json({ message: 'Space deleted successfully' });
    } catch (error: any) {
        console.error(error);
        if (error.message === 'User not found' || error.message === 'Space not found or unauthorized') {
            res.status(404).json({ message: error.message });
            return
        }
        res.status(500).json({ message: 'Error deleting space' });
    }
};