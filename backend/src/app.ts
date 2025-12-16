import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import locationRoutes from './routes/location.routes';
import scheduleRoutes from './routes/schedule.routes';
import uploadRoutes from './routes/upload.routes';
import templateRoutes from './routes/template.routes';
import planRoutes from './routes/plan.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import whatsappRoutes from './routes/whatsapp.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import { getAllUserActivity } from './controllers/admin.controller';
import { handleWebhook } from './controllers/payment.controller';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

// Middleware - CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:5175',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, allow all origins (or specific ones from env)
    // This allows the frontend to be deployed anywhere
    if (process.env.NODE_ENV === 'production') {
      // If FRONTEND_URL is set, prefer it, otherwise allow all
      if (process.env.FRONTEND_URL) {
        const frontendUrls = process.env.FRONTEND_URL.split(',').map(url => url.trim());
        if (frontendUrls.includes(origin) || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
      }
      // Allow all origins in production for flexibility
      return callback(null, true);
    }
    
    // Development: allow specific origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For development, allow any localhost origin
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Stripe webhook must be before body parsing middleware
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/user', userRoutes);

// Public user activity endpoint (no authentication required)
// Using a different path to avoid any conflicts with admin routes
app.get('/api/user-activity', getAllUserActivity);

// Admin routes (require authentication)
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

