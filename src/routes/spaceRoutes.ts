import express from 'express';
import {
    createSpace,
    getAllSpaces,
    getSpaceById,
    deleteSpace,
} from '../controllers/spaceController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Create a new space
router.post('/', authMiddleware, createSpace);

// Get all spaces for the authenticated user
router.get('/', authMiddleware, getAllSpaces);

// Get a specific space by ID
router.get('/:spaceId', authMiddleware, getSpaceById);

// Delete a specific space
router.delete('/:spaceId', authMiddleware, deleteSpace);

export default router;
