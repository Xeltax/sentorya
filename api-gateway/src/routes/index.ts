// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API Gateway is healthy',
        timestamp: new Date().toISOString(),
    });
});

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;