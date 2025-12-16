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
