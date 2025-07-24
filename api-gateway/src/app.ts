import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { corsMiddleware } from './middleware/cors.middleware';
import { rateLimitMiddleware } from './middleware/rateLimit.middleware';
import routes from './routes';
import logger from './utils/logger';
import { AppError } from './utils/errors';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(rateLimitMiddleware);

// Logging
app.use(morgan('combined', {
    stream: {
        write: (message: string) => {
            logger.info(message.trim());
        },
    },
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', routes);

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