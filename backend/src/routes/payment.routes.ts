import { Router } from 'express';
import { createPaymentIntent, getPaymentStatus } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/create-intent', authenticate, createPaymentIntent);
router.get('/:id', authenticate, getPaymentStatus);

export default router;

