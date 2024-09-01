import express from 'express';
import {
    likePublication,
    unlikePublication
} from '../controllers/like.controller';
import { authenticateUser } from '../middlewares';

const router = express.Router();

router.post('/publications/:publicationId/like', authenticateUser, likePublication);

router.delete('/publications/:publicationId/like', authenticateUser, unlikePublication);

export default router;