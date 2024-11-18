import express from 'express';
import {
    createBlock,
    getBlockById,
    getBlocksBySpaceId,
    updateBlock,
    initializeBlockSocket,
    generateBlockPin,
    joinSharedBlock
} from '../controllers/blockController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/:blockId', authMiddleware, getBlockById);
router.get('/:spaceId/blocks', authMiddleware, getBlocksBySpaceId);
router.put('/:blockId', authMiddleware, updateBlock);
router.post('/:spaceId/createBlock', authMiddleware, createBlock);
router.post('/:blockId/generatePin', authMiddleware, generateBlockPin);
router.post('/join', authMiddleware, joinSharedBlock);
router.post('/initializeBlockSocket', authMiddleware, initializeBlockSocket);

export default router;