import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details[0].message,
            });
        }

        next();
    };
};

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(50).required(),
});

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
});