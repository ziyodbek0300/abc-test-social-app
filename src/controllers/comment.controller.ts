
import { Request, Response } from 'express';
import { CommentService } from '../services';
import { AuthenticatedRequest } from '../types';

const commentService = new CommentService();

export const addComment = async (req: Request, res: Response) => {
    try {
        const { publicationId } = req.params;
        const userId = (req as AuthenticatedRequest).user.userId;
        const { content } = req.body;

        const result = await commentService.addComment(publicationId, userId, content);

        res.status(201).json(result);
    } catch (error: unknown) {
        if (error instanceof Error)
            res.status(400).json({ message: error.message });
    }
};

export const getComments = async (req: Request, res: Response) => {
    try {
        const { publicationId } = req.params;

        const result = await commentService.getComments(publicationId);

        res.status(200).json(result);
    } catch (error: unknown) {
        if (error instanceof Error)
            res.status(400).json({ message: error.message });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const userId = (req as AuthenticatedRequest).user.userId;

        await commentService.deleteComment(commentId, userId);

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error)
            res.status(400).json({ message: error.message });
    }
};
