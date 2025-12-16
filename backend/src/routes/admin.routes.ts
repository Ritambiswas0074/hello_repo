import express from 'express';
import { getAllBookings, getBookingStats } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// All admin routes require authentication
router.use(authenticate);

// Get all bookings (admin master table)
router.get('/bookings', requireAdmin, getAllBookings);

// Get booking statistics
router.get('/stats', requireAdmin, getBookingStats);

export default router;

