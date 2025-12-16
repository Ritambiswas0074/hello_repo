import { Router } from 'express';
import { checkAvailability, createSchedule, getUserSchedules } from '../controllers/schedule.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/availability', checkAvailability);
router.post('/', authenticate, createSchedule);
router.get('/user', authenticate, getUserSchedules);

export default router;

