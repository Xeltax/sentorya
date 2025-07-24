import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import authService from '../services/auth.service';
import { AppError } from '../utils/errors';
import { JwtPayload, User } from '../types';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new AppError('Access token is required', 401);
        }

        // Vérifier le token localement d'abord
        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        } catch (error) {
            throw new AppError('Invalid token', 401);
        }

        // Valider le token avec le service d'authentification
        const user = await authService.validateToken(token);
        req.user = user;

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                error: error.message,
            });
        }
        return res.status(401).json({
            success: false,
            error: 'Authentication failed',
        });
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions',
            });
        }

        next();
    };
};
