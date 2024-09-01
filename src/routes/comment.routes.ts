import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware';
import {
    addComment,
    getComments,
    deleteComment
} from '../controllers/comment.controller';

const router = express.Router();

router.post('/publications/:publicationId/comments', authenticateUser, addComment);

router.get('/publications/:publicationId/comments', getComments);

router.delete('/comments/:commentId', authenticateUser, deleteComment);

export default router;