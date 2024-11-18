// routes/index.ts
import express from 'express';
import authRoutes from './authRoutes';
import spaceRoutes from './spaceRoutes';
import blockRoutes from './blockRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/space', spaceRoutes);
router.use('/block', blockRoutes);

export default router;
