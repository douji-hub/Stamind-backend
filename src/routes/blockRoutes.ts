import express from 'express';
import {
    createBlock,
    getBlockById,
    updateBlock,
    deleteBlock,
    generateBlockPin,
    joinSharedBlock,
    initializeBlockSocket
} from '../controllers/blockController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Join a shared block using a PIN code
router.post('/join', authMiddleware, joinSharedBlock);

// Create a new block under a specific space
router.post('/:spaceId', authMiddleware, createBlock);

// Get a specific block by ID
router.get('/:blockId', authMiddleware, getBlockById);

// Update a block
router.put('/:blockId', authMiddleware, updateBlock);

// Delete a block
router.delete('/:blockId', authMiddleware, deleteBlock);

// Generate a PIN code to share a block
router.post('/:blockId/generatePin', authMiddleware, generateBlockPin);

// Initialize a WebSocket for a block
router.post('/:blockId/connect', authMiddleware, initializeBlockSocket);

export default router;