import { Request, Response } from 'express';
import { LikeService } from '../services';
import { AuthenticatedRequest } from '../types';

const likeService = new LikeService();

export const likePublication = async (req: Request, res: Response) => {
    try {
        const { publicationId } = req.params;
        const userId = (req as AuthenticatedRequest).user.userId;

        const result = await likeService.likePublication(publicationId, userId);

        res.status(201).json(result);
    } catch (error: any) {
        if (error.message === 'Publication not found' || error.message === 'Like not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'User already liked this publication' || error.message === 'You cannot like your own publication') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const unlikePublication = async (req: Request, res: Response) => {
    try {
        const { publicationId } = req.params;
        const userId = (req as AuthenticatedRequest).user.userId;

        await likeService.unlikePublication(publicationId, userId);

        res.status(200).json({ message: 'Like removed successfully' });
    } catch (error: any) {
        if (error.message === 'Like not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};