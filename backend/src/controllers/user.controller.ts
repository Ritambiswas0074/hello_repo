import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userId = req.user.userId;

    // Get all user data in parallel
    const [bookings, media, schedules] = await Promise.all([
      prisma.booking.findMany({
        where: { userId },
        include: {
          location: true,
          schedule: true,
          media: true,
          template: true,
          plan: true,
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10, // Latest 10 bookings
      }),
      prisma.media.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20, // Latest 20 media items
        select: {
          id: true,
          userId: true,
          templateId: true,
          featureType: true, // Explicitly include featureType
          type: true,
          url: true,
          cloudinaryId: true,
          thumbnailUrl: true,
          filename: true,
          mimeType: true,
          size: true,
          width: true,
          height: true,
          duration: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.schedule.findMany({
        where: { userId },
        include: {
          location: true,
        },
        orderBy: { date: 'desc' },
        take: 10, // Latest 10 schedules
      }),
    ]);

    // Get statistics
    const stats = {
      totalBookings: await prisma.booking.count({ where: { userId } }),
      totalMedia: await prisma.media.count({ where: { userId } }),
      activeBookings: await prisma.booking.count({
        where: { userId, status: 'ACTIVE' },
      }),
      pendingPayments: await prisma.booking.count({
        where: { userId, status: 'PENDING_PAYMENT' },
      }),
    };

    res.json({
      bookings,
      media,
      schedules,
      stats,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

