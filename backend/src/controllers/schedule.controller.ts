import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';
import { checkTimeSlotAvailability, formatTime, calculateEndTime, hasTimeCollision } from '../utils/schedule.utils';

export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { locationId, date, startTime } = req.query;

    if (!locationId || !date) {
      return res.status(400).json({ error: 'Location ID and date are required' });
    }

    const scheduleDate = new Date(date as string);
    const startOfDay = new Date(scheduleDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(scheduleDate);
    endOfDay.setHours(23, 59, 59, 999);

    // If start time is provided, check for specific time slot availability
    // Note: This endpoint doesn't have plan info, so we can't calculate exact end time
    // This is a simplified availability check
    if (startTime) {
      const requestedStart = new Date(startTime as string);
      // Without plan info, we can't calculate exact end time here
      // This is just a basic availability check

      // Get all existing schedules with times for this location and date
      const existingSchedules = await prisma.schedule.findMany({
        where: {
          locationId: locationId as string,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          isAvailable: false,
          startTime: { not: null },
        },
        include: {
          bookings: {
            where: {
              status: {
                notIn: ['CANCELLED', 'DRAFT'],
              },
            },
          },
        },
      });

      // Check for exact time slot collisions using hasTimeCollision utility
      for (const schedule of existingSchedules) {
        if (schedule.bookings.length === 0 || !schedule.startTime) {
          continue;
        }

        const existingStart = new Date(schedule.startTime);
        const existingEnd = schedule.endTime ? new Date(schedule.endTime) : null;

        // Use hasTimeCollision to check for exact time slot overlap
        if (hasTimeCollision(existingStart, existingEnd, requestedStart, null)) {
          return res.json({
            available: false,
            date: scheduleDate.toISOString(),
            locationId,
            conflict: {
              existingStart: existingStart.toISOString(),
              existingEnd: existingEnd?.toISOString() || null,
            },
            message: `There is already a slot created for this particular location at this time.`,
          });
        }
      }

      return res.json({
        available: true,
        date: scheduleDate.toISOString(),
        locationId,
        startTime: requestedStart.toISOString(),
        note: 'Duration depends on selected plan (15s, 30s, or custom).',
      });
    }

    // If no times provided, just check if date is available
    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        locationId: locationId as string,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        isAvailable: false,
      },
    });

    const isAvailable = !existingSchedule;

    res.json({
      available: isAvailable,
      date: scheduleDate.toISOString(),
      locationId,
      note: 'For time slot availability, provide startTime parameter. Duration depends on selected plan.',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createSchedule = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { locationId, date, startTime, planId } = req.body;

    if (!locationId || !date) {
      return res.status(400).json({ error: 'Location ID and date are required' });
    }

    // Require startTime for booking
    if (!startTime) {
      return res.status(400).json({ 
        error: 'Start time is required for booking',
        message: 'Please provide startTime to book a time slot.',
      });
    }

    // Check 48-hour minimum advance booking requirement
    const requestedScheduleDate = new Date(date);
    const requestedScheduleDateTime = new Date(startTime);
    const now = new Date();
    const minBookingTime = new Date(now.getTime() + (48 * 60 * 60 * 1000)); // 48 hours from now

    if (requestedScheduleDateTime < minBookingTime) {
      return res.status(400).json({
        error: 'Booking must be at least 48 hours in advance',
        message: `You can only book dates and times that are at least 48 hours from now. The earliest available booking time is ${minBookingTime.toLocaleString()}.`,
        minBookingTime: minBookingTime.toISOString(),
      });
    }

    // planId is optional - endTime will be calculated when plan is selected later
    let plan = null;
    if (planId) {
      plan = await prisma.plan.findUnique({
        where: { id: planId },
        select: { id: true, name: true, displayDurationSeconds: true },
      });

      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' });
      }
    }

    // Check if location exists
    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Check availability - prevent date/time collisions
    const scheduleDate = new Date(date);
    const startOfDay = new Date(scheduleDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(scheduleDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Note: We allow multiple bookings on the same date, but exact time slot collisions are not allowed for the same location

    // Parse start time and calculate end time based on plan (if provided)
    const newStartTime = new Date(startTime);
    const newEndTime = plan ? calculateEndTime(newStartTime, plan.displayDurationSeconds) : null;

    // IMPORTANT: Set the date field to match the date portion of startTime in UTC
    // This ensures the date field matches what the user sees when startTime is displayed
    // Extract the date portion from startTime (midnight UTC of that date)
    const normalizedDate = new Date(newStartTime);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    
    // Use the normalized date for availability checks
    const normalizedStartOfDay = new Date(normalizedDate);
    const normalizedEndOfDay = new Date(normalizedDate);
    normalizedEndOfDay.setUTCHours(23, 59, 59, 999);

    // Get all existing schedules for this location and date (including those with times)
    const existingSchedules = await prisma.schedule.findMany({
      where: {
        locationId,
        date: {
          gte: normalizedStartOfDay,
          lte: normalizedEndOfDay,
        },
        isAvailable: false,
        startTime: { not: null },
      },
      include: {
        bookings: {
          where: {
            status: {
              notIn: ['CANCELLED', 'DRAFT'],
            },
          },
          include: {
            plan: {
              select: { displayDurationSeconds: true },
            },
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Filter to only schedules with active bookings
    const activeSchedules = existingSchedules.filter(s => s.bookings.length > 0);

    // Check for exact time slot collision (same time slot at same location)
    for (const existingSchedule of activeSchedules) {
      if (!existingSchedule.startTime) {
        continue;
      }

      const existingStart = new Date(existingSchedule.startTime);
      const existingEnd = existingSchedule.endTime ? new Date(existingSchedule.endTime) : null;

      // Check for exact time slot collision
      if (hasTimeCollision(existingStart, existingEnd, newStartTime, newEndTime)) {
        const bookedBy = existingSchedule.bookings[0]?.user 
          ? `${existingSchedule.bookings[0].user.firstName || ''} ${existingSchedule.bookings[0].user.lastName || ''}`.trim() || existingSchedule.bookings[0].user.email
          : 'Another user';
        
        return res.status(409).json({
          error: 'Time slot conflicts with existing booking.',
          conflict: {
            existingStart: existingStart.toISOString(),
            existingEnd: existingEnd?.toISOString() || null,
            requestedStart: newStartTime.toISOString(),
            requestedEnd: newEndTime?.toISOString() || null,
            bookedBy: bookedBy,
          },
          message: `There is already a slot created for this particular location at this time. Please select a different time.`,
        });
      }
    }

    const schedule = await prisma.schedule.create({
      data: {
        locationId,
        // Use normalized date (midnight UTC of the date that startTime represents)
        // This ensures date matches the calendar date when startTime is displayed
        date: normalizedDate,
        startTime: newStartTime,
        endTime: newEndTime, // Store calculated end time (or null for custom plan)
        userId: req.user.userId,
        isAvailable: false,
      },
    });

    // Format duration message
    let durationMessage = 'Duration will be set when plan is selected';
    if (plan) {
      if (plan.displayDurationSeconds === null) {
        durationMessage = 'Custom duration - Admin will contact you for details';
      } else {
        durationMessage = `${plan.displayDurationSeconds} seconds`;
      }
    }

    res.status(201).json({ 
      schedule,
      plan: plan ? {
        id: plan.id,
        name: plan.name,
        displayDurationSeconds: plan.displayDurationSeconds,
      } : null,
      duration: durationMessage,
      endTime: newEndTime?.toISOString() || null,
      isCustomPlan: plan?.displayDurationSeconds === null || false,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserSchedules = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        userId: req.user.userId,
      },
      include: {
        location: true,
      },
      orderBy: { date: 'desc' },
    });

    res.json({ schedules });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

