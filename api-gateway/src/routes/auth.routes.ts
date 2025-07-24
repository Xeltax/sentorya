import { Router, Request, Response } from 'express';
import authService from '../services/auth.service';
import { validate, loginSchema, registerSchema, refreshTokenSchema } from '../middleware/validation.middleware';
import { handleAsync } from '../utils/errors';

const router = Router();

// POST /api/auth/login
router.post('/login', validate(loginSchema), handleAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful',
    });
}));

// POST /api/auth/register
router.post('/register', validate(registerSchema), handleAsync(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    const result = await authService.register({ email, password, name });

    res.status(201).json({
        success: true,
        data: result,
        message: 'Registration successful',
    });
}));

// POST /api/auth/refresh
router.post('/refresh', validate(refreshTokenSchema), handleAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const tokens = await authService.refreshToken(refreshToken);

    res.status(200).json({
        success: true,
        data: tokens,
        message: 'Token refreshed successfully',
    });
}));

// POST /api/auth/logout
router.post('/logout', validate(refreshTokenSchema), handleAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    await authService.logout(refreshToken);

    res.status(200).json({
        success: true,
        message: 'Logout successful',
    });
}));

export default router;