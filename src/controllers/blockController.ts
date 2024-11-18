import mongoose, { ObjectId } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { configureDynamicWebSocket } from '../config/webSocketConfig';
import * as blockService from '../services/blockService';
import { IRequestWithUser } from '../interfaces/globalInterface';

// Controller to create a new block under a specific space
export const createBlock = async (req: IRequestWithUser, res: Response): Promise<void> => {
    try {
        const user = req.user; // Ensure the user is authenticated
        if (!user) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const { spaceId } = req.params; // Extract spaceId from request parameters
        const { blockName, blockType } = req.body; // Extract block details from request body

        const blockData = {
            blockName,
            blockType,
        };

        const block = await blockService.createBlock(spaceId, blockData); // Create the block in the service
        res.status(201).json(block); // Return the created block
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error creating block', error: error.message });
    }
};

// Controller to fetch block details by its ID
export const getBlockById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { blockId } = req.params; // Extract blockId from request parameters
        const block = await blockService.getBlockById(blockId); // Get block details from the service
        res.status(200).json(block); // Return the block details
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Block not found' });
    }
};

// Controller to fetch all blocks under a specific space
export const getBlocksBySpaceId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { spaceId } = req.params; // Extract spaceId from request parameters
        const blocks = await blockService.getBlocksBySpaceId(spaceId); // Get blocks from the service
        res.status(200).json(blocks); // Return the list of blocks
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching blocks' });
    }
};

// Controller to generate a PIN code for sharing a block
export const generateBlockPin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { blockId } = req.params; // Extract blockId from request parameters
        const block = await blockService.generateBlockPin(blockId); // Generate a PIN in the service
        res.status(200).json({ message: 'PIN code generated', coWorkId: block.coWorkId }); // Return the PIN
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error generating PIN code', error: error.message });
    }
};

// Controller to join a shared block using a PIN code
export const joinSharedBlock = async (req: IRequestWithUser, res: Response): Promise<void> => {
    try {
        const user = req.user; // Ensure the user is authenticated
        if (!user) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const { pinCode } = req.body; // Extract the PIN code from the request body
        const block = await blockService.joinSharedBlock(user._id as mongoose.Types.ObjectId, pinCode); // Join the block in the service
        res.status(200).json(block); // Return the block details
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: 'Invalid PIN code or block not shared', error: error.message });
    }
};

// Controller to update a block's details
export const updateBlock = async (req: Request, res: Response): Promise<void> => {
    try {
        const { blockId } = req.params; // Extract blockId from request parameters
        const updates = req.body; // Extract updates from the request body
        const updatedBlock = await blockService.updateBlock(blockId, updates); // Update the block in the service
        res.status(200).json(updatedBlock); // Return the updated block
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error updating block', error: error.message });
    }
};

// Controller to initialize a WebSocket for a block
export const initializeBlockSocket = async (req: Request, res: Response) => {
    try {
        const { blockId } = req.body; // Extract blockId from request body

        configureDynamicWebSocket(blockId); // Initialize WebSocket connection for the block

        res.status(200).json({ message: `WebSocket initialized for block: ${blockId}` }); // Return success message
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error initializing WebSocket for block' });
    }
};