import { Request, Response } from 'express';
import Stripe from 'stripe';
import { PaymentService } from '../services/payment.service';
import { AuthRequest } from '../types';
import prisma from '../config/database';

const paymentService = new PaymentService();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    // Get booking and verify ownership
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { plan: true },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { bookingId },
    });

    if (existingPayment && existingPayment.status === 'SUCCEEDED') {
      return res.status(400).json({ error: 'Payment already completed' });
    }

    const result = await paymentService.createPaymentIntent(
      bookingId,
      booking.plan.price,
      'usd'
    );

    res.json({
      clientSecret: result.clientSecret,
      paymentId: result.payment.id,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'No signature' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    await paymentService.handleWebhook(event);
    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;

    const payment = await paymentService.getPaymentStatus(id);

    // Verify ownership
    if (payment.booking.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ payment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

