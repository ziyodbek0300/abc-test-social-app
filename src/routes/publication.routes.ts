import express from 'express';
import {
    createPublication,
    getPublications,
    getPublicationById,
    updatePublication,
    deletePublication,
    getPaginatedPublications,
} from '../controllers/publication.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/publications', authenticateUser, createPublication);
router.get('/all', getPaginatedPublications);
router.get('/publications/:id', getPublicationById);
router.put('/publications/:id', authenticateUser, updatePublication);
router.delete('/publications/:id', authenticateUser, deletePublication);

export default router;