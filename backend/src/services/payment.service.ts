import Stripe from 'stripe';
import prisma from '../config/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export class PaymentService {
  async createPaymentIntent(bookingId: string, amount: number, currency: string = 'inr') {
    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { plan: true, user: true },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        bookingId,
        userId: booking.userId,
      },
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        stripePaymentId: paymentIntent.id,
        amount,
        currency,
        status: 'PENDING',
      },
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'PENDING_PAYMENT' },
    });

    return {
      paymentIntent,
      payment,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;

    if (!bookingId) {
      console.error('No booking ID in payment intent metadata');
      return;
    }

    // Update payment status
    await prisma.payment.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: {
        status: 'SUCCEEDED',
        paidAt: new Date(),
      },
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'PAYMENT_APPROVED' },
    });
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;

    if (!bookingId) {
      console.error('No booking ID in payment intent metadata');
      return;
    }

    // Update payment status
    await prisma.payment.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: {
        status: 'FAILED',
        failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
      },
    });
  }

  async getPaymentStatus(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // If payment has Stripe ID, check with Stripe for latest status
    if (payment.stripePaymentId) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentId);
        
        // Sync status if different
        if (payment.status !== paymentIntent.status.toUpperCase()) {
          await prisma.payment.update({
            where: { id: paymentId },
            data: {
              status: paymentIntent.status.toUpperCase() as any,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching payment from Stripe:', error);
      }
    }

    return payment;
  }
}

