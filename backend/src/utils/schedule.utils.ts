/**
 * Schedule utility functions for collision detection
 */

/**
 * Check if two time slots have a collision (exact time slot match only)
 * No gap required - only exact overlaps are considered collisions
 * @param start1 Start time of first booking
 * @param end1 End time of first booking (can be null for custom plans)
 * @param start2 Start time of second booking
 * @param end2 End time of second booking (can be null for custom plans)
 * @returns true if there's an exact time slot collision
 */
export function hasTimeCollision(
  start1: Date,
  end1: Date | null,
  start2: Date,
  end2: Date | null
): boolean {
  // Convert to timestamps for easier comparison
  const start1Time = start1.getTime();
  const start2Time = start2.getTime();

  // If either booking has no end time (custom plan), check if start times are exactly the same
  if (end1 === null || end2 === null) {
    // For custom plans, check if start times are exactly the same
    return start1Time === start2Time;
  }

  const end1Time = end1.getTime();
  const end2Time = end2.getTime();

  // Check if time slots overlap exactly (no gap required)
  // Two time slots collide if they overlap at all
  const collision = (start2Time < end1Time && end2Time > start1Time);

  return collision;
}

/**
 * Calculate end time from start time using plan-based duration
 * @param startTime Start time of the booking
 * @param durationSeconds Duration in seconds (15, 30, or null for custom)
 * @returns End time (startTime + duration) or null if custom plan
 */
export function calculateEndTime(startTime: Date, durationSeconds: number | null): Date | null {
  if (durationSeconds === null) {
    // Custom plan - no end time
    return null;
  }
  
  const endTime = new Date(startTime);
  endTime.setSeconds(endTime.getSeconds() + durationSeconds);
  return endTime;
}

/**
 * Check if a time slot is available
 * @param existingSchedules Array of existing schedules with startTime and endTime
 * @param newStartTime New booking start time
 * @param newDurationSeconds New booking duration in seconds (or null for custom)
 * @returns Object with availability status and conflict details
 */
export function checkTimeSlotAvailability(
  existingSchedules: Array<{ startTime: Date | null; endTime?: Date | null }>,
  newStartTime: Date,
  newDurationSeconds: number | null
): { available: boolean; conflict?: { startTime: Date; endTime: Date | null } } {
  // Calculate end time for new booking
  const newEndTime = calculateEndTime(newStartTime, newDurationSeconds);

  for (const schedule of existingSchedules) {
    if (!schedule.startTime) {
      continue; // Skip schedules without start time
    }

    const existingEndTime = schedule.endTime || null;

    if (hasTimeCollision(schedule.startTime, existingEndTime, newStartTime, newEndTime)) {
      return {
        available: false,
        conflict: {
          startTime: schedule.startTime,
          endTime: existingEndTime,
        },
      };
    }
  }

  return { available: true };
}

/**
 * Format time for display
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get booking duration in seconds based on plan
 */
export function getBookingDuration(planDisplayDurationSeconds: number | null): number | null {
  return planDisplayDurationSeconds;
}

