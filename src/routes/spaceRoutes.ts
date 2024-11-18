import express from 'express';
import {
    createSpace,
    getSpaceDetails,
    deleteSpace
} from '../controllers/spaceController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/getSpaceDetails', authMiddleware, getSpaceDetails);
router.post('/createSpace', authMiddleware, createSpace);
router.delete('/deleteSpace', authMiddleware, deleteSpace);

export default router;
