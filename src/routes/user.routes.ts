import express from 'express';
import { authenticateUser } from '../middlewares';
import { updateUser } from '../controllers';

const router = express.Router();

router.post('/user/:userId', authenticateUser, updateUser);

export default router;