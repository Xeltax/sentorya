import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { config } from './config';
import logger from './utils/logger';
import { AppError } from './utils/errors';
import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import CampainRoutes from "./routes/CampaignRoutes";

const app: Application = express();

// Security middleware
app.use(helmet());


// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*'); // Adjust this to your needs
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});
// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/user', UserRoutes);
app.use('/auth', AuthRoutes);
app.use('/campaign', CampainRoutes);

// 404 handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Something went wrong!';

    // Handle specific error types
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    } else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid data format';
    } else if (error.code === 11000) {
        statusCode = 409;
        message = 'Duplicate field value';
    }

    logger.error('Error:', {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
        }),
    });
});

const PORT = config.port;

app.listen(PORT, () => {
    logger.info(`🚀 API Gateway server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

export default app;