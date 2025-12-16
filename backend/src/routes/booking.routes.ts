import { Router } from 'express';
import { createBooking, getUserBookings, getBookingById, updateBookingStatus } from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createBooking);
router.get('/user', authenticate, getUserBookings);
router.get('/:id', authenticate, getBookingById);
router.patch('/:id/status', authenticate, updateBookingStatus);

export default router;

