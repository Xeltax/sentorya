import { Router, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { config } from '../config';

const router = Router();

// Middleware d'authentification pour toutes les routes utilisateur
router.use(authenticate);

// Proxy vers le service utilisateur
const userServiceProxy = createProxyMiddleware({
    target: config.services.user,
    changeOrigin: true,
    pathRewrite: {
        '^/api/users': '/users',
    },
    onProxyReq: (proxyReq, req) => {
        // Ajouter les informations utilisateur dans les headers
        if (req.user) {
            proxyReq.setHeader('X-User-Id', req.user.id);
            proxyReq.setHeader('X-User-Email', req.user.email);
            proxyReq.setHeader('X-User-Role', req.user.role);
        }
    },
});

// Routes utilisateur avec proxy
router.use('/', userServiceProxy);

export default router;