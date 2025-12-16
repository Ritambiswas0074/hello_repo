import { Router } from 'express';
import { getDashboard } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/dashboard', authenticate, getDashboard);

export default router;

