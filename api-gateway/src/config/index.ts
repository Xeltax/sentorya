import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    services: {
        auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
        user: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
};