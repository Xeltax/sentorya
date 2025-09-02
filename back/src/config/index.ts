import dotenv from 'dotenv';

dotenv.config();

console.log("Test process env", process.env.PORT)

export const config = {
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
};