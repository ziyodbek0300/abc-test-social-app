import { Router } from 'express';
import { login, register, verifyEmail } from '../controllers';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.get('/verify-email', verifyEmail);

export default router;