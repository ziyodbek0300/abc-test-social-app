import { RequestHandler, Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthenticatedRequest } from '../types';

export const authenticateUser: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.secret) as { userId: string };

        (req as AuthenticatedRequest).user = { userId: decoded.userId };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
