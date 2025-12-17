/**
 * Date formatting utilities
 * Formats dates and times using local timezone to preserve user's selected date/time
 */

/**
 * Format a date to a readable string (e.g., "Monday, December 22, 2025")
 * Uses local timezone to preserve the user's selected date
 * @param date - The date to format
 * @param startTime - Optional startTime to use its local date components (preserves user's selected date)
 */
export function formatDate(date: Date | string, startTime?: Date | string | null): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // If startTime is provided, use its local date components to preserve user's selected date
  let dateToFormat = d;
  if (startTime) {
    const st = typeof startTime === 'string' ? new Date(startTime) : startTime;
    // Get LOCAL date components (not UTC) to preserve user's selection
    const localYear = st.getFullYear();
    const localMonth = st.getMonth();
    const localDate = st.getDate();
    // Create a new date object using local components
    dateToFormat = new Date(localYear, localMonth, localDate);
  }
  
  // Use local timezone methods to preserve user's selected date
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[dateToFormat.getDay()];
  const monthName = months[dateToFormat.getMonth()];
  const day = dateToFormat.getDate();
  const year = dateToFormat.getFullYear();
  
  return `${dayName}, ${monthName} ${day}, ${year}`;
}

/**
 * Format a time to a readable string (e.g., "10:15 PM")
 * Uses local timezone to preserve the user's selected time
 */
export function formatTime(date: Date | string | null): string | null {
  if (!date) return null;
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Use local timezone methods to preserve user's selected time
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${hours}:${minutesStr} ${ampm}`;
}

/**
 * Format date and time together (e.g., "Monday, December 22, 2025 at 10:15 PM")
 * @param date - The date to format
 * @param time - The time to format (also used for date components if provided)
 */
export function formatDateTime(date: Date | string, time: Date | string | null): string {
  const formattedDate = formatDate(date, time);
  const formattedTime = formatTime(time);
  
  return formattedTime ? `${formattedDate} at ${formattedTime}` : formattedDate;
}

/**
 * Convert UTC time to IST (UTC+5:30) and get IST components
 * @param utcDate - UTC date string or Date object
 * @returns Object with IST date/time components
 */
function getISTComponents(utcDate: Date | string): { year: number; month: number; date: number; hours: number; minutes: number; day: number } {
  const d = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  // IST is UTC+5:30, so add 5 hours and 30 minutes (5.5 hours in milliseconds)
  const istTimestamp = d.getTime() + (5.5 * 60 * 60 * 1000);
  const istDate = new Date(istTimestamp);
  
  // Get IST components using UTC methods (since we've already added the offset)
  return {
    year: istDate.getUTCFullYear(),
    month: istDate.getUTCMonth(),
    date: istDate.getUTCDate(),
    hours: istDate.getUTCHours(),
    minutes: istDate.getUTCMinutes(),
    day: istDate.getUTCDay(),
  };
}

/**
 * Format a date to IST timezone (e.g., "Monday, December 22, 2025")
 * @param date - The date to format (UTC)
 * @param startTime - Optional startTime to use its IST date components
 */
export function formatDateIST(date: Date | string, startTime?: Date | string | null): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // If startTime is provided, use its IST date components
  let istComponents;
  if (startTime) {
    istComponents = getISTComponents(startTime);
  } else {
    istComponents = getISTComponents(d);
  }
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[istComponents.day];
  const monthName = months[istComponents.month];
  const day = istComponents.date;
  const year = istComponents.year;
  
  return `${dayName}, ${monthName} ${day}, ${year}`;
}

/**
 * Format a time to IST timezone (e.g., "10:15 PM")
 * @param date - The UTC date to format
 */
export function formatTimeIST(date: Date | string | null): string | null {
  if (!date) return null;
  
  // Get IST components
  const ist = getISTComponents(date);
  
  let hours = ist.hours;
  const minutes = ist.minutes;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${hours}:${minutesStr} ${ampm}`;
}

/**
 * Format date and time together in IST (e.g., "Monday, December 22, 2025 at 10:15 PM")
 * @param date - The date to format (UTC)
 * @param time - The time to format (UTC, also used for date components if provided)
 */
export function formatDateTimeIST(date: Date | string, time: Date | string | null): string {
  const formattedDate = formatDateIST(date, time);
  const formattedTime = formatTimeIST(time);
  
  return formattedTime ? `${formattedDate} at ${formattedTime}` : formattedDate;
}

/**
 * Convert UTC date to IST ISO string (adds 5:30 hours to UTC)
 * @param utcDate - UTC date string or Date object
 * @returns ISO string representing the same moment but with IST offset
 */
export function convertToISTISO(utcDate: Date | string | null): string | null {
  if (!utcDate) return null;
  const d = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  // IST is UTC+5:30, so add 5 hours and 30 minutes
  const istTime = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
  return istTime.toISOString();
}


