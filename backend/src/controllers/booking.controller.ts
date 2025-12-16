import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';
import { hasTimeCollision, calculateEndTime } from '../utils/schedule.utils';
import { withDbRetry } from '../utils/helpers';
import { formatDate, formatTime, formatDateTime } from '../utils/date.utils';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { locationId, scheduleId, mediaId, templateId, planId, notes } = req.body;

    // Validate required fields
    if (!locationId || !scheduleId || !mediaId || !templateId || !planId) {
      return res.status(400).json({
        error: 'Location, schedule, media, template, and plan are required',
      });
    }

    // Verify all related entities exist (with retry for connection issues)
    const [location, schedule, media, template, plan] = await Promise.all([
      withDbRetry(() => prisma.location.findUnique({ where: { id: locationId } })),
      withDbRetry(() => prisma.schedule.findUnique({ where: { id: scheduleId } })),
      withDbRetry(() => prisma.media.findUnique({ where: { id: mediaId } })),
      withDbRetry(() => prisma.template.findUnique({ where: { id: templateId } })),
      withDbRetry(() => prisma.plan.findUnique({ where: { id: planId } })),
    ]);

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Verify media ownership
    if (media.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Media does not belong to you' });
    }

    // Calculate and update schedule endTime based on selected plan
    if (!schedule.startTime) {
      return res.status(400).json({
        error: 'Schedule must have start time',
        message: 'Please ensure the schedule has startTime set',
      });
    }

    const scheduleStartTime = new Date(schedule.startTime);
    // Type assertion needed until Prisma types are fully updated
    const planDisplayDuration = (plan as any).displayDurationSeconds ?? null;
    const calculatedEndTime = calculateEndTime(scheduleStartTime, planDisplayDuration);

    // Update schedule with calculated endTime
    await withDbRetry(() => prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        endTime: calculatedEndTime,
      },
    }));

    // Update schedule object for collision detection
    schedule.endTime = calculatedEndTime;

    // Check for date/time collision
    const scheduleDate = new Date(schedule.date);
    const startOfDay = new Date(scheduleDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(scheduleDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get schedule start time - required for collision detection
    if (!schedule.startTime) {
      return res.status(400).json({
        error: 'Schedule must have start time',
        message: 'Please ensure the schedule has startTime set',
      });
    }

    const newStartTime = new Date(schedule.startTime);
    const newEndTime = calculatedEndTime; // Use the calculated endTime from plan

    // Get all existing bookings for this location and date with times
    const existingBookings = await withDbRetry(() => prisma.booking.findMany({
      where: {
        locationId,
        schedule: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          startTime: { not: null },
        },
        status: {
          notIn: ['CANCELLED', 'DRAFT'],
        },
      },
      include: {
        schedule: {
          select: {
            startTime: true,
            endTime: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    }));

    // Check for time collision
    for (const existingBooking of existingBookings) {
      if (!existingBooking.schedule?.startTime) {
        continue;
      }

      const existingStart = new Date(existingBooking.schedule.startTime);
      const existingEnd = existingBooking.schedule.endTime 
        ? new Date(existingBooking.schedule.endTime) 
        : null;

      // Check for exact time slot collision (same time slot at same location)
      if (hasTimeCollision(existingStart, existingEnd, newStartTime, newEndTime)) {
        const bookedBy = `${existingBooking.user?.firstName || ''} ${existingBooking.user?.lastName || ''}`.trim() || existingBooking.user?.email || 'Unknown';
        
        return res.status(409).json({
          error: 'Time slot conflicts with existing booking.',
          conflict: {
            bookingId: existingBooking.id,
            bookedBy: bookedBy,
            existingStart: existingStart.toISOString(),
            existingEnd: existingEnd?.toISOString() || null,
            requestedStart: newStartTime.toISOString(),
            requestedEnd: newEndTime?.toISOString() || null,
          },
          message: `There is already a slot created for this particular location at this time. Please select a different time.`,
        });
      }
    }

    // Also check if this specific schedule is already booked
    if (!schedule.isAvailable) {
      const existingScheduleBooking = await withDbRetry(() => prisma.booking.findFirst({
        where: {
          scheduleId: schedule.id,
          status: {
            notIn: ['CANCELLED', 'DRAFT'],
          },
        },
      }));

      if (existingScheduleBooking) {
        return res.status(409).json({
          error: 'This time slot is already booked',
        });
      }
    }

    // Create booking (req.user is already checked at the top)
    const userId = req.user.userId;
    const booking = await withDbRetry(() => prisma.booking.create({
      data: {
        userId: userId,
        locationId,
        scheduleId,
        mediaId,
        templateId,
        planId,
        status: 'PENDING_PAYMENT', // Set to pending payment since payment will be marked as rejected
        notes,
      },
      include: {
        location: true,
        schedule: true,
        media: true,
        template: true,
        plan: true,
      },
    }));

    // Automatically create payment record with FAILED status since Stripe is not implemented yet
    // This stores all booking information for lookup purposes
    const payment = await withDbRetry(() => prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: plan.price,
        currency: 'inr', // Indian Rupees
        status: 'FAILED', // Mark as failed since Stripe is not implemented
        failureReason: 'Payment gateway not implemented. Booking stored for lookup purposes.',
      },
    }));

    // Return booking with payment information
    const bookingWithPayment = await withDbRetry(() => prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        location: true,
        schedule: true,
        media: true,
        template: true,
        plan: true,
        payment: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    }));

    res.status(201).json({ booking: bookingWithPayment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Fetch user details from database
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { status } = req.query;

    const where: any = { userId: req.user.userId };
    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        location: {
          select: {
            id: true,
            name: true,
            city: true,
            address: true,
          },
        },
        schedule: {
          select: {
            id: true,
            date: true,
            startTime: true,
            endTime: true,
          },
        },
        media: {
          select: {
            id: true,
            filename: true,
            type: true,
            url: true,
            featureType: true,
            thumbnailUrl: true,
            createdAt: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            features: true,
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            stripePaymentId: true,
            paidAt: true,
            failureReason: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // For each booking, fetch all media items from all bookings for the same schedule
    const bookingsWithAllMedia = await Promise.all(
      bookings.map(async (booking) => {
        if (!req.user) {
          return { ...booking, allScheduleMedia: [] };
        }
        
        // Get the schedule details to match by date and location
        const schedule = booking.schedule;
        const scheduleDate = new Date(schedule.date);
        const startOfDay = new Date(scheduleDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(scheduleDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        // Find all bookings for the same schedule (by scheduleId)
        const scheduleBookings = await prisma.booking.findMany({
          where: {
            scheduleId: booking.scheduleId,
            userId: req.user.userId, // Only get user's own bookings
          },
          include: {
            media: {
              select: {
                id: true,
                filename: true,
                type: true,
                url: true,
                featureType: true,
                thumbnailUrl: true,
                createdAt: true,
              },
            },
          },
        });

        // Also find all bookings for the same date and location (in case of multiple schedules)
        const sameDateLocationBookings = await prisma.booking.findMany({
          where: {
            locationId: booking.locationId,
            userId: req.user.userId,
            schedule: {
              date: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
          },
          include: {
            media: {
              select: {
                id: true,
                filename: true,
                type: true,
                url: true,
                featureType: true,
                thumbnailUrl: true,
                createdAt: true,
              },
            },
          },
        });

        // Collect all unique media items from all bookings for this schedule/date/location
        const allMediaFromBookings = [
          ...scheduleBookings.map((b) => b.media),
          ...sameDateLocationBookings.map((b) => b.media),
        ].filter((media, index, self) => 
          index === self.findIndex((m) => m.id === media.id)
        ); // Remove duplicates

        // Use the media from bookings (this should include all media for the schedule)
        const allMediaForSchedule = allMediaFromBookings;

        return {
          ...booking,
          allScheduleMedia: allMediaForSchedule,
        } as typeof booking & { allScheduleMedia: typeof allMediaForSchedule };
      })
    );

    // Format response for user master table view (similar to admin view)
    const formattedBookings = bookingsWithAllMedia.map((booking) => {
      const eventDate = new Date(booking.schedule.date);
      const startTime = booking.schedule.startTime ? new Date(booking.schedule.startTime) : null;
      // Use stored endTime or null (can't calculate without plan info)
      const endTime = booking.schedule.endTime ? new Date(booking.schedule.endTime) : null;

      // Format date and time for display using local timezone to preserve user's selection
      const formattedDate = formatDate(eventDate, startTime);
      const formattedStartTime = formatTime(startTime);
      const formattedEndTime = formatTime(endTime);

      // Only show start time (no end time range)
      const timeSlot = formattedStartTime || 'Time not specified';

      return {
        id: booking.id,
        // User information
        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        userEmail: user.email,
        userPhone: user.phone,
        // Location information
        locationName: booking.location.name,
        locationCity: booking.location.city,
        locationAddress: booking.location.address,
        // Date information
        eventDate: booking.schedule.date,
        eventDateFormatted: formattedDate,
        // Time information
        eventStartTime: booking.schedule.startTime,
        eventEndTime: booking.schedule.endTime || (startTime ? endTime?.toISOString() : null),
        eventStartTimeFormatted: formattedStartTime,
        eventEndTimeFormatted: formattedEndTime,
        eventTimeSlot: timeSlot,
        eventDateTime: formatDateTime(eventDate, startTime),
        // Media information (primary media for this booking)
        mediaId: booking.media.id,
        mediaFilename: booking.media.filename,
        mediaType: booking.media.type,
        mediaFeatureType: booking.media.featureType,
        mediaUrl: booking.media.url,
        mediaThumbnailUrl: booking.media.thumbnailUrl,
        // All media items for this schedule
        allScheduleMedia: booking.allScheduleMedia || [],
        // Template information
        templateName: booking.template.name,
        templateDescription: booking.template.description,
        // Plan information
        planName: booking.plan.name,
        planPrice: booking.plan.price,
        planDuration: booking.plan.duration,
        planFeatures: booking.plan.features,
        // Booking status
        bookingStatus: booking.status,
        // Payment information
        paymentStatus: booking.payment?.status || 'NO_PAYMENT',
        paymentAmount: booking.payment?.amount || 0,
        paymentConfirmed: booking.payment?.status === 'SUCCEEDED',
        paymentRejected: booking.payment?.status === 'FAILED',
        paymentFailureReason: booking.payment?.failureReason,
        stripePaymentId: booking.payment?.stripePaymentId,
        paidAt: booking.payment?.paidAt,
        // Timestamps
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        // Notes
        notes: booking.notes,
      };
    });

    res.json({
      bookings: formattedBookings,
      total: formattedBookings.length,
      summary: {
        total: formattedBookings.length,
        pendingPayment: formattedBookings.filter((b) => b.paymentStatus === 'PENDING').length,
        paymentApproved: formattedBookings.filter((b) => b.paymentConfirmed).length,
        paymentRejected: formattedBookings.filter((b) => b.paymentRejected).length,
        active: formattedBookings.filter((b) => b.bookingStatus === 'ACTIVE').length,
        completed: formattedBookings.filter((b) => b.bookingStatus === 'COMPLETED').length,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        location: true,
        schedule: true,
        media: true,
        template: true,
        plan: true,
        payment: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check ownership
    if (booking.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ booking });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['DRAFT', 'PENDING_PAYMENT', 'PAYMENT_APPROVED', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Only allow status updates by owner or admin
    if (booking.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        location: true,
        schedule: true,
        media: true,
        template: true,
        plan: true,
        payment: true,
      },
    });

    res.json({ booking: updatedBooking });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

