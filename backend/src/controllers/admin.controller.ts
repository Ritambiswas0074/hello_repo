import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';
import { formatDate, formatTime, formatDateTime } from '../utils/date.utils';
// Removed calculateEndTime import - can't calculate without plan info

// Get all bookings for admin view (master table)
export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { status, locationId, startDate, endDate } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (locationId) {
      where.locationId = locationId;
    }

    if (startDate || endDate) {
      where.schedule = {
        date: {},
      };
      if (startDate) {
        where.schedule.date.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.schedule.date.lte = new Date(endDate as string);
      }
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
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
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format response for admin view
    const formattedBookings = bookings.map((booking) => {
      const eventDate = new Date(booking.schedule.date);
      const startTime = booking.schedule.startTime ? new Date(booking.schedule.startTime) : null;
      // Calculate end time if not stored (for backward compatibility)
      // For admin view, if endTime is missing, we can't calculate it without plan info
      // So we'll just use the stored endTime or null
      const endTime = booking.schedule.endTime 
        ? new Date(booking.schedule.endTime) 
        : null;

      // Format date and time for display using local timezone to preserve user's selection
      const formattedDate = formatDate(eventDate, startTime);
      const formattedStartTime = formatTime(startTime);
      const formattedEndTime = formatTime(endTime);

      // Only show start time (no end time range)
      const timeSlot = formattedStartTime || 'Time not specified';

      return {
        id: booking.id,
        userName: `${booking.user.firstName || ''} ${booking.user.lastName || ''}`.trim() || booking.user.email,
        userEmail: booking.user.email,
        userPhone: booking.user.phone,
        locationName: booking.location.name,
        locationCity: booking.location.city,
        locationAddress: booking.location.address,
        // Date information
        eventDate: booking.schedule.date,
        eventDateFormatted: formattedDate,
        // Time information
        eventStartTime: booking.schedule.startTime,
        eventEndTime: booking.schedule.endTime,
        eventStartTimeFormatted: formattedStartTime,
        eventEndTimeFormatted: formattedEndTime,
        eventTimeSlot: timeSlot,
        // Combined date and time for easy viewing
        eventDateTime: formatDateTime(eventDate, startTime),
        mediaFilename: booking.media.filename,
        mediaType: booking.media.type,
        mediaFeatureType: booking.media.featureType,
        planName: booking.plan.name,
        planPrice: booking.plan.price,
        bookingStatus: booking.status,
        paymentStatus: booking.payment?.status || 'NO_PAYMENT',
        paymentAmount: booking.payment?.amount || 0,
        paymentConfirmed: booking.payment?.status === 'SUCCEEDED',
        paymentRejected: booking.payment?.status === 'FAILED',
        paymentFailureReason: booking.payment?.failureReason,
        stripePaymentId: booking.payment?.stripePaymentId,
        paidAt: booking.payment?.paidAt,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
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

// Get booking statistics for admin dashboard
export const getBookingStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const [
      totalBookings,
      pendingPayments,
      approvedPayments,
      activeBookings,
      totalRevenue,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({
        where: {
          payment: {
            status: 'PENDING',
          },
        },
      }),
      prisma.booking.count({
        where: {
          payment: {
            status: 'SUCCEEDED',
          },
        },
      }),
      prisma.booking.count({
        where: {
          status: 'ACTIVE',
        },
      }),
      prisma.payment.aggregate({
        where: {
          status: 'SUCCEEDED',
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    res.json({
      totalBookings,
      pendingPayments,
      approvedPayments,
      activeBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all user activity with comprehensive information
// No authentication required - public endpoint
export const getAllUserActivity = async (req: Request, res: Response) => {
  try {
    // Get all users with their complete activity
    const users = await prisma.user.findMany({
      include: {
        bookings: {
          include: {
            location: {
              select: {
                id: true,
                name: true,
                city: true,
                address: true,
                latitude: true,
                longitude: true,
              },
            },
            schedule: {
              select: {
                id: true,
                date: true,
                startTime: true,
                endTime: true,
                createdAt: true,
              },
            },
            media: {
              select: {
                id: true,
                filename: true,
                type: true,
                featureType: true, // Include featureType (yourself, loved-ones, family, branding)
                url: true,
                thumbnailUrl: true,
                size: true,
                width: true,
                height: true,
                duration: true,
                description: true,
                createdAt: true,
              },
            },
            template: {
              select: {
                id: true,
                name: true,
                description: true,
                previewUrl: true,
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
                currency: true,
                status: true,
                stripePaymentId: true,
                failureReason: true,
                paidAt: true,
                createdAt: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        mediaGallery: {
          select: {
            id: true,
            userId: true,
            templateId: true,
            featureType: true,
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
            template: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        schedules: {
          include: {
            location: {
              select: {
                id: true,
                name: true,
                city: true,
              },
            },
          },
          orderBy: { date: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format response with comprehensive user activity
    const formattedUsers = users.map((user) => {
      // Format bookings
      const formattedBookings = user.bookings.map((booking) => {
        // IMPORTANT: Use startTime's date for display, not the date field
        // This ensures the displayed date matches what the user selected
        const startTime = booking.schedule.startTime ? new Date(booking.schedule.startTime) : null;
        // Use stored endTime or null (can't calculate without plan info)
        const endTime = booking.schedule.endTime 
          ? new Date(booking.schedule.endTime) 
          : null;

        // If we have startTime, use its date portion; otherwise use the date field
        const eventDate = startTime || new Date(booking.schedule.date);
        
        // Format date and time for display using local timezone to preserve user's selection
        const formattedDate = formatDate(eventDate, startTime);
        const formattedStartTime = formatTime(startTime);
        const formattedEndTime = formatTime(endTime);

        // Only show start time (no end time range)
        const timeSlot = formattedStartTime || 'Time not specified';

        // Find media items uploaded specifically for THIS booking/schedule
        // Use schedule creation time and booking creation time to identify the session
        const bookingCreatedAt = new Date(booking.createdAt);
        
        // Use schedule createdAt if available, otherwise use schedule date as fallback
        const scheduleCreatedAt = booking.schedule.createdAt 
          ? new Date(booking.schedule.createdAt)
          : new Date(booking.schedule.date);
        
        // Media should be uploaded:
        // 1. After or around the time the schedule was created (user uploads media after selecting schedule)
        // 2. Before or just after the booking was created (within 15 minutes)
        // 3. Only media with the same featureType as the booking's media (same purpose)
        
        // Start from 30 minutes before schedule creation (in case user uploaded media first)
        const timeWindowStart = new Date(scheduleCreatedAt);
        timeWindowStart.setMinutes(timeWindowStart.getMinutes() - 30);
        
        // End 15 minutes after booking creation (buffer for timing)
        const timeWindowEnd = new Date(bookingCreatedAt);
        timeWindowEnd.setMinutes(timeWindowEnd.getMinutes() + 15);

        // Get media uploaded in this specific booking session window
        // AND with the same featureType (to ensure it's for the same booking purpose)
        let relatedMedia = user.mediaGallery.filter((media) => {
          const mediaCreatedAt = new Date(media.createdAt);
          const isInTimeWindow = mediaCreatedAt >= timeWindowStart && mediaCreatedAt <= timeWindowEnd;
          
          // Only include media with the same featureType as the booking's primary media
          // This ensures we only get media uploaded for THIS specific booking
          const hasSameFeatureType = booking.media.featureType 
            ? (media.featureType === booking.media.featureType)
            : true; // If booking media has no featureType, include all (for backward compatibility)
          
          return isInTimeWindow && hasSameFeatureType;
        });

        // If we have the booking's media featureType, prioritize media with the same featureType
        if (booking.media.featureType && relatedMedia.length > 0) {
          const sameFeatureTypeMedia = relatedMedia.filter(m => m.featureType === booking.media.featureType);
          if (sameFeatureTypeMedia.length > 0) {
            // Use media with same featureType, but also include others from the time window
            // Sort: same featureType first, then others
            relatedMedia.sort((a, b) => {
              const aHasSameType = a.featureType === booking.media.featureType;
              const bHasSameType = b.featureType === booking.media.featureType;
              if (aHasSameType && !bHasSameType) return -1;
              if (!aHasSameType && bHasSameType) return 1;
              // Both have same or different type, sort by date
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
          }
        } else {
          // Sort by creation date (newest first)
          relatedMedia.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
        }

        // Ensure the primary booking media is included
        const primaryMediaId = booking.media.id;
        const hasPrimaryMedia = relatedMedia.some(m => m.id === primaryMediaId);
        
        // Format all related media items
        let formattedMedia = relatedMedia.map((media) => ({
          id: media.id,
          filename: media.filename,
          type: media.type,
          featureType: media.featureType,
          url: media.url,
          thumbnailUrl: media.thumbnailUrl,
          size: media.size,
          width: media.width,
          height: media.height,
          duration: media.duration,
          description: media.description,
          uploadedAt: media.createdAt,
        }));

        // If primary media is not in the list, add it at the beginning
        if (!hasPrimaryMedia) {
          formattedMedia.unshift({
            id: booking.media.id,
            filename: booking.media.filename,
            type: booking.media.type,
            featureType: booking.media.featureType,
            url: booking.media.url,
            thumbnailUrl: booking.media.thumbnailUrl,
            size: booking.media.size,
            width: booking.media.width,
            height: booking.media.height,
            duration: booking.media.duration,
            description: booking.media.description,
            uploadedAt: booking.media.createdAt,
          });
        }

        // If no related media found, use the primary media
        if (formattedMedia.length === 0) {
          formattedMedia = [{
            id: booking.media.id,
            filename: booking.media.filename,
            type: booking.media.type,
            featureType: booking.media.featureType,
            url: booking.media.url,
            thumbnailUrl: booking.media.thumbnailUrl,
            size: booking.media.size,
            width: booking.media.width,
            height: booking.media.height,
            duration: booking.media.duration,
            description: booking.media.description,
            uploadedAt: booking.media.createdAt,
          }];
        }

        // Debug logging to verify we're returning an array
        console.log(`[getAllUserActivity] Booking ${booking.id}: Found ${formattedMedia.length} media items for this specific booking`, {
          bookingCreatedAt: booking.createdAt,
          scheduleCreatedAt: booking.schedule.createdAt || booking.schedule.date,
          timeWindow: {
            start: timeWindowStart.toISOString(),
            end: timeWindowEnd.toISOString()
          },
          primaryMediaId: booking.media.id,
          primaryMediaFeatureType: booking.media.featureType,
          mediaIds: formattedMedia.map(m => ({ id: m.id, featureType: m.featureType })),
          isArray: Array.isArray(formattedMedia)
        });

        return {
          bookingId: booking.id,
          bookingStatus: booking.status,
          bookingCreatedAt: booking.createdAt,
          bookingUpdatedAt: booking.updatedAt,
          bookingNotes: booking.notes,
          // Location information
          location: {
            id: booking.location.id,
            name: booking.location.name,
            city: booking.location.city,
            address: booking.location.address,
            latitude: booking.location.latitude,
            longitude: booking.location.longitude,
          },
          // Schedule information
          schedule: {
            id: booking.schedule.id,
            date: booking.schedule.date,
            dateFormatted: formattedDate,
            startTime: booking.schedule.startTime,
            endTime: booking.schedule.endTime || (startTime ? endTime?.toISOString() : null),
            startTimeFormatted: formattedStartTime,
            endTimeFormatted: formattedEndTime,
            timeSlot: timeSlot,
            eventDateTime: formatDateTime(eventDate, startTime),
          },
          // Media information - ALWAYS an array of all related media
          // Ensure it's always an array, never a single object
          media: Array.isArray(formattedMedia) ? formattedMedia : [formattedMedia].filter(Boolean),
          // Also include a count for convenience
          mediaCount: Array.isArray(formattedMedia) ? formattedMedia.length : (formattedMedia ? 1 : 0),
          // Template information
          template: {
            id: booking.template.id,
            name: booking.template.name,
            description: booking.template.description,
            previewUrl: booking.template.previewUrl,
          },
          // Plan information
          plan: {
            id: booking.plan.id,
            name: booking.plan.name,
            price: booking.plan.price,
            duration: booking.plan.duration,
            features: booking.plan.features,
          },
          // Payment information
          payment: booking.payment ? {
            id: booking.payment.id,
            amount: booking.payment.amount,
            currency: booking.payment.currency,
            status: booking.payment.status,
            paymentSuccessful: booking.payment.status === 'SUCCEEDED',
            paymentRejected: booking.payment.status === 'FAILED',
            paymentPending: booking.payment.status === 'PENDING' || booking.payment.status === 'PROCESSING',
            failureReason: booking.payment.failureReason,
            stripePaymentId: booking.payment.stripePaymentId,
            paidAt: booking.payment.paidAt,
            createdAt: booking.payment.createdAt,
          } : null,
        };
      });

      // Separate images and videos from all media
      const allImages = user.mediaGallery.filter(m => {
        const mediaType = m.type?.toUpperCase();
        return mediaType === 'IMAGE';
      });
      const allVideos = user.mediaGallery.filter(m => {
        const mediaType = m.type?.toUpperCase();
        return mediaType === 'VIDEO';
      });

      return {
        // User information
        userId: user.id,
        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        userFirstName: user.firstName,
        userLastName: user.lastName,
        userEmail: user.email,
        userPhone: user.phone,
        userRole: user.role,
        userCreatedAt: user.createdAt,
        userUpdatedAt: user.updatedAt,
        // Bookings summary
        totalBookings: user.bookings.length,
        bookings: formattedBookings,
        // Media summary
        totalMediaUploads: user.mediaGallery.length,
        totalImages: allImages.length,
        totalVideos: allVideos.length,
        // All uploaded images
        uploadedImages: allImages.map(img => ({
          id: img.id,
          filename: img.filename,
          type: img.type,
          featureType: img.featureType, // Include featureType (yourself, loved-ones, family, branding)
          url: img.url,
          thumbnailUrl: img.thumbnailUrl,
          size: img.size,
          width: img.width,
          height: img.height,
          description: img.description,
          template: img.template ? {
            id: img.template.id,
            name: img.template.name,
            description: img.template.description,
          } : null,
          uploadedAt: img.createdAt,
        })),
        // All uploaded videos
        uploadedVideos: allVideos.map(vid => ({
          id: vid.id,
          filename: vid.filename,
          type: vid.type,
          featureType: vid.featureType, // Include featureType (yourself, loved-ones, family, branding)
          url: vid.url,
          thumbnailUrl: vid.thumbnailUrl,
          size: vid.size,
          width: vid.width,
          height: vid.height,
          duration: vid.duration,
          description: vid.description,
          template: vid.template ? {
            id: vid.template.id,
            name: vid.template.name,
            description: vid.template.description,
          } : null,
          uploadedAt: vid.createdAt,
        })),
        // Schedules summary
        totalSchedules: user.schedules.length,
        schedules: user.schedules.map(schedule => ({
          id: schedule.id,
          date: schedule.date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isAvailable: schedule.isAvailable,
          location: {
            id: schedule.location.id,
            name: schedule.location.name,
            city: schedule.location.city,
          },
          createdAt: schedule.createdAt,
        })),
        // Payment summary
        paymentSummary: {
          totalPayments: formattedBookings.filter(b => b.payment !== null).length,
          successfulPayments: formattedBookings.filter(b => b.payment?.paymentSuccessful).length,
          rejectedPayments: formattedBookings.filter(b => b.payment?.paymentRejected).length,
          pendingPayments: formattedBookings.filter(b => b.payment?.paymentPending).length,
          totalAmountPaid: formattedBookings
            .filter(b => b.payment?.paymentSuccessful)
            .reduce((sum, b) => sum + (b.payment?.amount || 0), 0),
        },
      };
    });

    // Calculate overall statistics
    const totalUsers = formattedUsers.length;
    const totalBookings = formattedUsers.reduce((sum, u) => sum + u.totalBookings, 0);
    const totalMedia = formattedUsers.reduce((sum, u) => sum + u.totalMediaUploads, 0);
    const totalImages = formattedUsers.reduce((sum, u) => sum + u.totalImages, 0);
    const totalVideos = formattedUsers.reduce((sum, u) => sum + u.totalVideos, 0);
    const totalSuccessfulPayments = formattedUsers.reduce((sum, u) => sum + u.paymentSummary.successfulPayments, 0);
    const totalRejectedPayments = formattedUsers.reduce((sum, u) => sum + u.paymentSummary.rejectedPayments, 0);
    const totalAmountPaid = formattedUsers.reduce((sum, u) => sum + u.paymentSummary.totalAmountPaid, 0);

    res.json({
      success: true,
      totalUsers,
      summary: {
        totalUsers,
        totalBookings,
        totalMediaUploads: totalMedia,
        totalImages,
        totalVideos,
        totalSuccessfulPayments,
        totalRejectedPayments,
        totalAmountPaid,
      },
      users: formattedUsers,
    });
  } catch (error: any) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ error: error.message });
  }
};

