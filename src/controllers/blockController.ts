import mongoose, { ObjectId } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { configureDynamicWebSocket } from '../config/webSocketConfig';
import * as blockService from '../services/blockService';
import { IRequestWithUser } from '../interfaces/globalInterface';

export const createBlock = async (req: IRequestWithUser, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const { spaceId } = req.params;
        const { blockName, blockType } = req.body;

        const blockData = {
            blockName,
            blockType,
        };

        const block = await blockService.createBlock(spaceId, blockData);
        res.status(201).json(block);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error creating block', error: error.message });
    }
};

export const getBlockById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { blockId } = req.params;
        const block = await blockService.getBlockById(blockId);
        res.status(200).json(block);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Block not found' });
    }
};

export const getBlocksBySpaceId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { spaceId } = req.params;
        const blocks = await blockService.getBlocksBySpaceId(spaceId);
        res.status(200).json(blocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching blocks' });
    }
};

export const generateBlockPin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { blockId } = req.params;
        const block = await blockService.generateBlockPin(blockId);
        res.status(200).json({ message: 'PIN code generated', coWorkId: block.coWorkId });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error generating PIN code', error: error.message });
    }
};

export const joinSharedBlock = async (req: IRequestWithUser, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const { pinCode } = req.body;
        const block = await blockService.joinSharedBlock(user._id as mongoose.Types.ObjectId, pinCode);
        res.status(200).json(block);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: 'Invalid PIN code or block not shared', error: error.message });
    }
};

export const updateBlock = async (req: Request, res: Response): Promise<void> => {
    try {
        const { blockId } = req.params;
        const updates = req.body;
        const updatedBlock = await blockService.updateBlock(blockId, updates);
        res.status(200).json(updatedBlock);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error updating block', error: error.message });
    }
};


// Initialize a WebSocket for a block
export const initializeBlockSocket = async (req: Request, res: Response) => {
    try {
        const { blockId } = req.body;

        configureDynamicWebSocket(blockId);

        res.status(200).json({ message: `WebSocket initialized for block: ${blockId}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error initializing WebSocket for block' });
    }
};